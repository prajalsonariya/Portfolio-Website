import React, { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Cursor from './components/Cursor';
import AudioPlayer from './components/AudioPlayer';
import { FaInstagram, FaYoutube, FaSpotify } from 'react-icons/fa';
import { SiApplemusic } from 'react-icons/si';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { label: 'Instagram',   href: 'https://www.instagram.com/prajal_sonariya', Icon: FaInstagram },
  { label: 'YouTube',     href: 'https://www.youtube.com/@Poperasity',           Icon: FaYoutube },
  { label: 'Spotify',     href: 'https://open.spotify.com/artist/3J32qUBrFQWVPd6M2XqEWn', Icon: FaSpotify },
  { label: 'Apple Music', href: 'https://music.apple.com/us/artist/prajal-sonariya/1782069169', Icon: SiApplemusic },
];

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Page load body class
    document.body.classList.add('page-loading');
    const t = setTimeout(() => document.body.classList.remove('page-loading'), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // — Lenis smooth scroll —
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // ScrollTrigger proxy for Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    // Scroll progress bar
    lenis.on('scroll', ({ progress }) => {
      const bar = document.getElementById('scroll-progress');
      if (bar) bar.style.transform = `scaleX(${progress})`;
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      initAnimations();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const initAnimations = () => {
    // ─── Hero animations ───
    gsap.from('.hero__eyebrow', {
      y: 20,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.3,
    });

    gsap.from('.hero__title', {
      y: 60,
      opacity: 0,
      duration: 1.4,
      ease: 'power3.out',
      delay: 0.5,
    });

    gsap.from('.hero__scroll-hint', {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
      delay: 1.2,
    });

    // Hero parallax
    gsap.to('.hero__bg', {
      yPercent: 25,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    // ─── About section ───
    gsap.from('.about__tag', {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about',
        start: 'top 75%',
      },
    });

    gsap.from('.about__headline', {
      y: 50,
      opacity: 0,
      duration: 1.3,
      ease: 'power3.out',
      delay: 0.1,
      scrollTrigger: {
        trigger: '.about',
        start: 'top 70%',
      },
    });

    gsap.from('.about__cta', {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3,
      scrollTrigger: {
        trigger: '.about',
        start: 'top 65%',
      },
    });

    // ─── Works section ───
    gsap.from('.section-tag', {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.works',
        start: 'top 80%',
      },
    });

    gsap.from('.works__description', {
      y: 30,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.12,
      scrollTrigger: {
        trigger: '.works',
        start: 'top 78%',
      },
    });

    // Staggered works cards
    gsap.from('.work-card', {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.works__grid',
        start: 'top 75%',
      },
    });

    // ─── Showroom section ───
    gsap.from('.showroom__text', {
      x: -40,
      opacity: 0,
      duration: 1.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.showroom',
        start: 'top 65%',
      },
    });

    gsap.from('.showroom__panels .panel', {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.showroom',
        start: 'top 60%',
      },
    });

    gsap.from('.showroom__info', {
      x: 40,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2,
      scrollTrigger: {
        trigger: '.showroom',
        start: 'top 60%',
      },
    });

    // Showroom BG parallax
    gsap.to('.showroom__bg', {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.showroom',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // ─── Approach section ───
    gsap.from('.approach__tag', {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.approach',
        start: 'top 75%',
      },
    });

    gsap.from('.approach__item', {
      y: 40,
      opacity: 0,
      duration: 1.1,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.approach__grid',
        start: 'top 75%',
      },
    });

    // ─── Footer ───
    gsap.from('.footer__headline', {
      y: 50,
      opacity: 0,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 70%',
      },
    });
  };

  return (
    <>
      <Cursor />
      <Navbar />
      <div className="scroll-progress" id="scroll-progress" />

      {/* ─── Hero ─── */}
      <section className="hero" id="home">
        <div className="hero__bg-wrap">
          <img src="/hero_bg.png" alt="Composer studio" className="hero__bg" loading="lazy" />
          <div className="hero__overlay" />
        </div>
        <div className="hero__content">
          <p className="hero__eyebrow">MUSIC COMPOSER &amp; ARRANGER</p>
          <h1 className="hero__title">Prajal Sonariya</h1>
          <div className="hero__socials">
            {socials.map(({ label, href, Icon }) => (
              <a key={label} href={href} className="hero__social-link" target="_blank" rel="noreferrer" aria-label={label} data-cursor-hover>
                <Icon size={20} />
              </a>
            ))}
          </div>
          <p className="hero__tagline">Music is the silence between the notes. ~Claude Debussy</p>
        </div>
        <div className="hero__scroll-hint">
          <span>SCROLL TO EXPLORE</span>
        </div>
      </section>

      {/* ─── About ─── */}
      <section className="about" id="about">
        <div className="about__inner">
          <p className="about__tag">
            <span className="tag-diamond">◆</span> STORYTELLER'S PERSPECTIVE
          </p>
          <h2 className="about__headline">
            To truly recognize a story is to awaken a memory. That sweet, lingering ache is finally understood through the music.
          </h2>
          <a href="#contact" className="about__cta cta-btn" data-cursor-hover>
            <span>↳</span> WHO I AM
          </a>
        </div>
        <div className="about__divider" />
      </section>

      {/* ─── Featured Works / Audio Engine ─── */}
      <AudioPlayer />

      {/* ─── Showroom / Feature ─── */}
      <section className="showroom" id="performances">
        <div className="showroom__bg-wrap">
          <img src="/showroom_bg.png" alt="Recording studio" className="showroom__bg" loading="lazy" />
          <div className="showroom__overlay" />
        </div>
        <div className="showroom__tag">
          <span className="tag-diamond">◆</span> COLLABORATION
        </div>
        <div className="showroom__layout">
          <div className="showroom__text">
            <h2>Original scores for<br />film and<br />video games.</h2>
          </div>
          <div className="showroom__panels">
            <div className="panel" />
            <div className="panel panel--center">
              <div className="panel__inner" />
            </div>
            <div className="panel" />
          </div>
          <div className="showroom__info">
            <p className="showroom__info-label">ENQUIRIES</p>
            <p className="showroom__info-address">Taking on new projects.<br />Tell me about the story you are building,<br />and let's find its sound.</p>
            <a href="#contact" className="showroom__info-btn cta-btn" data-cursor-hover>
              <span>↳</span> DISCUSS A PROJECT
            </a>
          </div>
        </div>
      </section>

      {/* ─── Approach ─── */}
      <section className="approach" id="approach">
        <div className="approach__header">
          <p className="approach__tag">
            <span className="tag-diamond">◆</span> MY APPROACH
          </p>
        </div>
        <div className="approach__grid">
          {[
            { num: '01', title: 'The Anchor', body: 'Finding the exact emotional weight of the narrative before touching an instrument.' },
            { num: '02', title: 'The Translation', body: 'Building the atmosphere. Every orchestral choice must serve a distinct psychological purpose.' },
            { num: '03', title: 'The Restraint', body: 'Removing the unnecessary. True emotional impact relies heavily on the silence left behind.' },
            { num: '04', title: 'The Resonate', body: 'Crafting a sound that stays with the audience long after the screen goes dark.' },
          ].map((item) => (
            <div key={item.num} className="approach__item" data-cursor-hover>
              <span className="approach__num">{item.num}</span>
              <h3 className="approach__item-title">{item.title}</h3>
              <p className="approach__item-body">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer / Contact ─── */}
      <footer className="footer" id="contact">
        <div className="footer__top">
          <h2 className="footer__headline">
            Let's create<br />some<br /><em>Art</em>
          </h2>
          <div className="footer__contact">
            <a href="mailto:prajalsonariya2312hp@gmail.com" className="footer__email" data-cursor-hover>
              prajalsonariya2312hp@gmail.com
            </a>
            <div className="footer__socials">
              {socials.map(s => (
                <a key={s.label} href={s.href} className="footer__social-link" target="_blank" rel="noreferrer" data-cursor-hover>{s.label}</a>
              ))}
            </div>
            <a href="mailto:prajalsonariya2312hp@gmail.com" className="footer__cta cta-btn" data-cursor-hover>
              <span>→</span> GET IN TOUCH
            </a>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="footer__logo">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L28 8V24L16 30L4 24V8L16 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <circle cx="16" cy="16" r="2" fill="currentColor"/>
            </svg>
            <span>Prajal Sonariya</span>
          </div>
          <p className="footer__copy">© 2026 — Orchestral Composer</p>
        </div>
      </footer>
    </>
  );
}

export default App;
