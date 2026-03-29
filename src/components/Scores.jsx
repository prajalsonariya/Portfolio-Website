import React from 'react';
import { motion } from 'framer-motion';
import AudioPlayer from './AudioPlayer';
import './Scores.css';

const compositions = [
  { id: 1, title: 'Die-Ra', src: '/audio/Die-Ra.mp3', phrase: 'Aggression is what I need' },
  { id: 2, title: 'Love Anthem', src: '/audio/Love Anthem.mp3', phrase: 'Love is in the Air' },
  { id: 3, title: 'The Headache', src: '/audio/The Headache.mp3', phrase: 'Woodwinds are my friends' },
];

const Scores = () => {
  return (
    <section id="scores" className="scores-section">
      <motion.div 
        className="section-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="section-title">Scores</h2>
        <div className="title-underline"></div>
      </motion.div>
      
      <div className="tracks-grid">
        {compositions.map((track, i) => (
          <AudioPlayer key={track.id} index={i} title={track.title} src={track.src} phrase={track.phrase} />
        ))}
      </div>
    </section>
  );
};

export default Scores;
