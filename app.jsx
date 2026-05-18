// Main portfolio app — orchestrates all sections
const { useEffect: useEffect_A, useRef: useRef_A, useState: useState_A } = React;

function ThemeToggle() {
  const [dark, setDark] = useState_A(() => {
    try { return localStorage.getItem('theme') === 'dark'; } catch { return false; }
  });
  useEffect_A(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
  }, [dark]);

  return (
    <button
      onClick={() => setDark(d => !d)}
      aria-label="Toggle theme"
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 99,
        width: 52, height: 52, borderRadius: '50%',
        background: 'var(--ink)', color: 'var(--bg)',
        border: '1px solid var(--line)',
        display: 'grid', placeItems: 'center',
        cursor: 'pointer',
        boxShadow: '0 12px 30px rgba(23,42,57,0.25)',
        transition: 'transform 0.3s, box-shadow 0.3s'
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08) rotate(15deg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) rotate(0)'; }}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{
        transition: 'transform 0.4s cubic-bezier(.2,.8,.2,1)',
        transform: dark ? 'rotate(40deg)' : 'rotate(0)'
      }}>
        {dark ? (
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
        ) : (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
        )}
        {!dark ? null : (
          <g stroke="currentColor">
            <line x1="12" y1="3" x2="12" y2="5" />
            <line x1="12" y1="19" x2="12" y2="21" />
            <line x1="3" y1="12" x2="5" y2="12" />
            <line x1="19" y1="12" x2="21" y2="12" />
            <line x1="5.6" y1="5.6" x2="7" y2="7" />
            <line x1="17" y1="17" x2="18.4" y2="18.4" />
            <line x1="5.6" y1="18.4" x2="7" y2="17" />
            <line x1="17" y1="7" x2="18.4" y2="5.6" />
          </g>
        )}
      </svg>
    </button>
  );
}

function App() {
  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect_A(() => {
    const boot = document.getElementById('boot');
    if (boot) {
      setTimeout(() => boot.classList.add('gone'), 700);
      setTimeout(() => boot.remove(), 1400);
    }
  }, []);

  const marqueeItems = [
    'AVAILABLE FOR INTERNSHIPS',
    'BUILDING WITH AI · YOLO · OPENCV',
    'CS @ UNISZA',
    'CGPA 3.67 · DEAN\u2019S LIST',
    'BASED IN SABAH, MALAYSIA',
    'CURRENTLY: SHIPPING TUTORGO',
    'COFFEE → MATCHA → CODE',
  ];

  return (
    <div style={{ position: 'relative' }}>
      <Nav onJump={jump} />
      <Hero />
      <About />
      <Marquee items={marqueeItems} speed={40} />
      <Experience />
      <section id="skills"><SkillsKeyboard /></section>
      <Projects />
      <Blog />
      <Contact />
      <ThemeToggle />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
