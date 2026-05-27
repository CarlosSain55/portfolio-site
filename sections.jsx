// Portfolio sections — Hero, About, Projects, Contact
const { useState: useState_S, useEffect: useEffect_S, useRef: useRef_S, useCallback: useCallback_S } = React;

// -------- Tiny utility: reveal on scroll --------
function useInView(options = { threshold: 0.15 }) {
  const ref = useRef_S(null);
  const [inView, setInView] = useState_S(false);
  useEffect_S(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting) setInView(true);},
      options
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

// -------- Scramble text effect --------
function Scramble({ text, duration = 1200, delay = 0, className, style }) {
  const [out, setOut] = useState_S('');
  useEffect_S(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+=<>/\\|';
    let t;
    let start;
    const id = setTimeout(() => {
      start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const reveal = Math.floor(p * text.length);
        let s = '';
        for (let i = 0; i < text.length; i++) {
          if (i < reveal || text[i] === ' ') s += text[i];else
          s += chars[Math.floor(Math.random() * chars.length)];
        }
        setOut(s);
        if (p < 1) t = requestAnimationFrame(step);else
        setOut(text);
      };
      t = requestAnimationFrame(step);
    }, delay);
    return () => {clearTimeout(id);cancelAnimationFrame(t);};
  }, [text, duration, delay]);
  return <span className={className} style={style}>{out || '\u00a0'}</span>;
}

// -------- Marquee strip --------
function Marquee({ items, speed = 30 }) {
  const content = [...items, ...items];
  return (
    <div style={{
      overflow: 'hidden',
      borderTop: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
      padding: '18px 0',

      position: 'relative', background: "rgb(255, 39, 39)"
    }}>
      <div style={{
        display: 'flex',
        gap: 60,
        whiteSpace: 'nowrap',
        animation: `marquee ${speed}s linear infinite`
      }}>
        {content.map((it, i) =>
        <span key={i} className="mono" style={{
          fontSize: 13,
          display: 'inline-flex', alignItems: 'center', gap: 14, color: "rgb(255, 255, 255)"
        }}>
            <span style={{ color: "rgb(176, 252, 60)" }}>✦</span>
            {it}
          </span>
        )}
      </div>
      <style>{`@keyframes marquee { to { transform: translateX(-50%); } }`}</style>
    </div>);

}

// -------- Top nav --------
function Nav({ onJump }) {
  const items = [
  { id: 'hero', n: '00', label: 'home' },
  { id: 'about', n: '01', label: 'about' },
  { id: 'experience', n: '02', label: 'experience' },
  { id: 'skills', n: '03', label: 'skills' },
  { id: 'projects', n: '04', label: 'projects' },
  { id: 'blog', n: '05', label: 'notes' },
  { id: 'contact', n: '06', label: 'contact' }];


  const [active, setActive] = useState_S('hero');
  const [scrolled, setScrolled] = useState_S(false);
  const [progress, setProgress] = useState_S(0);
  const [indicator, setIndicator] = useState_S({ left: 0, width: 0, opacity: 0 });
  const itemRefs = useRef_S({});

  // Scroll-spy + progress + scrolled state
  useEffect_S(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 30);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(Math.min(100, sy / Math.max(1, total) * 100));
      const probe = sy + window.innerHeight * 0.32;
      let current = items[0].id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.offsetTop <= probe) current = it.id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Recompute sliding indicator when active changes
  useEffect_S(() => {
    const el = itemRefs.current[active];
    if (el && el.parentElement) {
      const r = el.getBoundingClientRect();
      const p = el.parentElement.getBoundingClientRect();
      setIndicator({ left: r.left - p.left, width: r.width, opacity: 1 });
    }
  }, [active]);

  return (
    <React.Fragment>
      {/* Scroll progress bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 101,
        background: 'rgba(28,6,8,0.05)',
        pointerEvents: 'none'
      }}>
        <div style={{
          height: '100%', width: progress + '%',
          background: 'linear-gradient(90deg, var(--cherry), var(--orange) 60%, var(--amber))',
          boxShadow: '0 0 12px rgba(250,102,23,0.5)',
          transition: 'width 0.1s linear'
        }} />
      </div>

      {/* Center pill — nav items */}
      <nav className="nav-pill nav-center" style={{
        position: 'fixed',
        top: scrolled ? 14 : 22,
        left: '50%', transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex', alignItems: 'center', gap: 2,
        padding: 6,
        background: 'rgba(255,248,244,0.78)',
        border: '1px solid var(--line)',
        borderRadius: 999,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: scrolled ?
        '0 10px 30px rgba(214,10,13,0.10), 0 2px 6px rgba(28,6,8,0.05)' :
        '0 4px 16px rgba(28,6,8,0.04)',
        transition: 'top 0.35s cubic-bezier(.2,.8,.2,1), box-shadow 0.35s'
      }}>
        {/* Sliding active indicator */}
        <div style={{
          position: 'absolute',
          left: indicator.left, width: indicator.width,
          top: 6, bottom: 6,
          background: 'var(--ink)',
          borderRadius: 999,
          opacity: indicator.opacity,
          transition: 'left 0.45s cubic-bezier(.2,.8,.2,1), width 0.45s cubic-bezier(.2,.8,.2,1), opacity 0.3s',
          zIndex: 0
        }} />
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <button
              key={it.id}
              ref={(el) => {if (el) itemRefs.current[it.id] = el;}}
              onClick={() => onJump(it.id)}
              className="mono"
              style={{
                position: 'relative',
                zIndex: 1,
                padding: '9px 16px',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--bg)' : 'var(--ink-dim)',
                transition: 'color 0.3s',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                borderRadius: 999
              }}
              onMouseEnter={(e) => {if (!isActive) e.currentTarget.style.color = 'var(--ink)';}}
              onMouseLeave={(e) => {if (!isActive) e.currentTarget.style.color = 'var(--ink-dim)';}}>
              
              <span style={{
                fontSize: 9,
                opacity: isActive ? 0.55 : 0.40,
                fontWeight: 700,
                color: isActive ? 'var(--amber)' : 'inherit'
              }}>{it.n}</span>
              <span>{it.label}</span>
            </button>);

        })}
      </nav>

      <style>{`
        @keyframes navPing {
          0% { transform: scale(0.6); opacity: 0.6; }
          80%, 100% { transform: scale(2.0); opacity: 0; }
        }
        @media (max-width: 980px) {
          .nav-right { display: none !important; }
        }
        @media (max-width: 720px) {
          .nav-center button span:last-child { display: none; }
          .nav-center button { padding: 9px 10px !important; }
        }
        @media (max-width: 480px) {
          .nav-center { display: none !important; }
        }
        @media (max-width: 860px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 700px) {
          .project-row { grid-template-columns: 1fr !important; gap: 10px !important; }
          .project-row > *:last-child { display: none; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .contact-cards { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .exp-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </React.Fragment>);

}

// -------- Hero --------
function Hero() {
  const [mouse, setMouse] = useState_S({ x: 0, y: 0 });
  const ref = useRef_S(null);
  useEffect_S(() => {
    const onMove = (e) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      setMouse({
        x: (e.clientX - r.left - r.width / 2) / r.width,
        y: (e.clientY - r.top - r.height / 2) / r.height
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section id="hero" ref={ref} style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '120px 32px 60px',
      overflow: 'hidden'
    }}>
      {/* Big orange splash behind name */}
      <div style={{
        position: 'absolute',
        right: '-10%', top: '12%',
        width: 800, height: 800, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(254,158,62,0.35) 0%, rgba(250,102,23,0.10) 45%, transparent 70%)',
        pointerEvents: 'none',
        transform: `translate(${mouse.x * -20}px, ${mouse.y * -20}px)`,
        transition: 'transform 0.4s ease-out'
      }} />
      <div style={{
        position: 'absolute',
        left: '-8%', bottom: '5%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,179,206,0.30) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(28,6,8,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(28,6,8,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Floating orbs */}
      <div style={{
        position: 'absolute',
        left: `calc(15% + ${mouse.x * 30}px)`,
        top: `calc(20% + ${mouse.y * 30}px)`,
        width: 10, height: 10, borderRadius: '50%',
        background: 'var(--cherry)', boxShadow: '0 0 22px rgba(214,10,13,0.5)',
        transition: 'left 0.2s ease-out, top 0.2s ease-out'
      }} />
      <div style={{
        position: 'absolute',
        right: `calc(8% + ${mouse.x * -40}px)`,
        top: `calc(18% + ${mouse.y * -30}px)`,
        width: 14, height: 14, borderRadius: '50%',
        background: 'var(--orange)', boxShadow: '0 0 24px rgba(250,102,23,0.6)',
        transition: 'right 0.2s ease-out, top 0.2s ease-out'
      }} />
      <div style={{
        position: 'absolute',
        left: '8%', bottom: '18%',
        width: 8, height: 8, borderRadius: '50%',
        background: 'var(--amber)', boxShadow: '0 0 18px rgba(254,158,62,0.6)',
        transform: `translate(${mouse.x * -20}px, ${mouse.y * -20}px)`,
        transition: 'transform 0.2s ease-out'
      }} />

      {/* Main grid: text + photo */}
      <div className="hero-grid" style={{
        maxWidth: 1280, margin: '0 auto', width: '100%',
        position: 'relative', zIndex: 2,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
        gap: 40,
        alignItems: 'center'
      }}>
        <div>
          <div className="mono" style={{
            fontSize: 12, color: 'var(--cherry)',
            letterSpacing: '0.3em', marginBottom: 30,
            display: 'flex', alignItems: 'center', gap: 14,
            fontWeight: 700
          }}>
            <span style={{ width: 40, height: 2, background: 'var(--cherry)' }} />
            PORTFOLIO / 2026
          </div>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(56px, 10vw, 152px)',
            fontWeight: 700,
            letterSpacing: '-0.05em',
            lineHeight: 0.88,
            marginBottom: 30,
            color: 'var(--ink)'
          }}>
            <div style={{ overflow: 'hidden' }}>
              <span style={{ display: 'inline-block', animation: 'slideUp 1s 0.1s both' }}>Sharif

              </span>
            </div>
            <div style={{ overflow: 'hidden', display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-block', animation: 'slideUp 1s 0.3s both',
                fontStyle: 'italic',
                fontFamily: "'Instrument Serif', serif",
                fontWeight: 400,
                color: 'var(--orange)'
              }}>Ruzaimi 

              </span>
              <span style={{
                display: 'inline-block', animation: 'slideUp 1s 0.4s both',
                color: 'var(--cherry)'
              }}>.</span>
            </div>
          </h1>

          <div style={{
            display: 'flex', flexWrap: 'wrap',
            gap: 24, alignItems: 'flex-end',
            marginTop: 20,
            animation: 'fadeIn 1s 0.8s both'
          }}>
            <div>
              <div className="mono" style={{
                fontSize: 14, color: 'var(--ink)', letterSpacing: '0.1em',
                fontWeight: 700
              }}>
                <Scramble text="SOFTWARE_DEVELOPER" delay={1000} duration={1400} />
                <span style={{ color: 'var(--cherry)' }}> _</span>
              </div>
              <div className="mono" style={{
                fontSize: 12, color: 'var(--ink-dim)', marginTop: 8
              }}>
                <span style={{ color: 'var(--orange)' }}>›</span> full-stack · AI · data — coding from Malaysia
              </div>
            </div>
          </div>

          <div className="mono" style={{
            fontSize: 11, color: 'var(--ink-faint)',
            marginTop: 60,
            display: 'flex', alignItems: 'center', gap: 12,
            animation: 'fadeIn 1s 1.2s both'
          }}>
            <span>[ scroll to explore ]</span>
            <div style={{
              width: 60, height: 1, background: 'linear-gradient(to right, var(--cherry), transparent)'
            }} />
          </div>
        </div>

        {/* Photo column — Editorial composition */}
        <div style={{
          position: 'relative',
          opacity: 0,
          animation: 'fadeIn 1.2s 0.5s both',
          aspectRatio: '4 / 5',
          width: '100%',
          maxWidth: 520,
          margin: '0 auto'
        }}>
          {/* Dotted background grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(23,42,57,0.18) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
            opacity: 0.5,
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)',
            zIndex: 0
          }} />

          {/* Vermillion disc */}
          <div style={{
            position: 'absolute',
            left: '50%', top: '52%',
            width: '78%', aspectRatio: '1',
            transform: 'translate(-50%, -50%)',
            background: 'var(--cherry)',
            borderRadius: '50%',
            boxShadow: '0 30px 80px rgba(252,86,60,0.22)',
            zIndex: 1
          }} />

          {/* Giant SR letters behind */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(160px, 28vw, 340px)',
            lineHeight: 0.78,
            letterSpacing: '-0.08em',
            color: 'var(--ink)',
            zIndex: 2,
            pointerEvents: 'none',
            userSelect: 'none'
          }}>
            SR
          </div>

          {/* Cutout image — sits on top of disc/letters */}
          <img src="assets/sharif-cutout.png" alt="Sharif"
          style={{
            position: 'absolute',
            left: '50%', top: '55%',
            width: '92%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
            filter: 'drop-shadow(0 24px 50px rgba(23,42,57,0.32))',
            animation: 'floatY 7s ease-in-out infinite'
          }} />

          {/* Vertical mono caption left */}
          <div className="mono" style={{
            position: 'absolute',
            left: '-6px', bottom: '10%',
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.32em',
            color: 'var(--ink)',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            zIndex: 5
          }}>
            BUILDER · BARISTA · BS COMP SCI
          </div>

          {/* Top-right live chip */}
          <div className="mono" style={{
            position: 'absolute',
            top: '4%', right: '-4%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-end', gap: 4,
            background: 'var(--bg)',
            border: '1px solid var(--line)',
            padding: '8px 12px',
            fontSize: 9, letterSpacing: '0.15em',
            color: 'var(--ink-dim)',
            transform: 'rotate(4deg)',
            zIndex: 5,
            boxShadow: '0 6px 16px rgba(23,42,57,0.10)'
          }}>
            <span style={{ color: 'var(--cherry)', fontWeight: 700 }}>● LIVE</span>
            <span>SANDAKAN · 05.84°N</span>
          </div>

          {/* Bottom-right scroll indicator */}
          <div className="mono" style={{
            position: 'absolute',
            right: '-2%', bottom: '4%',
            display: 'flex', alignItems: 'center', gap: 8,
            zIndex: 5
          }}>
            <span style={{
              width: 56, height: 56, borderRadius: '50%',
              border: '1.5px dashed var(--ink)',
              display: 'grid', placeItems: 'center',
              fontSize: 20, color: 'var(--ink)',
              animation: 'spinFwd 12s linear infinite'
            }}>↓</span>
            <span style={{
              fontSize: 9, letterSpacing: '0.2em',
              color: 'var(--ink-dim)', fontWeight: 700
            }}>SCROLL<br />DOWN</span>
          </div>

          {/* Top-left ID badge */}
          <div className="mono" style={{
            position: 'absolute',
            top: '6%', left: '-2%',
            background: 'var(--ink)', color: 'var(--bg)',
            padding: '6px 10px',
            fontSize: 9, fontWeight: 700,
            letterSpacing: '0.2em',
            transform: 'rotate(-4deg)',
            zIndex: 5,
            boxShadow: '0 6px 16px rgba(23,42,57,0.20)'
          }}>SR_001 / 2026</div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes spinFwd { to { transform: rotate(360deg); } }
        @keyframes floatY { 0%, 100% { transform: translate(-50%, -50%) translateY(0); } 50% { transform: translate(-50%, -50%) translateY(-12px); } }
        @media (max-width: 880px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>);

}

// -------- About --------
const ABOUT_PHOTOS = [
{ src: 'assets/sharif-diner.jpg', label: 'KL · DINNER \u0026 DUNK', meta: 'FILE_001 · sharif.raw' },
{ src: 'assets/sharif-garden.jpg', label: 'SABAH · GARDEN STROLL', meta: 'FILE_002 · sharif.raw' },
{ src: 'assets/sharif-polaroid.jpg', label: 'KUALA TERENGGANU · 9pm', meta: 'FILE_003 · sharif.raw' },
{ src: 'assets/matcha-cloud.jpg', label: 'MATCHA CLOUD · POP-UP', meta: 'FILE_004 · sharif.raw' }];


function AboutPortrait() {
  const [idx, setIdx] = useState_S(0);
  const [paused, setPaused] = useState_S(false);
  const N = ABOUT_PHOTOS.length;

  useEffect_S(() => {
    if (paused) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % N), 4200);
    return () => clearInterval(id);
  }, [paused, N]);

  const go = (n) => setIdx((n % N + N) % N);
  const current = ABOUT_PHOTOS[idx];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ position: 'relative' }}>
      
      <div style={{
        position: 'relative',
        aspectRatio: '3 / 4',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#15171c',
        boxShadow: '0 30px 80px rgba(0,0,0,0.35), inset 0 0 0 1px var(--line)'
      }}>
        {ABOUT_PHOTOS.map((p, i) =>
        <img key={p.src} src={p.src} alt="Sharif"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%', objectFit: 'cover',
          filter: 'saturate(1.05) contrast(1.05)',
          opacity: i === idx ? 1 : 0,
          transform: i === idx ? 'scale(1)' : 'scale(1.04)',
          transition: 'opacity 0.7s ease-out, transform 1.2s ease-out'
        }} />
        )}

        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          position: 'absolute', top: 14, left: 14, right: 14,
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9, color: 'rgba(255,255,255,0.85)',
          letterSpacing: '0.1em', zIndex: 2
        }}>
          <span><span style={{ color: '#ff5a5a' }}>●</span> REC</span>
          <span>{String(idx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span>
        </div>

        <div style={{
          position: 'absolute', bottom: 38, left: 14, right: 14,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9, color: 'rgba(255,255,255,0.85)',
          display: 'flex', justifyContent: 'space-between',
          letterSpacing: '0.08em', zIndex: 2
        }}>
          <span>{current.meta}</span>
          <span>{current.label}</span>
        </div>

        <div style={{
          position: 'absolute', bottom: 14, left: 14, right: 14,
          display: 'flex', gap: 4, zIndex: 2
        }}>
          {ABOUT_PHOTOS.map((_, i) =>
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Photo ${i + 1}`}
            style={{
              flex: 1, height: 3,
              background: 'rgba(255,255,255,0.25)',
              border: 'none', padding: 0, borderRadius: 2,
              cursor: 'pointer', position: 'relative', overflow: 'hidden'
            }}>
            
              <span style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: i < idx ? '100%' : i === idx ? '100%' : '0%',
              background: 'var(--amber)',
              boxShadow: i === idx ? '0 0 8px rgba(254,158,62,0.7)' : 'none',
              animation: i === idx && !paused ? 'fillBar 4.2s linear forwards' : 'none',
              transition: i < idx ? 'width 0.3s' : 'none'
            }} />
            </button>
          )}
        </div>

        <button
          onClick={() => go(idx - 1)}
          aria-label="Previous photo"
          style={{
            position: 'absolute', left: 10, top: '50%',
            transform: 'translateY(-50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(28,6,8,0.55)',
            color: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'grid', placeItems: 'center', fontSize: 18,
            cursor: 'pointer', opacity: paused ? 1 : 0,
            transition: 'opacity 0.3s, background 0.2s',
            zIndex: 3, backdropFilter: 'blur(4px)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--cherry)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(28,6,8,0.55)'}>
          ‹</button>
        <button
          onClick={() => go(idx + 1)}
          aria-label="Next photo"
          style={{
            position: 'absolute', right: 10, top: '50%',
            transform: 'translateY(-50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(28,6,8,0.55)',
            color: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'grid', placeItems: 'center', fontSize: 18,
            cursor: 'pointer', opacity: paused ? 1 : 0,
            transition: 'opacity 0.3s, background 0.2s',
            zIndex: 3, backdropFilter: 'blur(4px)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--cherry)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(28,6,8,0.55)'}>
          ›</button>
      </div>

      <div className="mono" style={{
        position: 'absolute', top: -12, right: -12,
        background: 'var(--amber)', color: '#1a1208',
        padding: '6px 12px', fontSize: 10, fontWeight: 700,
        letterSpacing: '0.15em', borderRadius: 4,
        transform: 'rotate(3deg)',
        boxShadow: '0 6px 16px rgba(254,158,62,0.30)'
      }}>
        EST. 2003
      </div>

      <style>{`
        @keyframes fillBar { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </div>);

}

function About() {
  const [ref, inView] = useInView();
  const facts = [
  { k: 'cgpa', v: '3.67', s: 'Dean\u2019s List · 4 sems' },
  { k: 'years coding', v: '4+', s: 'PHP, Python, JS, Java' },
  { k: 'languages', v: '8', s: 'BM · English · code' },
  { k: 'projects shipped', v: '6', s: 'AI · BI · full-stack' }];

  return (
    <section id="about" ref={ref} style={{
      padding: '140px 32px',
      maxWidth: 1200, margin: '0 auto',
      position: 'relative'
    }}>
      <div className="mono" style={{
        color: 'var(--cherry)', fontSize: 12, letterSpacing: '0.3em', marginBottom: 30, fontWeight: 700
      }}>
        01 / ABOUT
      </div>

      <div className="about-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr',
        gap: 60,
        alignItems: 'start'
      }}>
        {/* Portrait */}
        <div style={{
          position: 'relative',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1s 0.1s cubic-bezier(.2,.8,.2,1)'
        }}>
          <AboutPortrait />
        </div>

        {/* Copy */}
        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 1s 0.3s cubic-bezier(.2,.8,.2,1)'
        }}>
          <h2 className="serif" style={{
            fontSize: 'clamp(40px, 5vw, 64px)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: 32
          }}>
            CS student by day,<br />
            <em style={{ color: 'var(--orange)' }}>builder of intelligent things</em><br />
            by night.
          </h2>
          <p style={{
            fontSize: 17, lineHeight: 1.7, color: 'var(--ink-dim)',
            maxWidth: 560, marginBottom: 24
          }}>
            I&rsquo;m a <span style={{ color: 'var(--ink)' }}>Computer Science undergrad at Universiti Sultan Zainal Abidin</span>,
            specialising in software development with a soft spot for AI, data analytics and clean,
            secure full-stack architectures.
          </p>
          <p style={{
            fontSize: 17, lineHeight: 1.7, color: 'var(--ink-dim)',
            maxWidth: 560, marginBottom: 40
          }}>
            I&rsquo;ve built role-based booking platforms in CodeIgniter, trained YOLO models to spot fabric defects in real time,
            and engineered an ETL pipeline that ingests a thousand+ sales rows into a star-schema warehouse for OLAP. When I&rsquo;m
            not shipping, I&rsquo;m pulling shots at a matcha bar.
          </p>

          {/* Fact grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1,
            background: 'var(--line)',
            border: '1px solid var(--line)',
            borderRadius: 8,
            overflow: 'hidden'
          }}>
            {facts.map((f, i) =>
            <div key={i} style={{
              padding: '24px 22px',
              background: 'var(--bg)',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(250,102,23,0.06)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg)'}>
              
                <div className="mono" style={{
                fontSize: 10, color: 'var(--ink-faint)',
                textTransform: 'uppercase', letterSpacing: '0.2em',
                marginBottom: 10
              }}>{f.k}</div>
                <div className="serif" style={{
                fontSize: 44, fontWeight: 400,
                color: i === 0 ? 'var(--cherry)' : i === 1 ? 'var(--orange)' : 'var(--ink)',
                lineHeight: 1, marginBottom: 6
              }}>{f.v}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-dim)' }}>{f.s}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

// -------- Experience --------
const EXPERIENCE = [
{
  id: 'matcha',
  role: 'Part-time Barista',
  place: 'Matcha Cloud',
  type: 'Self-employed',
  period: '2025 — 2026',
  location: 'Sabah, MY',
  img: 'assets/matcha-cloud.jpg',
  blurb: 'Pulling matcha shots at a pop-up tent stall. Built customer relationships one cup at a time and learned the rhythm of fast-paced service — turns out queueing humans isn\u2019t that different from queueing requests.',
  skills: ['Customer service', 'Cash handling', 'Time management', 'Multitasking']
},
{
  id: 'unisza',
  role: 'BSc Computer Science (Software Development)',
  place: 'Universiti Sultan Zainal Abidin',
  type: 'Undergraduate',
  period: 'Oct 2023 — present',
  location: 'Terengganu, MY',
  img: 'assets/exp-unisza.jpg',
  blurb: 'Specialising in software dev with concentrations in AI, data analytics and cybersecurity. CGPA 3.67, Dean\u2019s List four semesters running. Awarded Biasiswa Kerajaan Negeri Sabah and Anugerah Cemerlang for academic excellence.',
  skills: ['Software Dev', 'AI / ML', 'Data Analytics', 'Cybersecurity']
},
{
  id: 'multimedia',
  role: 'Exco — Multimedia',
  place: 'Siswa Siswi Pertahanan Awam',
  type: 'Student Body',
  period: '2024 — present',
  location: 'UniSZA',
  img: 'assets/exp-exco.jpg',
  blurb: 'Designed and managed multimedia content across TikTok, Instagram, banners, posters and T-shirts. Created the visual identity for programs, events and community outreach campaigns.',
  skills: ['Graphic Design', 'Social Media', 'Brand Identity', 'Print']
}];


function ExperienceCard({ exp, i }) {
  const [hover, setHover] = useState_S(false);
  const [ref, inView] = useInView({ threshold: 0.15 });
  return (
    <div
      ref={ref}
      className="exp-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 240px) minmax(220px, 320px) minmax(0, 1fr)',
        gap: 40,
        alignItems: 'start',
        padding: '52px 0',
        borderTop: '1px solid var(--line)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.7s ${i * 0.08}s cubic-bezier(.2,.8,.2,1), transform 0.7s ${i * 0.08}s cubic-bezier(.2,.8,.2,1)`
      }}>
      
      {/* Period column */}
      <div>
        <div className="mono" style={{
          fontSize: 11, color: 'var(--ink-faint)',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          marginBottom: 8, fontWeight: 700
        }}>
          {exp.type}
        </div>
        <div className="serif" style={{
          fontSize: 28, fontWeight: 400,
          color: hover ? 'var(--cherry)' : 'var(--ink)',
          letterSpacing: '-0.02em', lineHeight: 1.05,
          transition: 'color 0.3s'
        }}>
          {exp.period}
        </div>
        <div className="mono" style={{
          fontSize: 11, color: 'var(--ink-dim)', marginTop: 8,
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange)' }} />
          {exp.location}
        </div>
      </div>

      {/* Image / dot column */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
        {exp.img ?
        <div style={{
          width: '100%', aspectRatio: '4 / 3', borderRadius: 16,
          overflow: 'hidden', position: 'relative',
          boxShadow: hover ?
          '0 24px 50px rgba(252,86,60,0.20), 0 0 0 1px var(--line)' :
          '0 12px 28px rgba(23,42,57,0.12), 0 0 0 1px var(--line)',
          transform: hover ? 'rotate(-2deg) scale(1.03)' : 'rotate(0) scale(1)',
          transition: 'all 0.5s cubic-bezier(.2,.8,.2,1)'
        }}>
            <img src={exp.img} alt={exp.place}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hover ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(.2,.8,.2,1)'
          }} />
            <div className="mono" style={{
            position: 'absolute', bottom: 10, left: 10,
            background: 'rgba(23,42,57,0.85)', color: 'var(--bg)',
            padding: '5px 9px', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.18em', borderRadius: 4,
            backdropFilter: 'blur(4px)'
          }}>
              {exp.type.toUpperCase()}
            </div>
          </div> :

        <div style={{
          width: '100%', aspectRatio: '4 / 3', borderRadius: 16,
          background: 'linear-gradient(135deg, var(--bg-2), var(--bg))',
          border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--cherry)',
          fontFamily: "'Instrument Serif', serif",
          fontSize: 100, fontStyle: 'italic',
          transform: hover ? 'rotate(-2deg)' : 'rotate(0)',
          transition: 'transform 0.5s'
        }}>
            {exp.place[0]}
          </div>
        }
      </div>

      {/* Detail column */}
      <div>
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 12,
          flexWrap: 'wrap', marginBottom: 8
        }}>
          <h3 style={{
            fontSize: 'clamp(22px, 2.4vw, 30px)',
            fontWeight: 600, letterSpacing: '-0.01em',
            color: 'var(--ink)', lineHeight: 1.15
          }}>{exp.role}</h3>
          <span className="mono" style={{
            fontSize: 11, color: 'var(--orange)',
            letterSpacing: '0.12em', fontWeight: 700,
            textTransform: 'uppercase'
          }}>@ {exp.place}</span>
        </div>
        <p style={{
          fontSize: 15, lineHeight: 1.65,
          color: 'var(--ink-dim)', marginBottom: 16,
          maxWidth: 580
        }}>
          {exp.blurb}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {exp.skills.map((s) =>
          <span key={s} className="mono" style={{
            fontSize: 10, padding: '5px 10px',
            border: '1px solid var(--line)',
            background: hover ? 'rgba(250,102,23,0.05)' : 'transparent',
            borderRadius: 999, color: 'var(--ink-dim)',
            letterSpacing: '0.05em',
            transition: 'background 0.3s'
          }}>{s}</span>
          )}
        </div>
      </div>

      {/* hover accent left bar */}
      <div style={{
        position: 'absolute', left: -8, top: 36, bottom: 36,
        width: 3,
        background: 'linear-gradient(to bottom, var(--cherry), var(--orange))',
        borderRadius: 3,
        opacity: hover ? 1 : 0,
        transition: 'opacity 0.3s'
      }} />
    </div>);

}

function Experience() {
  return (
    <section id="experience" style={{
      padding: '140px 32px 60px',
      maxWidth: 1200, margin: '0 auto',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', marginBottom: 50,
        flexWrap: 'wrap', gap: 20
      }}>
        <div>
          <div className="mono" style={{
            color: 'var(--cherry)', fontSize: 12, letterSpacing: '0.3em',
            marginBottom: 18, fontWeight: 700
          }}>
            02 / EXPERIENCE
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: 'var(--ink)'
          }}>
            where i&rsquo;ve <span className="serif" style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--orange)' }}>poured</span> myself
          </h2>
        </div>
        <div className="mono" style={{
          fontSize: 12, color: 'var(--ink-faint)', maxWidth: 280,
          lineHeight: 1.6
        }}>
          School. A matcha stall. A multimedia exco.<br />
          Three different rhythms, one common thread: showing up and shipping the work.
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .exp-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ borderBottom: '1px solid var(--line)' }}>
        {EXPERIENCE.map((exp, i) => <ExperienceCard key={exp.id} exp={exp} i={i} />)}
      </div>
    </section>);

}

// -------- Projects --------
const PROJECTS = [
{
  id: '01',
  name: 'TutorGo',
  tagline: 'Tuition booking platform with role-based access',
  desc: 'A full-stack web application built on CodeIgniter 4. Admin, Teacher, and Student roles each get a tailored experience. Secure authentication, REST API architecture, MySQL — the whole pipeline.',
  stack: ['CodeIgniter 4', 'PHP', 'MySQL', 'Bootstrap', 'REST API'],
  accent: 'var(--cherry)',
  year: '2025'
},
{
  id: '02',
  name: 'Fabric Defect Detection',
  tagline: 'Real-time AI vision for textile QA',
  desc: 'Trained a YOLO object-detection model on a custom dataset, paired with OpenCV edge-detection preprocessing. Built a Flask web app where Inspectors, Managers, and Admins triage defects on the production line.',
  stack: ['Python', 'YOLO', 'OpenCV', 'Flask', 'NumPy'],
  accent: 'var(--pink)',
  year: '2025'
},
{
  id: '03',
  name: 'Retail Sales Intelligence',
  tagline: 'Star-schema warehouse + OLAP analytics',
  desc: 'Designed a 4-dimension star schema in MySQL, built an ETL pipeline in pandas to load 1,000+ sales transactions, and implemented Roll-Up, Drill-Down, Slice & Dice operations to surface insights in Power BI.',
  stack: ['Python', 'MySQL', 'Power BI', 'pandas', 'SQLAlchemy'],
  accent: 'var(--orange)',
  year: '2025'
},
{
  id: '04',
  name: 'Smart Parking Allocation',
  tagline: 'AI search algorithms on a 7×7 grid',
  desc: 'Implemented BFS, DFS, Greedy Best-First, and A* in Python. A* hit an optimal 8-step path while expanding 18% fewer nodes than BFS. Manhattan-distance heuristic — admissible and consistent.',
  stack: ['Python', 'A*', 'BFS / DFS', 'Heuristics'],
  accent: 'var(--amber)',
  year: '2024'
}];


function ProjectRow({ p, i }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const [hover, setHover] = useState_S(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="project-row"
      style={{
        borderTop: '1px solid var(--line)',
        padding: '40px 0',
        display: 'grid',
        gridTemplateColumns: '60px 1fr 1.2fr 80px',
        gap: 30,
        alignItems: 'start',
        cursor: 'pointer',
        position: 'relative',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.8s ${i * 0.08}s cubic-bezier(.2,.8,.2,1), background 0.3s`,
        background: hover ? 'rgba(255,255,255,0.02)' : 'transparent'
      }}>
      
      {/* hover bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 2, background: p.accent,
        transform: hover ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: 'top',
        transition: 'transform 0.4s cubic-bezier(.2,.8,.2,1)'
      }} />

      <div className="mono" style={{
        fontSize: 12, color: 'var(--ink-faint)', paddingTop: 6
      }}>{p.id}</div>

      <div>
        <div style={{
          fontSize: 'clamp(28px, 3.5vw, 44px)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.05,
          color: hover ? p.accent : 'var(--ink)',
          transition: 'color 0.3s'
        }}>
          {p.name}
        </div>
        <div style={{
          fontSize: 14, color: 'var(--ink-dim)', marginTop: 6,
          fontStyle: 'italic'
        }}>
          {p.tagline}
        </div>
      </div>

      <div>
        <p style={{
          fontSize: 15, lineHeight: 1.65, color: 'var(--ink-dim)',
          marginBottom: 16
        }}>{p.desc}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {p.stack.map((s) =>
          <span key={s} className="mono" style={{
            fontSize: 10, padding: '4px 9px',
            border: '1px solid var(--line)',
            borderRadius: 999, color: 'var(--ink-dim)',
            letterSpacing: '0.04em'
          }}>{s}</span>
          )}
        </div>
      </div>

      <div className="mono" style={{
        fontSize: 11, color: 'var(--ink-faint)', textAlign: 'right',
        paddingTop: 6
      }}>
        {p.year}
        <div style={{
          fontSize: 20, marginTop: 8,
          transform: hover ? 'translateX(6px)' : 'translateX(0)',
          transition: 'transform 0.3s',
          color: hover ? p.accent : 'var(--ink-faint)'
        }}>→</div>
      </div>
    </div>);

}

function Projects() {
  return (
    <section id="projects" style={{
      padding: '140px 32px',
      maxWidth: 1200, margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 60,
        flexWrap: 'wrap', gap: 20
      }}>
        <div>
          <div className="mono" style={{
            color: 'var(--cherry)', fontSize: 12, letterSpacing: '0.3em', marginBottom: 18, fontWeight: 700
          }}>
            04 / SELECTED WORK
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1
          }}>
            things i&rsquo;ve <span className="serif" style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--orange)' }}>shipped</span>
          </h2>
        </div>
        <div className="mono" style={{ fontSize: 12, color: 'var(--ink-faint)', maxWidth: 280 }}>
          A small selection. More on GitHub. Each one taught me something different about building software.
        </div>
      </div>

      <div style={{ borderBottom: '1px solid var(--line)' }}>
        {PROJECTS.map((p, i) => <ProjectRow key={p.id} p={p} i={i} />)}
      </div>
    </section>);

}

// -------- Social brand SVG marks --------
function SocialLogo({ name, size = 22 }) {
  const sz = { width: size, height: size, display: 'block' };
  switch (name) {
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" style={sz} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <polyline points="3 7 12 13 21 7" />
        </svg>);

    case 'github':
      return (
        <svg viewBox="0 0 24 24" style={sz} fill="currentColor">
          <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.26 5.68.41.36.78 1.07.78 2.15v3.19c0 .31.21.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
        </svg>);

    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" style={sz} fill="currentColor">
          <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.34 18.34H5.67V9.67h2.67v8.67zM7 8.5a1.54 1.54 0 1 1 0-3.08 1.54 1.54 0 0 1 0 3.08zm11.34 9.84h-2.67v-4.21c0-1-.02-2.29-1.4-2.29-1.4 0-1.61 1.09-1.61 2.22v4.28h-2.66V9.67h2.55v1.19h.04c.36-.67 1.22-1.39 2.52-1.39 2.7 0 3.2 1.78 3.2 4.09v4.78z" />
        </svg>);

    case 'phone':
      return (
        <svg viewBox="0 0 24 24" style={sz} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>);

    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" style={sz} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
        </svg>);

    default:
      return null;
  }
}

// -------- Contact --------
function ContactCard({ logo, label, value, href, copy, accent, large, i }) {
  const [hover, setHover] = useState_S(false);
  const [copied, setCopied] = useState_S(false);
  const handle = (e) => {
    if (copy) {
      e.preventDefault();
      navigator.clipboard?.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };
  return (
    <a
      href={href}
      target={copy ? undefined : '_blank'}
      rel="noopener"
      onClick={handle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        gridColumn: large ? 'span 2' : 'span 1',
        position: 'relative',
        overflow: 'hidden',
        background: hover ? 'var(--ink)' : 'var(--bg-2)',
        color: hover ? 'var(--bg)' : 'var(--ink)',
        border: '1px solid var(--line)',
        borderRadius: 18,
        padding: large ? '32px 30px' : '26px 24px',
        display: 'flex', flexDirection: 'column', gap: 10,
        cursor: 'pointer',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hover ?
        '0 24px 50px rgba(23,42,57,0.20)' :
        '0 4px 14px rgba(23,42,57,0.05)',
        transition: 'all 0.4s cubic-bezier(.2,.8,.2,1)',
        animation: `cardIn 0.6s ${0.05 * i}s both`,
        minHeight: large ? 168 : 132
      }}>
      
      {/* accent corner */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 90, height: 90,
        background: accent,
        clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
        opacity: hover ? 1 : 0.18,
        transition: 'opacity 0.4s'
      }} />

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 1
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: hover ? 'var(--bg)' : 'var(--bg)',
          color: hover ? 'var(--ink)' : 'var(--ink)',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 4px 10px rgba(23,42,57,0.10)',
          transition: 'transform 0.4s',
          transform: hover ? 'rotate(-8deg) scale(1.05)' : 'rotate(0)'
        }}>
          <SocialLogo name={logo} size={20} />
        </div>
        <span style={{
          fontSize: 22, opacity: hover ? 1 : 0.4,
          transform: hover ? 'translateX(4px) rotate(-45deg)' : 'rotate(-45deg)',
          transition: 'all 0.3s', display: 'inline-block'
        }}>→</span>
      </div>

      <div style={{ marginTop: 'auto', position: 'relative', zIndex: 1 }}>
        <div className="mono" style={{
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          opacity: 0.55, marginBottom: 6
        }}>
          {copied ? '✓ COPIED' : label}
        </div>
        <div style={{
          fontSize: large ? 22 : 15,
          fontWeight: 600, letterSpacing: '-0.01em',
          wordBreak: 'break-word', lineHeight: 1.2
        }}>{value}</div>
      </div>
    </a>);

}

function Contact() {
  const [ref, inView] = useInView();
  return (
    <section id="contact" ref={ref} style={{
      padding: '140px 32px 100px',
      maxWidth: 1200, margin: '0 auto',
      position: 'relative'
    }}>
      <div className="mono" style={{
        color: 'var(--cherry)', fontSize: 12, letterSpacing: '0.3em', marginBottom: 30, fontWeight: 700
      }}>
        06 / CONTACT
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)',
        gap: 60,
        alignItems: 'start',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 1s cubic-bezier(.2,.8,.2,1)'
      }} className="contact-grid">
        {/* Left — headline + intro */}
        <div>
          <h2 className="serif" style={{
            fontSize: 'clamp(56px, 9vw, 128px)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            lineHeight: 0.95,
            marginBottom: 32
          }}>
            let&rsquo;s build<br />
            <em style={{ color: 'var(--cherry)' }}>something good.</em>
          </h2>

          <p style={{
            fontSize: 18, lineHeight: 1.65,
            color: 'var(--ink-dim)', maxWidth: 480,
            marginBottom: 32
          }}>
            Whether you have an internship to fill, a side-project that needs a builder,
            or just want to argue about whether YOLO beats RT-DETR — my inbox is open.
            I reply within 24 hours.
          </p>

          {/* Status pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '10px 16px',
            background: 'var(--bg-2)',
            border: '1px solid var(--line)',
            borderRadius: 999,
            marginBottom: 40
          }}>
            <span style={{
              position: 'relative', display: 'inline-flex',
              width: 9, height: 9
            }}>
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: '#1ea35a', opacity: 0.35,
                animation: 'navPing 1.8s ease-out infinite'
              }} />
              <span style={{
                position: 'relative', width: 9, height: 9, borderRadius: '50%',
                background: '#1ea35a', boxShadow: '0 0 8px rgba(30,163,90,0.6)'
              }} />
            </span>
            <span className="mono" style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--ink)'
            }}>Available · accepting briefs</span>
          </div>

          {/* mini info row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16, paddingTop: 30,
            borderTop: '1px solid var(--line)'
          }}>
            <div>
              <div className="mono" style={{
                fontSize: 10, letterSpacing: '0.2em',
                color: 'var(--ink-faint)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700
              }}>Based in</div>
              <div style={{ fontSize: 14, lineHeight: 1.4 }}>Malaysia 🇲🇾</div>
            </div>
            <div>
              <div className="mono" style={{
                fontSize: 10, letterSpacing: '0.2em',
                color: 'var(--ink-faint)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700
              }}>Timezone</div>
              <div style={{ fontSize: 14, lineHeight: 1.4 }}>GMT+8<br /><span style={{ color: 'var(--ink-dim)' }}>(MYT)</span></div>
            </div>
            <div>
              <div className="mono" style={{
                fontSize: 10, letterSpacing: '0.2em',
                color: 'var(--ink-faint)', textTransform: 'uppercase', marginBottom: 8, fontWeight: 700
              }}>Reply in</div>
              <div style={{ fontSize: 14, lineHeight: 1.4 }}>&lt; 24h<br /><span style={{ color: 'var(--ink-dim)' }}>weekdays</span></div>
            </div>
          </div>
        </div>

        {/* Right — social cards grid */}
        <div className="contact-cards" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14
        }}>
          <ContactCard
            i={0}
            logo="mail" large
            label="EMAIL ME · CLICK TO COPY"
            value="shruzaimi@gmail.com"
            href="mailto:shruzaimi@gmail.com"
            copy
            accent="var(--cherry)" />
          
          <ContactCard
            i={1}
            logo="github"
            label="GITHUB"
            value="@CarlosSain55"
            href="https://github.com/CarlosSain55"
            accent="var(--ink)" />
          
          <ContactCard
            i={2}
            logo="linkedin"
            label="LINKEDIN"
            value="Sharif Ruzaimi"
            href="https://www.linkedin.com/in/sharif-ruzaimi-syirazi"
            accent="#0077b5" />
          
          <ContactCard
            i={3}
            logo="phone"
            label="WHATSAPP / CALL"
            value="+60 17-811 7668"
            href="tel:+60178117668"
            accent="#1ea35a" />
          
        </div>
      </div>

      {/* Big sign-off */}
      <div style={{
        marginTop: 100,
        paddingTop: 50,
        borderTop: '1px solid var(--line)',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 40,
        alignItems: 'end',
        flexWrap: 'wrap'
      }}>
        <div className="serif" style={{
          fontSize: 'clamp(40px, 8vw, 96px)',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: 'var(--cherry)',
          fontStyle: 'italic'
        }}>
          — sharif.
        </div>
        <div className="mono" style={{
          fontSize: 11, color: 'var(--ink-faint)',
          textAlign: 'right',
          letterSpacing: '0.1em'
        }}>
          © 2026 sharif ruzaimi syirazi<br />
          handcrafted with html, css &amp; a little caffeine
        </div>
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>);

}

window.Nav = Nav;
window.Hero = Hero;
window.About = About;
window.Experience = Experience;
window.Projects = Projects;
window.Contact = Contact;
window.Marquee = Marquee;