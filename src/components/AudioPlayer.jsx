import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, FastForward, Rewind } from 'lucide-react';
import './AudioPlayer.css';

const AudioPlayer = ({ title, src, index, phrase }) => {
  const audioRef = useRef(null);
  const glowRef = useRef(null);
  const animationRef = useRef(null);
  const contextRef = useRef(null);
  const analyserRef = useRef(null);
  const progressRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        const val = (audio.currentTime / audio.duration) * 100;
        setProgress(val);
        progressRef.current = val;
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      progressRef.current = 0;
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const setupAudioContext = () => {
    if (contextRef.current) return;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const actx = new AudioContext();
      const analyser = actx.createAnalyser();
      
      const source = actx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(actx.destination);
      
      analyser.fftSize = 256; 
      
      contextRef.current = actx;
      analyserRef.current = analyser;
    } catch (e) {
      console.warn("Could not setup audio context", e);
    }
  };

  const drawReactivePulse = () => {
    if (!analyserRef.current || !glowRef.current) return;
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    let currentSmooth = 0;
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      
      // Focus on lower frequencies (bass/mid) for a cinematic pulse
      let sum = 0;
      const binCount = 15;
      for(let i = 0; i < binCount; i++) {
        sum += dataArray[i];
      }
      
      const rawVolume = sum / binCount / 255;
      
      // Smooth interpolation
      currentSmooth += (rawVolume - currentSmooth) * 0.15;
      
      // Map it to CSS scale and opacity
      const scale = 1 + (currentSmooth * 0.8); // Breathes up to 1.8x size
      const opacity = Math.max(0.1, currentSmooth * 0.7);
      
      if (glowRef.current) {
        glowRef.current.style.transform = `scale(${scale})`;
        glowRef.current.style.opacity = opacity;
      }
    };
    
    draw();
  };

  const togglePlay = () => {
    setupAudioContext();
    
    if (contextRef.current && contextRef.current.state === 'suspended') {
        contextRef.current.resume();
    }

    if (audioRef.current.paused) {
      document.querySelectorAll('audio').forEach(el => {
        if (el !== audioRef.current && !el.paused) {
          el.pause();
        }
      });
      audioRef.current.play()
        .then(() => {
          if (!animationRef.current) drawReactivePulse();
        })
        .catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current.pause();
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  return (
    <motion.div 
      className="audio-player-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.15, type: "spring", bounce: 0.3 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="controls-container">
        <div className="track-info">
          <span className="track-title">{title}</span>
          <span className="track-status">{isPlaying ? 'Now Playing' : (phrase || 'Ready')}</span>
        </div>
        
        <div className="complex-controls">
          <button className="icon-btn minor-btn" aria-label="Rewind"><Rewind size={22} /></button>
          
          <div className="play-btn-wrapper">
            <div className="reactive-glow" ref={glowRef}></div>
            <button className="play-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="play-icon-offset" />}
            </button>
          </div>
          
          <button className="icon-btn minor-btn" aria-label="Fast Forward"><FastForward size={22} /></button>
        </div>
      </div>
      
      {/* Elegant minimalist timeline */}
      <div className="sleek-scrubber" onClick={handleSeek}>
        <div className="sleek-scrubber-fill" style={{ width: `${progress}%` }}>
            <div className="sleek-scrubber-glow"></div>
        </div>
      </div>
      
      <audio ref={audioRef} src={src} preload="metadata" crossOrigin="anonymous" />
    </motion.div>
  );
};

export default AudioPlayer;
