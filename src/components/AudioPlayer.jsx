import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, FastForward, Rewind } from 'lucide-react';
import './AudioPlayer.css';

const AudioPlayer = ({ title, src, index }) => {
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const contextRef = useRef(null);
  const analyserRef = useRef(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });
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

  // Strict high-res ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !canvasRef.current) return;
    
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        // Enforce physical sub-pixels for 4K pristine rendering
        const dpr = window.devicePixelRatio || 1;
        const width = entry.contentRect.width;
        const height = entry.contentRect.height;
        
        canvasRef.current.width = width * dpr;
        canvasRef.current.height = height * dpr;
        canvasRef.current.style.width = `${width}px`;
        canvasRef.current.style.height = `${height}px`;
        
        sizeRef.current = { width: width * dpr, height: height * dpr, dpr };
      }
    });
    
    observer.observe(container);
    return () => observer.disconnect();
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
      
      analyser.fftSize = 512; 
      
      contextRef.current = actx;
      analyserRef.current = analyser;
    } catch (e) {
      console.warn("Could not setup audio context", e);
    }
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const smoothData = new Float32Array(bufferLength);
    
    let time = 0;
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      
      for(let i = 0; i < bufferLength; i++) {
        smoothData[i] += ((dataArray[i] / 255) - smoothData[i]) * 0.15;
      }
      
      const { width, height } = sizeRef.current;
      if (width === 0 || height === 0) return;
      
      // We do NOT use ctx.scale here anymore! We are drawing 1:1 on actual hardware physical pixels.
      // This guarantees absolutely no pixelation scaling up.
      ctx.clearRect(0, 0, width, height);
      
      time += 0.03;
      // Anchor the waves slightly lower so the text area on top remains purely legible
      const centerY = height * 0.7; 
      
      const drawReactiveWave = (offsetBin, timeMultiplier, phaseOffset, colorSpec, maxAmp, waveLengthMultiplier) => {
          ctx.beginPath();
          ctx.moveTo(0, centerY);
          
          for (let x = 0; x <= width; x += 1) {
              const percent = x / width;
              
              // True fractional Linear Interpolation (Lerp) to obliterate geometry stair-steps
              const exactBin = (percent * 60) + offsetBin;
              const binLower = Math.floor(exactBin);
              const binUpper = Math.ceil(exactBin);
              const binFraction = exactBin - binLower;
              
              const ampLower = smoothData[binLower] || 0;
              const ampUpper = smoothData[binUpper] || 0;
              const rawAmp = ampLower + (ampUpper - ampLower) * binFraction;
              
              // Normalizing the wave frequency size so it looks identically scaled on Mobile vs 4K
              const dprScale = sizeRef.current.dpr;
              const waveSine = Math.sin((x / dprScale * waveLengthMultiplier) + (time * timeMultiplier) + phaseOffset);
              
              // Bouncy music scaling, limits how far it peaks up/down
              const y = centerY - (waveSine * rawAmp * maxAmp) - (waveSine * (height * 0.04));
              
              ctx.lineTo(x, y);
          }
          
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
          ctx.closePath();
          
          ctx.fillStyle = colorSpec;
          ctx.fill();
      };

      ctx.globalCompositeOperation = 'screen';
      
      // Deep blue (Bass dominant)
      drawReactiveWave(0, 1.2, 0, `rgba(58, 107, 156, 0.4)`, height * 0.4, 0.006); 
      // Purple
      drawReactiveWave(5, 1.0, Math.PI / 2, `rgba(120, 80, 160, 0.35)`, height * 0.3, 0.008); 
      // Light blue
      drawReactiveWave(10, 0.8, Math.PI, `rgba(80, 160, 220, 0.25)`, height * 0.2, 0.010); 
      
      ctx.globalCompositeOperation = 'source-over';
      
      // A gentle gradient floor at the absolute bottom
      const gradient = ctx.createLinearGradient(0, height - 20, 0, height);
      gradient.addColorStop(0, "rgba(255,255,255,0)");
      gradient.addColorStop(1, "rgba(255,255,255,0.05)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, height - 20, width, 20);
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
          if (!animationRef.current) drawVisualizer();
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
      {/* Absolute Ambient Aura Waves placed gracefully behind text */}
      <div className="visualizer-timeline-container" ref={containerRef}>
        <canvas ref={canvasRef} className="timeline-canvas"></canvas>
      </div>

      <div className="controls-container">
        <div className="track-info">
          <span className="track-title">{title}</span>
          <span className="track-status">{isPlaying ? 'Now Playing' : 'Ready'}</span>
        </div>
        
        <div className="complex-controls">
          <button className="icon-btn minor-btn" aria-label="Rewind"><Rewind size={22} /></button>
          <button className="play-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="play-icon-offset" />}
          </button>
          <button className="icon-btn minor-btn" aria-label="Fast Forward"><FastForward size={22} /></button>
        </div>
      </div>
      
      {/* Elegant minimalist timeline completely uncoupled from the visualizer mask */}
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
