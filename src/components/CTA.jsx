import React from 'react';
import { motion } from 'framer-motion';
import { FaSpotify, FaApple } from 'react-icons/fa';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta-section">
      <motion.div 
        className="cta-content"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h2 className="cta-title">Experience the Full Symphony</h2>
        <p className="cta-subtitle">Dive deep into the cinematic universe. Available on all major platforms.</p>
        
        <div className="cta-buttons">
          <a href="https://open.spotify.com/artist/3J32qUBrFQWVPd6M2XqEWn?si=ut9swao0RMubwkXGG6FRfA" target="_blank" rel="noreferrer" className="cta-btn spotify-btn">
            <FaSpotify size={28} />
            <span>Listen on Spotify</span>
          </a>
          <a href="https://music.apple.com/us/artist/prajal-sonariya/1782069169" target="_blank" rel="noreferrer" className="cta-btn apple-btn">
            <FaApple size={30} />
            <span>Listen on Apple Music</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default CTA;
