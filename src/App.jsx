import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Slight delay for a smoother fade-in on load
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`container ${mounted ? 'fade-in' : ''}`}>
      <h1 className="name">Prajal Sonariya</h1>
      <div className="divider"></div>
      <p className="subtitle">coming soon</p>
    </div>
  );
}

export default App;
