// 3D Keycap Keyboard — Sharif's skills
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ----- Palette — Editorial (navy / cream / vermillion / slate) -----
const CAP_COLORS = {
  cherry:  { top: 'linear-gradient(160deg, #ff7a5f 0%, #fc563c 100%)', side: '#8a1e0d', text: '#fff8f4', shadow: '#4a0e05' },
  orange:  { top: 'linear-gradient(160deg, #ff7a5f 0%, #fc563c 100%)', side: '#8a1e0d', text: '#fff8f4', shadow: '#4a0e05' },
  amber:   { top: 'linear-gradient(160deg, #ffffff 0%, #e9e4e0 100%)', side: '#a8a098', text: '#172a39', shadow: '#5a5247' },
  pink:    { top: 'linear-gradient(160deg, #8a9090 0%, #6e7575 100%)', side: '#3a3e3e', text: '#fff8f4', shadow: '#1a1c1c' },
  cream:   { top: 'linear-gradient(160deg, #ffffff 0%, #e9e4e0 100%)', side: '#a8a098', text: '#172a39', shadow: '#5a5247' },
  rose:    { top: 'linear-gradient(160deg, #2e4459 0%, #172a39 100%)', side: '#08121b', text: '#e9e4e0', shadow: '#000' },
  dark:    { top: 'linear-gradient(160deg, #2e4459 0%, #172a39 100%)', side: '#08121b', text: '#e9e4e0', shadow: '#000' },
  blush:   { top: 'linear-gradient(160deg, #ff7a5f 0%, #fc563c 100%)', side: '#8a1e0d', text: '#fff8f4', shadow: '#4a0e05' },
};

// ----- Brand logo via Simple Icons CDN (CC0 SVG marks, recolored to cap text color) -----
function BrandLogo({ slug, color }) {
  const url = `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;
  return (
    <div style={{
      width: '52%', height: '52%',
      WebkitMaskImage: `url("${url}")`,
      maskImage: `url("${url}")`,
      WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center', maskPosition: 'center',
      WebkitMaskSize: 'contain', maskSize: 'contain',
      backgroundColor: color
    }} />
  );
}

// ----- Original line-icon glyphs (category-appropriate, not branded marks) -----
function CapIcon({ name, color }) {
  const props = {
    viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.7,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { width: '52%', height: '52%', display: 'block' }
  };
  const fillProps = { ...props, fill: color, stroke: 'none' };
  switch (name) {
    case 'terminal': return (<svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="7 10 10 12 7 14" /><line x1="13" y1="15" x2="17" y2="15" /></svg>);
    case 'braces': return (<svg {...props}><path d="M9 4 C5 4 5 8 5 9 v2 c0 1 -1 1 -2 1 c1 0 2 0 2 1 v2 c0 1 0 5 4 5" /><path d="M15 4 c4 0 4 4 4 5 v2 c0 1 1 1 2 1 c-1 0 -2 0 -2 1 v2 c0 1 0 5 -4 5" /></svg>);
    case 'angleSq': return (<svg {...props}><polyline points="9 6 4 12 9 18" /><polyline points="15 6 20 12 15 18" /><line x1="13" y1="6" x2="11" y2="18" /></svg>);
    case 'cup': return (<svg {...props}><path d="M5 8 h12 v6 a4 4 0 0 1 -4 4 h-4 a4 4 0 0 1 -4 -4z" /><path d="M17 10 h2 a2 2 0 0 1 0 4 h-2" /><path d="M8 2 c0 1 -1 1 -1 2 s1 1 1 2" /><path d="M12 2 c0 1 -1 1 -1 2 s1 1 1 2" /></svg>);
    case 'arrow': return (<svg {...props}><line x1="4" y1="20" x2="20" y2="4" /><polyline points="14 4 20 4 20 10" /></svg>);
    case 'htmlTag': return (<svg {...props}><polyline points="14 4 10 20" /><polyline points="9 8 4 12 9 16" /><polyline points="15 8 20 12 15 16" /></svg>);
    case 'brush': return (<svg {...props}><path d="M19 3 L11 11 l-3 3 L5 17 l2 2 l3 -3 l3 -3 l8 -8z" /><path d="M14 5 L19 10" /><path d="M5 17 a2 2 0 0 0 -2 2 a3 3 0 0 0 4 0" /></svg>);
    case 'cylinder': return (<svg {...props}><ellipse cx="12" cy="6" rx="7" ry="2.5" /><path d="M5 6 v12" /><path d="M19 6 v12" /><path d="M5 12 a7 2.5 0 0 0 14 0" /><path d="M5 18 a7 2.5 0 0 0 14 0" /></svg>);
    case 'link': return (<svg {...props}><path d="M10 14 a4 4 0 0 1 0 -6 l2 -2 a4 4 0 0 1 6 6 l-1 1" /><path d="M14 10 a4 4 0 0 1 0 6 l-2 2 a4 4 0 0 1 -6 -6 l1 -1" /></svg>);
    case 'atom': return (<svg {...props}><circle cx="12" cy="12" r="1.6" fill={color} /><ellipse cx="12" cy="12" rx="10" ry="3.5" /><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-60 12 12)" /></svg>);
    case 'hex': return (<svg {...props}><polygon points="12 3 21 8 21 16 12 21 3 16 3 8" /><polyline points="12 3 12 12 21 16" /><line x1="12" y1="12" x2="3" y2="16" /></svg>);
    case 'flask': return (<svg {...props}><line x1="9" y1="3" x2="15" y2="3" /><path d="M10 3 v6 l-5 9 a2 2 0 0 0 2 3 h10 a2 2 0 0 0 2 -3 l-5 -9 v-6" /><line x1="8" y1="14" x2="16" y2="14" /></svg>);
    case 'flame': return (<svg {...props}><path d="M12 3 c0 3 -5 4 -5 10 a5 5 0 0 0 10 0 c0 -3 -2 -4 -3 -7 c-1 -2 -2 -3 -2 -3z" /><path d="M12 14 c-2 0 -3 1 -3 3 a3 3 0 0 0 6 0 c0 -1 -1 -2 -1 -3" /></svg>);
    case 'letterB': return (<svg {...props}><path d="M7 4 v16" /><path d="M7 4 h6 a3 3 0 0 1 0 6 h-6" /><path d="M7 10 h7 a3 3 0 0 1 0 6 h-7" /></svg>);
    case 'eye': return (<svg {...props}><path d="M2 12 c2.5 -4.5 6 -7 10 -7 s7.5 2.5 10 7 c-2.5 4.5 -6 7 -10 7 s-7.5 -2.5 -10 -7z" /><circle cx="12" cy="12" r="3" /></svg>);
    case 'target': return (<svg {...props}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5.5" /><circle cx="12" cy="12" r="2" fill={color} /></svg>);
    case 'spark': return (<svg {...fillProps}><path d="M12 2 L13.5 9.5 L21 12 L13.5 14.5 L12 22 L10.5 14.5 L3 12 L10.5 9.5 z" /></svg>);
    case 'brain': return (<svg {...props}><path d="M12 4 a3 3 0 0 0 -3 3 a3 3 0 0 0 -3 3 a3 3 0 0 0 1 5 a3 3 0 0 0 2 3 a3 3 0 0 0 3 2 z" /><path d="M12 4 a3 3 0 0 1 3 3 a3 3 0 0 1 3 3 a3 3 0 0 1 -1 5 a3 3 0 0 1 -2 3 a3 3 0 0 1 -3 2 z" /><line x1="12" y1="8" x2="12" y2="20" /></svg>);
    case 'arrayBracket': return (<svg {...props}><polyline points="9 4 4 4 4 20 9 20" /><polyline points="15 4 20 4 20 20 15 20" /><line x1="11" y1="9" x2="13" y2="9" /><line x1="11" y1="15" x2="13" y2="15" /></svg>);
    case 'branch': return (<svg {...props}><circle cx="6" cy="5" r="2" /><circle cx="6" cy="19" r="2" /><circle cx="18" cy="12" r="2" /><line x1="6" y1="7" x2="6" y2="17" /><path d="M16 12 a6 6 0 0 0 -6 -6" /></svg>);
    case 'chevronUp': return (<svg {...props}><polyline points="5 14 12 7 19 14" /><polyline points="5 19 12 12 19 19" /></svg>);
    case 'barChart': return (<svg {...props}><line x1="4" y1="20" x2="20" y2="20" /><rect x="6" y="13" width="3" height="7" fill={color} stroke="none" /><rect x="11" y="8" width="3" height="12" fill={color} stroke="none" /><rect x="16" y="4" width="3" height="16" fill={color} stroke="none" /></svg>);
    case 'flow': return (<svg {...props}><path d="M4 8 h12" /><polyline points="13 5 16 8 13 11" /><path d="M20 16 h-12" /><polyline points="11 13 8 16 11 19" /></svg>);
    case 'cube': return (<svg {...props}><polygon points="12 2 21 7 21 17 12 22 3 17 3 7" /><polyline points="3 7 12 12 21 7" /><line x1="12" y1="12" x2="12" y2="22" /></svg>);
    default: return null;
  }
}

// ----- Skills layout (5 cols × 5 rows = 25 caps) -----
const SKILLS = [
  // row 0 — languages
  { label: 'PY',   name: 'Python',         tag: 'language',  key: 'p', color: 'amber',   logo: 'python',       row: 0, col: 0 },
  { label: 'JS',   name: 'JavaScript',     tag: 'language',  key: 'j', color: 'amber',   logo: 'javascript',   row: 0, col: 1 },
  { label: 'PHP',  name: 'PHP',            tag: 'language',  key: 'h', color: 'rose',    logo: 'php',          row: 0, col: 2 },
  { label: 'JAVA', name: 'Java',           tag: 'language',  key: 'a', color: 'cherry',  logo: 'openjdk',      row: 0, col: 3 },
  { label: 'DART', name: 'Dart',           tag: 'language',  key: 'd', color: 'orange',  logo: 'dart',         row: 0, col: 4 },
  // row 1 — web + data
  { label: 'HTML', name: 'HTML5',          tag: 'web',       key: 't', color: 'orange',  logo: 'html5',        row: 1, col: 0 },
  { label: 'CSS',  name: 'CSS3',           tag: 'web',       key: 'c', color: 'pink',    logo: 'css3',         row: 1, col: 1 },
  { label: 'SQL',  name: 'SQL',            tag: 'data',      key: 's', color: 'dark',    icon: 'cylinder',     row: 1, col: 2 },
  { label: 'API',  name: 'REST API',       tag: 'web',       key: 'r', color: 'cream',   icon: 'link',         row: 1, col: 3 },
  { label: 'MY',   name: 'MySQL',          tag: 'data',      key: 'm', color: 'amber',   logo: 'mysql',        row: 1, col: 4 },
  // row 2 — frameworks
  { label: 'RCT',  name: 'React',          tag: 'framework', key: 'k', color: 'pink',    logo: 'react',        row: 2, col: 0 },
  { label: 'NODE', name: 'Node.js',        tag: 'framework', key: 'n', color: 'cherry',  logo: 'nodedotjs',    row: 2, col: 1 },
  { label: 'FLSK', name: 'Flask',          tag: 'framework', key: 'l', color: 'dark',    logo: 'flask',        row: 2, col: 2 },
  { label: 'CI4',  name: 'CodeIgniter 4',  tag: 'framework', key: 'i', color: 'orange',  logo: 'codeigniter',  row: 2, col: 3 },
  { label: 'BTS',  name: 'Bootstrap',      tag: 'framework', key: 'b', color: 'blush',   logo: 'bootstrap',    row: 2, col: 4 },
  // row 3 — AI
  { label: 'CV',   name: 'OpenCV',         tag: 'ai',        key: 'o', color: 'cream',   logo: 'opencv',       row: 3, col: 0 },
  { label: 'YOLO', name: 'YOLO',           tag: 'ai',        key: 'y', color: 'cherry',  icon: 'target',       row: 3, col: 1 },
  { label: 'AI',   name: 'Artificial Intelligence', tag: 'ai', key: 'q', color: 'rose',  icon: 'spark',        row: 3, col: 2 },
  { label: 'ML',   name: 'Machine Learning', tag: 'ai',      key: 'e', color: 'amber',   icon: 'brain',        row: 3, col: 3 },
  { label: 'NPY',  name: 'NumPy',          tag: 'ai',        key: 'u', color: 'pink',    logo: 'numpy',        row: 3, col: 4 },
  // row 4 — tools
  { label: 'GIT',  name: 'Git',            tag: 'tools',     key: 'g', color: 'orange',  logo: 'git',          row: 4, col: 0 },
  { label: 'GH',   name: 'GitHub',         tag: 'tools',     key: 'f', color: 'dark',    logo: 'github',       row: 4, col: 1 },
  { label: 'PBI',  name: 'Power BI',       tag: 'tools',     key: 'v', color: 'amber',   logo: 'powerbi',      row: 4, col: 2 },
  { label: 'ETL',  name: 'ETL Pipeline',   tag: 'data',      key: 'w', color: 'blush',   icon: 'flow',         row: 4, col: 3 },
  { label: 'OLAP', name: 'OLAP / DW',      tag: 'data',      key: 'x', color: 'cream',   icon: 'cube',         row: 4, col: 4 },
];

// ----- Single keycap -----
function Keycap({ skill, pressed, hovered, onPress, onHover, onLeave, size = 88, height = 34, gap = 14 }) {
  const c = CAP_COLORS[skill.color];
  const W = size, H = size, K = height;
  const px = skill.col * (W + gap);
  const py = skill.row * (H + gap);
  const liftZ = pressed ? -12 : (hovered ? 4 : 0);

  const faceBase = { position: 'absolute', background: c.side, boxShadow: `inset 0 0 0 1px rgba(0,0,0,0.25)` };

  return (
    <div
      onMouseDown={onPress}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onTouchStart={(e) => { e.preventDefault(); onPress(); }}
      style={{
        position: 'absolute',
        left: px, top: py, width: W, height: H,
        transformStyle: 'preserve-3d',
        cursor: 'pointer',
      }}
    >
      {/* cap body that translates Z for press */}
      <div style={{
        position: 'absolute', inset: 0,
        transformStyle: 'preserve-3d',
        transform: `translateZ(${liftZ}px)`,
        transition: 'transform 110ms cubic-bezier(.2,.8,.2,1)',
      }}>
        {/* Top face — slightly inset for the keycap dome edge */}
        <div style={{
          position: 'absolute', left: 4, top: 4, width: W - 8, height: H - 8,
          background: c.top,
          borderRadius: 9,
          transform: `translateZ(${K}px)`,
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.18), inset 0 -3px 0 rgba(0,0,0,0.15), inset 0 3px 0 rgba(255,255,255,0.10)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.10))',
            userSelect: 'none', pointerEvents: 'none'
          }}>
            {skill.logo ? <BrandLogo slug={skill.logo} color={c.text} />
              : skill.icon ? <CapIcon name={skill.icon} color={c.text} />
              : (
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                fontSize: skill.label.length >= 4 ? 14 : (skill.label.length === 3 ? 17 : 22),
                color: c.text,
                letterSpacing: skill.label.length >= 4 ? '-0.02em' : '-0.01em',
                textShadow: '0 1px 0 rgba(255,255,255,0.15)'
              }}>{skill.label}</span>
            )}
          </span>
          {/* tiny key hint */}
          <span style={{
            position: 'absolute', bottom: 4, right: 6,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 8, opacity: 0.55, color: c.text,
            textTransform: 'uppercase',
          }}>{skill.key}</span>
        </div>
        {/* Skirt below the top (the cap's rim) */}
        <div style={{
          position: 'absolute', left: 0, top: 0, width: W, height: H,
          background: `linear-gradient(180deg, ${c.side} 0%, ${c.shadow} 100%)`,
          borderRadius: 10,
          transform: `translateZ(${K - 6}px)`,
          boxShadow: `0 0 0 1px rgba(0,0,0,0.4)`,
        }} />
        {/* North face */}
        <div style={{
          ...faceBase,
          left: 0, top: -K, width: W, height: K,
          background: `linear-gradient(180deg, ${c.shadow}, ${c.side})`,
          transformOrigin: '50% 100%',
          transform: 'rotateX(90deg)',
          borderTopLeftRadius: 4, borderTopRightRadius: 4,
        }} />
        {/* South face */}
        <div style={{
          ...faceBase,
          left: 0, top: H, width: W, height: K,
          background: `linear-gradient(0deg, ${c.shadow}, ${c.side})`,
          transformOrigin: '50% 0%',
          transform: 'rotateX(-90deg)',
        }} />
        {/* West face */}
        <div style={{
          ...faceBase,
          left: -K, top: 0, width: K, height: H,
          background: `linear-gradient(90deg, ${c.shadow}, ${c.side})`,
          transformOrigin: '100% 50%',
          transform: 'rotateY(-90deg)',
        }} />
        {/* East face */}
        <div style={{
          ...faceBase,
          left: W, top: 0, width: K, height: H,
          background: `linear-gradient(-90deg, ${c.shadow}, ${c.side})`,
          transformOrigin: '0% 50%',
          transform: 'rotateY(90deg)',
        }} />
      </div>

      {/* Static base under the cap (the "switch housing") */}
      <div style={{
        position: 'absolute', left: 2, top: 2, width: W - 4, height: H - 4,
        background: '#0a141d',
        borderRadius: 6,
        boxShadow: '0 0 0 1px rgba(233,228,224,0.04)',
      }} />
    </div>
  );
}

// ----- Keyboard stage -----
function SkillsKeyboard() {
  const [pressed, setPressed] = useState(new Set());
  const [hover, setHover] = useState(null);
  const [active, setActive] = useState(null); // last pressed skill, for info card
  const [rotation, setRotation] = useState({ x: 56, z: -28 });
  const stageRef = useRef(null);

  const COLS = 5, ROWS = 5;
  const SIZE = 88, GAP = 14;
  const W = COLS * SIZE + (COLS - 1) * GAP;
  const H = ROWS * SIZE + (ROWS - 1) * GAP;

  const press = useCallback((skill) => {
    setActive(skill);
    setPressed((s) => new Set([...s, skill.label]));
    setTimeout(() => {
      setPressed((s) => {
        const n = new Set(s); n.delete(skill.label); return n;
      });
    }, 220);
  }, []);

  // Keyboard binding
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const k = e.key.toLowerCase();
      const skill = SKILLS.find((s) => s.key === k);
      if (skill) {
        e.preventDefault();
        press(skill);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [press]);

  // Subtle parallax tilt on mouse move
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const handle = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / r.width;
      const dy = (e.clientY - cy) / r.height;
      setRotation({ x: 56 + dy * 6, z: -28 + dx * 6 });
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  const tagColors = {
    language: 'var(--orange)',
    web: 'var(--cherry)',
    data: 'var(--cherry)',
    framework: 'var(--orange)',
    ai: 'var(--cherry)',
    tools: 'var(--ink-dim)',
  };

  return (
    <div className="keyboard-section" style={{
      position: 'relative',
      padding: '120px 24px 80px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Section heading */}
      <div style={{ textAlign: 'center', marginBottom: 16, zIndex: 5 }}>
        <div className="mono" style={{ color: 'var(--cherry)', fontSize: 12, letterSpacing: '0.3em', marginBottom: 14 }}>
          03 / SKILLS
        </div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: 'var(--ink)',
        }}>
          the stack
        </h2>
        <p className="mono" style={{
          color: 'var(--ink-dim)', fontSize: 13, marginTop: 14,
        }}>
          <span style={{ color: 'var(--orange)' }}>›</span> hover the caps, or press any key on your real keyboard
        </p>
      </div>

      {/* 3D stage */}
      <div
        ref={stageRef}
        style={{
          perspective: '1800px',
          perspectiveOrigin: '50% 40%',
          width: '100%',
          maxWidth: 900,
          height: 620,
          position: 'relative',
          marginTop: 20,
        }}
      >
        {/* Glow under board */}
        <div style={{
          position: 'absolute', left: '50%', top: '70%', transform: 'translate(-50%, -50%)',
          width: 520, height: 220, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(252,86,60,0.22), rgba(23,42,57,0.10) 50%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        <div style={{
          width: W, height: H,
          position: 'absolute',
          left: '50%', top: '50%',
          transformStyle: 'preserve-3d',
          transform: `translate(-50%, -50%) rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg)`,
          transition: 'transform 400ms cubic-bezier(.2,.8,.2,1)',
        }}>
          {/* Floor / PCB plate */}
          <div style={{
            position: 'absolute',
            left: -28, top: -28, width: W + 56, height: H + 56,
            background: 'linear-gradient(135deg, #1f3447 0%, #0d1822 100%)',
            borderRadius: 18,
            boxShadow: 'inset 0 0 0 1px rgba(233,228,224,0.10), 0 30px 80px rgba(23,42,57,0.30), 0 0 60px rgba(0,0,0,0.20)',
            transform: 'translateZ(-2px)',
          }} />

          {SKILLS.map((s) => (
            <Keycap
              key={s.label}
              skill={s}
              pressed={pressed.has(s.label)}
              hovered={hover === s.label}
              onHover={() => setHover(s.label)}
              onLeave={() => setHover(null)}
              onPress={() => press(s)}
              size={SIZE}
              gap={GAP}
            />
          ))}
        </div>
      </div>

      {/* Info readout */}
      <div style={{
        marginTop: 40,
        minHeight: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 5,
      }}>
        {active ? (
          <div key={active.label} style={{
            display: 'flex', gap: 14, alignItems: 'center',
            padding: '14px 22px',
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 999,
            boxShadow: '0 12px 32px rgba(23,42,57,0.18)',
            animation: 'popIn 0.4s cubic-bezier(.2,.8,.2,1)',
          }}>
            <span className="mono" style={{
              fontSize: 11, color: tagColors[active.tag],
              textTransform: 'uppercase', letterSpacing: '0.15em',
              fontWeight: 700,
            }}>{active.tag}</span>
            <span style={{ width: 1, height: 16, background: 'var(--line)' }} />
            <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--ink)' }}>{active.name}</span>
            <span className="mono" style={{
              fontSize: 11, color: 'var(--ink-faint)',
              padding: '4px 8px', border: '1px solid var(--line)', borderRadius: 4,
              textTransform: 'uppercase',
            }}>{active.key}</span>
          </div>
        ) : (
          <div className="mono" style={{ fontSize: 12, color: 'var(--ink-faint)' }}>
            // awaiting input
          </div>
        )}
      </div>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

window.SkillsKeyboard = SkillsKeyboard;
window.SKILLS_DATA = SKILLS;
