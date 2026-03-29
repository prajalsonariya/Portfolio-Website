import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaYoutube, FaSpotify, FaApple, FaEnvelope, FaChevronDown } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <motion.h1 
        className="hero-title"
        initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ fontFamily: "'Roxborough CF', serif", fontWeight: 400, textTransform: "none" }}
      >
        Prajal Sonariya
      </motion.h1>
      <motion.p 
        className="hero-subtitle"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Orchestral Composer
      </motion.p>
      
      <motion.nav 
        className="hero-socials"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <a href="https://www.instagram.com/prajal_sonariya" target="_blank" rel="noreferrer" className="hero-social-icon" aria-label="Instagram"><FaInstagram size={22} /></a>
        <a href="https://www.youtube.com/@Poperasity." target="_blank" rel="noreferrer" className="hero-social-icon" aria-label="YouTube"><FaYoutube size={24} /></a>
        <a href="https://open.spotify.com/artist/3J32qUBrFQWVPd6M2XqEWn?si=ut9swao0RMubwkXGG6FRfA" target="_blank" rel="noreferrer" className="hero-social-icon" aria-label="Spotify"><FaSpotify size={22} /></a>
        <a href="https://music.apple.com/us/artist/prajal-sonariya/1782069169" target="_blank" rel="noreferrer" className="hero-social-icon" aria-label="Apple Music"><FaApple size={24} /></a>
        <a href="mailto:prajalsonariya2312hp@gmail.com" className="hero-social-icon" aria-label="Email"><FaEnvelope size={22} /></a>
      </motion.nav>
      
      <motion.div 
        className="scroll-indicator"
        initial={{ opacity: 0, x: "-50%" }}
        animate={{ opacity: 1, y: [0, 8, 0], x: "-50%" }}
        transition={{ 
          opacity: { duration: 1, delay: 1.5 },
          y: { repeat: Infinity, duration: 1.5, ease: "easeOut" }
        }}
      >
        <span className="scroll-text">Scroll to Explore</span>
        <FaChevronDown size={20} className="scroll-icon" />
      </motion.div>
    </section>
  );
};

export default Hero;
