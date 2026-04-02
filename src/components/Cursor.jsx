import React, { useEffect, useRef } from 'react';
import './Cursor.css';

const Cursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const hoveredRef = useRef(false);
  const pos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);

  useEffect(() => {
    const lerp = (a, b, n) => a + (b - a) * n;

    const onMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseEnter = () => {
      hoveredRef.current = true;
      cursorRef.current?.classList.add('cursor-ring--hovered');
    };

    const onMouseLeave = () => {
      hoveredRef.current = false;
      cursorRef.current?.classList.remove('cursor-ring--hovered');
    };

    // Attach listeners to all interactive elements
    const attachListeners = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach(el => {
        // Avoid double-attaching
        if (!el.dataset.cursorBound) {
          el.dataset.cursorBound = '1';
          el.addEventListener('mouseenter', onMouseEnter);
          el.addEventListener('mouseleave', onMouseLeave);
        }
      });
    };

    // Observe DOM for new interactive elements (React renders async)
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    attachListeners(); // initial run

    document.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      pos.current.x = lerp(pos.current.x, targetPos.current.x, 0.1);
      pos.current.y = lerp(pos.current.y, targetPos.current.y, 0.1);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${targetPos.current.x}px, ${targetPos.current.y}px)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor-ring" />
      <div ref={cursorDotRef} className="cursor-dot" />
    </>
  );
};

export default Cursor;
