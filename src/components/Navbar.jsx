import React, { useState, useEffect } from 'react';
import './Navbar.css';

const menuLinks = [
  { label: 'About', href: '#about' },
  { label: 'Works', href: '#works' },
  { label: 'Performances', href: '#performances' },
  { label: 'Approach', href: '#approach' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__logo" data-cursor-hover>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L28 8V24L16 30L4 24V8L16 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <path d="M16 8L22 11.5V18.5L16 22L10 18.5V11.5L16 8Z" fill="currentColor" opacity="0.3"/>
            <circle cx="16" cy="16" r="2" fill="currentColor"/>
          </svg>
        </div>
        <div className="navbar__title">GET IN TOUCH.</div>
        <button
          className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          data-cursor-hover
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`menu-overlay ${menuOpen ? 'menu-overlay--open' : ''}`}>
        <div className="menu-overlay__inner">
          <div className="menu-overlay__top">
            <span className="menu-label">MENU</span>
          </div>
          <nav className="menu-overlay__links">
            {menuLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                className="menu-link"
                style={{ transitionDelay: menuOpen ? `${i * 0.06 + 0.1}s` : '0s' }}
                onClick={(e) => handleLinkClick(e, link.href)}
                data-cursor-hover
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="menu-overlay__footer">
            <div className="menu-footer-col">
              <span>Press Kit</span>
              <span>Media</span>
            </div>
            <div className="menu-footer-col">
              <span>prajalsonariya2312hp@gmail.com</span>
            </div>
          </div>
          <a href="#contact" className="menu-cta" onClick={(e) => handleLinkClick(e, '#contact')} data-cursor-hover>
            <span>→</span> GET IN TOUCH
          </a>
        </div>
        <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu" data-cursor-hover>
          ✕
        </button>
      </div>
    </>
  );
};

export default Navbar;
