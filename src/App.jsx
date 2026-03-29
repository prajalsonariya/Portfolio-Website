import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Hero from './components/Hero';
import Scores from './components/Scores';
import CTA from './components/CTA';
import './App.css'; 

function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Phase 1: Hero section shrinks and fades as we scroll down
  const heroScale = useTransform(scrollYProgress, [0, 0.2, 1], [1, 0.8, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [1, 0, 0]);
  const heroFilter = useTransform(scrollYProgress, [0, 0.2, 1], ["blur(0px)", "blur(20px)", "blur(20px)"]);
  const heroPointerEvents = useTransform(scrollYProgress, [0, 0.1, 0.2], ["auto", "auto", "none"]);
  const heroDisplay = useTransform(scrollYProgress, p => p > 0.3 ? "none" : "flex");

  // On Mobile: Elements stay in the center, and Scores fades out before CTA comes in.
  // On Desktop: Elements slide to the sides and share the screen.
  
  // Phase 2: Scores component "birth" effect
  const scoreContainerScale = useTransform(
    scrollYProgress, 
    isMobile ? [0.1, 0.3, 0.5, 0.65] : [0.1, 0.3], 
    isMobile ? [0, 1, 1, 0.5] : [0, 1]
  );
  
  const scoreContainerOpacity = useTransform(
    scrollYProgress, 
    isMobile ? [0.1, 0.3, 0.5, 0.65] : [0.1, 0.3], 
    isMobile ? [0, 1, 1, 0] : [0, 1]
  );
  
  const scoreContainerX = useTransform(
    scrollYProgress, 
    [0.3, 0.5], 
    isMobile ? ["0vw", "0vw"] : ["0vw", "25vw"]
  );

  const scorePointerEvents = useTransform(
    scrollYProgress,
    isMobile ? [0, 0.5, 0.65] : [0, 0, 0],
    isMobile ? ["auto", "auto", "none"] : ["auto", "auto", "auto"]
  );

  const scoreDisplay = useTransform(scrollYProgress, p => {
    if (!isMobile) return "flex";
    return p > 0.7 ? "none" : "flex";
  });

  // Phase 3: CTA component "birth" effect
  const ctaScale = useTransform(scrollYProgress, [0.60, 0.75], [0, 1]);
  const ctaOpacity = useTransform(scrollYProgress, [0.60, 0.75], [0, 1]);
  const ctaX = useTransform(scrollYProgress, [0.60, 0.75], isMobile ? ["0vw", "0vw"] : ["-25vw", "-25vw"]);

  return (
    <>
      <div className="app-container" ref={containerRef}>
        <div className="sticky-wrapper">
          
          <motion.div 
            className="hero-wrapper"
            style={{ 
              scale: heroScale, 
              opacity: heroOpacity, 
              filter: heroFilter,
              pointerEvents: heroPointerEvents,
              display: heroDisplay
            }}
          >
            <Hero />
          </motion.div>

          <motion.div 
            className="scores-wrapper"
            style={{ 
              scale: scoreContainerScale, 
              opacity: scoreContainerOpacity,
              x: scoreContainerX,
              pointerEvents: scorePointerEvents,
              display: scoreDisplay,
              transformOrigin: "center center"
            }}
          >
            <Scores />
          </motion.div>

          <motion.div 
            className="cta-wrapper"
            style={{ 
              scale: ctaScale, 
              opacity: ctaOpacity,
              x: ctaX,
              transformOrigin: "center center"
            }}
          >
            <CTA />
          </motion.div>
          
        </div>
      </div>
    </>
  );
}

export default App;
