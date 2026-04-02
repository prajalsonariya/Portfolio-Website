import React, { useState, useRef, useEffect, useCallback } from 'react';
import './AudioPlayer.css';

const tracks = [
  {
    id: 1,
    title: 'Die-Ra',
    file: '/audio/Die-Ra.mp3',
    genre: 'Passionate Aggression',
    cover: '/image/Die-Ra.jpeg',
  },
  {
    id: 2,
    title: 'Love Anthem',
    file: '/audio/Love Anthem.mp3',
    genre: 'Finally Confessed',
    cover: '/image/Love Anthem.jpeg',
  },
  {
    id: 3,
    title: 'The Headache',
    file: '/audio/The Headache.mp3',
    genre: 'A Quiet Garden',
    cover: '/image/The Headache.jpeg',
  },
];

const formatTime = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const AudioPlayer = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [waveData, setWaveData] = useState(new Array(40).fill(0.08));
  const [miniVisible, setMiniVisible] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const audioRef       = useRef(null);
  const animRef        = useRef(null);
  const analyserRef    = useRef(null);
  const audioCtxRef    = useRef(null);
  const sourceRef      = useRef(null);
  const progressRef    = useRef(null);
  const sectionRef     = useRef(null);
  const miniProgressRef = useRef(null);

  const currentTrack = tracks[currentIdx];

  // ─── IntersectionObserver: show mini-player when section leaves viewport ───
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show mini-player only when section is out of view AND music is playing
        setMiniVisible(!entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // ─── Web Audio API analyser ───
  const setupAnalyser = useCallback(() => {
    if (!audioRef.current) return;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (!sourceRef.current) {
      sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.75;
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioCtxRef.current.destination);
    }
  }, []);

  // ─── Waveform draw loop (logarithmic freq map) ───
  const drawWave = useCallback(() => {
    if (!analyserRef.current || !isPlaying) return;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    const bars = 40;
    const newData = Array.from({ length: bars }, (_, i) => {
      const t = i / (bars - 1);
      const logMin = Math.log2(1);
      const logMax = Math.log2(bufferLength);
      const logIdx = Math.pow(2, logMin + (logMax - logMin) * t);
      const centerIdx = Math.min(Math.floor(logIdx), bufferLength - 1);
      const windowSize = Math.max(1, Math.floor(logIdx * 0.12));
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        sum += dataArray[Math.min(centerIdx + j, bufferLength - 1)];
      }
      const val = sum / windowSize / 255;
      return Math.max(0.06, val);
    });
    setWaveData(newData);
    animRef.current = requestAnimationFrame(drawWave);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = requestAnimationFrame(drawWave);
    } else {
      cancelAnimationFrame(animRef.current);
      setWaveData(prev => prev.map(() => 0.08));
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, drawWave]);

  // ─── Controls ───
  const togglePlay = async () => {
    if (!audioRef.current) return;
    setupAnalyser();
    if (audioCtxRef.current?.state === 'suspended') {
      await audioCtxRef.current.resume();
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
      setHasPlayed(true);
    }
  };

  const selectTrack = (idx) => {
    setCurrentIdx(idx);
    setCurrentTime(0);
    setIsPlaying(false);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.volume = volume;
      }
    }, 50);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    const next = (currentIdx + 1) % tracks.length;
    selectTrack(next);
    setTimeout(() => {
      audioRef.current?.play();
      setIsPlaying(true);
      setHasPlayed(true);
    }, 200);
  };

  const handleSeek = (e, ref) => {
    const el = ref?.current || e.currentTarget;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audioRef.current) {
      audioRef.current.currentTime = ratio * duration;
      setCurrentTime(ratio * duration);
    }
  };

  const handleVolume = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
  };

  // Scroll back to player section
  const scrollToPlayer = () => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const progress = duration ? currentTime / duration : 0;

  return (
    <>
      {/* ─── Main Audio Engine ─── */}
      <section className="audio-engine" id="works" ref={sectionRef}>
        <div className="audio-engine__header">
          <p className="audio-engine__tag">
            <span className="tag-diamond">◆</span> FEATURED WORKS
          </p>
          <p className="audio-engine__desc">
          A collection of recent compositions, built to make the listener feel something real.
        </p>
        </div>

        <div className="audio-engine__body">
          {/* Track list */}
          <div className="track-list">
            {tracks.map((t, i) => (
              <button
                key={t.id}
                className={`track-item ${i === currentIdx ? 'track-item--active' : ''}`}
                onClick={() => selectTrack(i)}
                data-cursor-hover
              >
                {/* Cover art thumbnail in track list */}
                <div className="track-item__cover">
                  <img src={t.cover} alt={t.title} />
                </div>
                <div className="track-item__info">
                  <span className="track-item__title">{t.title}</span>
                  <span className="track-item__genre">{t.genre}</span>
                </div>
                <div className="track-item__bars" aria-hidden="true">
                  {i === currentIdx && isPlaying ? (
                    <><span /><span /><span /></>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 2l9 5-9 5V2z" fill="currentColor" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Player panel with cover art */}
          <div className="player-panel">
            {/* Blurred cover art background */}
            <div className="player-panel__art-bg">
              <img
                src={currentTrack.cover}
                alt=""
                aria-hidden="true"
                className="player-panel__art-bg-img"
              />
            </div>

            {/* Content layer on top of blurred bg */}
            <div className="player-panel__content">
              {/* Cover art + waveform row */}
              <div className="player-panel__top-row">
                <div className="player-panel__cover">
                  <img src={currentTrack.cover} alt={currentTrack.title} />
                </div>
                {/* Live waveform visualiser */}
                <div className="visualiser" aria-hidden="true">
                  {waveData.map((h, i) => (
                    <div
                      key={i}
                      className="visualiser__bar"
                      style={{ transform: `scaleY(${h})`, opacity: 0.4 + h * 0.6 }}
                    />
                  ))}
                </div>
              </div>

              {/* Track info */}
              <div className="player-panel__track">
                <p className="player-panel__genre">{currentTrack.genre}</p>
                <h3 className="player-panel__title">{currentTrack.title}</h3>
              </div>

              {/* Progress bar */}
              <div
                className="player-progress"
                ref={progressRef}
                onClick={(e) => handleSeek(e, progressRef)}
                data-cursor-hover
              >
                <div className="player-progress__fill" style={{ width: `${progress * 100}%` }} />
              </div>
              <div className="player-times">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Controls */}
              <div className="player-controls">
                <button
                  className="ctrl-btn ctrl-btn--prev"
                  onClick={() => selectTrack((currentIdx - 1 + tracks.length) % tracks.length)}
                  aria-label="Previous track"
                  data-cursor-hover
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 20L9 12l10-8v16zM5 4v16" strokeLinecap="round" />
                  </svg>
                </button>

                <button
                  className="ctrl-btn ctrl-btn--play"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  data-cursor-hover
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" />
                      <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M5 4l15 8-15 8V4z" fill="currentColor" />
                    </svg>
                  )}
                </button>

                <button
                  className="ctrl-btn ctrl-btn--next"
                  onClick={() => selectTrack((currentIdx + 1) % tracks.length)}
                  aria-label="Next track"
                  data-cursor-hover
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 4l10 8-10 8V4zM19 4v16" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Volume */}
                <div className="volume-control" data-cursor-hover>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinecap="round" />
                    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" strokeLinecap="round" />
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolume}
                    className="volume-slider"
                    aria-label="Volume"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.file}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          preload="metadata"
        />
      </section>

      {/* ─── Floating Mini Player ─── */}
      <div
        className={`mini-player ${miniVisible && hasPlayed ? 'mini-player--visible' : ''}`}
        onClick={scrollToPlayer}
        role="button"
        tabIndex={0}
        aria-label={`Now playing: ${currentTrack.title} — click to return to player`}
        data-cursor-hover
        onKeyDown={(e) => e.key === 'Enter' && scrollToPlayer()}
      >
        {/* Blurred cover art tint — colours the glassmorphic pill */}
        <div className="mini-player__art-tint" aria-hidden="true">
          <img src={currentTrack.cover} alt="" />
        </div>

        {/* Cover art thumbnail */}
        <div className="mini-player__cover">
          <img src={currentTrack.cover} alt={currentTrack.title} />
        </div>

        {/* Track info */}
        <div className="mini-player__info">
          <span className="mini-player__title">{currentTrack.title}</span>
          <span className="mini-player__genre">{currentTrack.genre}</span>
        </div>

        {/* Play / Pause */}
        <button
          className="mini-player__playbtn"
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          data-cursor-hover
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <rect x="5" y="4" width="4" height="16" rx="1" fill="currentColor"/>
              <rect x="15" y="4" width="4" height="16" rx="1" fill="currentColor"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
              <path d="M5 4l15 8-15 8V4z" fill="currentColor"/>
            </svg>
          )}
        </button>

        {/* Progress underline */}
        <div className="mini-player__progress">
          <div className="mini-player__progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
