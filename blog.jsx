// Blog section — 3 sample posts with modal reader
const { useState: useState_B, useEffect: useEffect_B, useRef: useRef_B } = React;

const BLOG_POSTS = [
  {
    id: 'tutorgo',
    title: 'TutorGo: matching students with tutors',
    subtitle: 'Building a role-based booking platform in CodeIgniter 4',
    date: 'May 02, 2026',
    readTime: '6 min read',
    tags: ['Full-stack', 'CodeIgniter', 'PHP'],
    cover: { kind: 'tutorgo' },
    excerpt: 'Three roles, one database, and a hundred ways for the booking flow to break. Here is how I kept it boring on purpose.',
    body: [
      { type: 'p', text: 'TutorGo is a tuition-booking platform I built for a software-development course. The brief was simple — students should be able to find tutors, book sessions, and have those bookings show up on the tutor\u2019s schedule. The hard part is that the same data has to look different to three different people: the Admin who runs the platform, the Teacher who owns the slot, and the Student who is trying to grab it before someone else does.' },
      { type: 'h', text: '01 \u00b7 Role-based access from the first commit' },
      { type: 'p', text: 'My first version had a single users table with a role string. By week two I regretted nothing more. Permissions checks were sprinkled across every controller, and adding a new feature meant grepping the codebase to remember which roles could do what. I refactored to a small auth filter on each route group — Admin / Teacher / Student — and a tiny policy helper that returns a yes-or-no for a given action on a given resource. Suddenly the controllers got short again.' },
      { type: 'h', text: '02 \u00b7 The database carries the contract' },
      { type: 'p', text: 'CodeIgniter 4\u2019s migrations are unglamorous but they save you. Every schema change went through a migration; rolling back was one command. The booking flow is just three tables in the end: tutors, time_slots, bookings — with a uniqueness constraint on (slot_id) so a double-book is rejected by MySQL, not by my code. Always make the database say no first.' },
      { type: 'h', text: '03 \u00b7 REST API + sessions, not REST API or sessions' },
      { type: 'p', text: 'I split the surface into two: server-rendered pages for the dashboards (fast, simple, cheap), and a small REST API for anything that needed to be live — slot availability, booking status. The API uses CSRF tokens carried by the session cookie, so I did not have to bolt on a JWT system for what is really just an authenticated user clicking buttons.' },
      { type: 'p', text: 'The lesson I came away with: the framework is doing the boring parts so you can focus on the parts that are actually about your users. Routes, ORM, validation, sessions — let CodeIgniter handle them. Spend your design budget on the booking flow, the empty states, the error messages.' }
    ]
  },
  {
    id: 'yolo-fabric',
    title: 'Teaching a model to see thread',
    subtitle: 'What I learned building a YOLO defect detector for fabric',
    date: 'Apr 14, 2026',
    readTime: '6 min read',
    tags: ['AI', 'YOLO', 'Computer Vision'],
    cover: { kind: 'yolo' },
    excerpt: 'Real-time fabric defect detection sounded simple on paper. Annotating five hundred frames of denim in OpenCV taught me otherwise.',
    body: [
      { type: 'p', text: 'I picked up this project thinking it would mostly be Python plumbing — wire a webcam to a model, draw some boxes, ship the demo. Reality is, the model is the easy part. The hard part is data.' },
      { type: 'h', text: '01 · Labels are a design decision' },
      { type: 'p', text: 'My first dataset had three classes: hole, stain, misweave. After two days of annotating I realised a stain on light denim and a stain on dark denim looked like two different problems to YOLO. I collapsed it to two classes and pre-processed every frame to match a target luminance. mAP@50 jumped from 0.71 to 0.86 without touching the model.' },
      { type: 'h', text: '02 · The factory is not your laptop' },
      { type: 'p', text: 'My training set was shot at 4K under studio LEDs. The deployed setup ran on a $40 USB webcam under flickering fluorescents. The first week of testing, recall halved. The fix was unglamorous: shoot a thousand more frames on the actual hardware, in the actual lighting, and fine-tune for two more epochs.' },
      { type: 'h', text: '03 · Speed is a feature' },
      { type: 'p', text: 'YOLOv8n at 320×320 hit 28 FPS on the floor laptop. Switching to v8s would have nudged accuracy up by maybe 2% — and dropped to 9 FPS, which meant operators lost trust in the boxes drifting behind their hands. Smaller models that you actually deploy beat bigger models that you do not.' },
      { type: 'p', text: 'I shipped the project running Flask + OpenCV with role-based access for Inspector / Manager / Admin. The roles matter because nobody outside engineering wants to see false-positive logs; they want a clean signal of where to look. Build for the user in the room, not the user in the spec.' }
    ]
  },
  {
    id: 'star-schema',
    title: 'A thousand sales rows and a star',
    subtitle: 'Designing a warehouse that survives its first OLAP query',
    date: 'Feb 21, 2026',
    readTime: '5 min read',
    tags: ['Data', 'SQL', 'Power BI'],
    cover: { kind: 'star' },
    excerpt: 'OLTP tables are written by software. OLAP tables are read by humans. The schema has to forgive both.',
    body: [
      { type: 'p', text: 'For the Retail Sales Intelligence project I had five normalised source tables and a brief: load them into a warehouse, build a star schema, slice the sales across time, region and product. A thousand rows is small, but it is enough to teach you every mistake.' },
      { type: 'h', text: 'Pick the grain first, columns later' },
      { type: 'p', text: 'I spent the first afternoon arguing with myself about what one row in the fact table represents. A line item? An order? A daily total? I went with one fact row per line item, and never regretted it — every Roll-Up was a SUM(), every Drill-Down was a GROUP BY, and Slice / Dice were just WHERE clauses.' },
      { type: 'h', text: 'Derived dimensions earn their keep' },
      { type: 'p', text: 'I added two derived columns: AgeGroup (binned customer ages) and PriceRange (binned line prices). They cost almost nothing to compute in pandas during ETL, and turned three different Power BI visuals from "show me a histogram" into "show me a cohort".' },
      { type: 'h', text: 'The pipeline is the product' },
      { type: 'p', text: 'I built the ETL in plain pandas with SQLAlchemy: extract from MySQL source tables, deduplicate, type-convert, null-handle, write to the warehouse. The transformation logic lives in version control, not in a Power BI Power Query that only I can read. Future-me, opening this in six months, will thank past-me.' }
    ]
  },
  {
    id: 'matcha-shifts',
    title: 'Notes from behind a matcha bar',
    subtitle: 'Why I think pulling shots makes me a better engineer',
    date: 'Jan 08, 2026',
    readTime: '4 min read',
    tags: ['Life', 'Career'],
    cover: { kind: 'cup' },
    excerpt: 'A pop-up tent, a whisk, a hundred customers in three hours. The constraints are unusually clarifying.',
    body: [
      { type: 'p', text: 'My weekend job is at a matcha pop-up stall. People ask why a CS undergrad is whisking chasen-style usucha at 7am on a Saturday. Honestly, it has taught me as much about shipping software as any class has.' },
      { type: 'h', text: 'Latency is a feature' },
      { type: 'p', text: 'A customer waits, at most, four minutes. After that you have lost them. There is no equivalent of a loading spinner. So you preempt: measure the matcha while the milk steams, pre-warm the cups, batch the orders that share a base. Every barista is doing a tiny scheduler in their head.' },
      { type: 'h', text: 'Defaults matter more than options' },
      { type: 'p', text: 'Our menu has eight drinks. Most people order one of three. The right "default" is whatever clears the queue fastest while still delighting. Same for software — the path through the middle should be effortless. Power users can find the menu.' },
      { type: 'h', text: 'Showing up is the API' },
      { type: 'p', text: 'I have not missed a shift. Not one. That is half of being trusted to do anything harder, anywhere. The same is true of commits.' }
    ]
  }
];

function BlogCoverArt({ kind }) {
  // Small editorial SVG covers, no stock imagery
  if (kind === 'tutorgo') {
    return (
      <svg viewBox="0 0 200 140" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect width="200" height="140" fill="var(--cherry)" />
        <rect x="40" y="34" width="64" height="76" rx="6" fill="var(--bg)" />
        <rect x="40" y="34" width="64" height="14" rx="6" fill="var(--ink)" />
        <line x1="56" y1="28" x2="56" y2="42" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        <line x1="88" y1="28" x2="88" y2="42" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
        {[0, 1, 2, 3].map((c) =>
          [0, 1, 2].map((r) => {
            const x = 48 + c * 13, y = 54 + r * 16;
            const active = c === 2 && r === 1;
            return <rect key={`${c}-${r}`} x={x} y={y} width="9" height="10" rx="2" fill={active ? 'var(--cherry)' : 'rgba(23,42,57,0.10)'} />;
          })
        )}
        <circle cx="138" cy="56" r="14" fill="var(--bg)" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="138" cy="52" r="4" fill="var(--ink)" />
        <path d="M 128 66 q 10 -8 20 0" fill="none" stroke="var(--ink)" strokeWidth="2" />
        <circle cx="162" cy="86" r="14" fill="var(--ink)" />
        <circle cx="162" cy="82" r="4" fill="var(--bg)" />
        <path d="M 152 96 q 10 -8 20 0" fill="none" stroke="var(--bg)" strokeWidth="2" />
        <line x1="138" y1="70" x2="162" y2="72" stroke="var(--bg)" strokeWidth="2" strokeDasharray="3 3" />
        <text x="120" y="124" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="var(--bg)" fontWeight="700" letterSpacing="2">SLOT BOOKED</text>
      </svg>
    );
  }
  if (kind === 'yolo') {
    return (
      <svg viewBox="0 0 200 140" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect width="200" height="140" fill="var(--ink)" />
        <g stroke="var(--bg)" strokeWidth="0.6" opacity="0.18">
          {[...Array(11)].map((_, i) => <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="140" />)}
          {[...Array(8)].map((_, i) => <line key={`h${i}`} x1="0" y1={i * 20} x2="200" y2={i * 20} />)}
        </g>
        <rect x="50" y="36" width="64" height="58" fill="none" stroke="var(--cherry)" strokeWidth="2" />
        <rect x="118" y="74" width="40" height="36" fill="none" stroke="var(--cherry)" strokeWidth="2" />
        <text x="52" y="32" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="var(--cherry)" fontWeight="700">DEFECT_01 0.94</text>
        <text x="120" y="70" fontFamily="JetBrains Mono, monospace" fontSize="8" fill="var(--cherry)" fontWeight="700">STAIN 0.81</text>
        <circle cx="170" cy="22" r="3" fill="var(--cherry)" />
        <text x="178" y="25" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="var(--bg)" letterSpacing="1">LIVE</text>
      </svg>
    );
  }
  if (kind === 'star') {
    return (
      <svg viewBox="0 0 200 140" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect width="200" height="140" fill="var(--bg-2)" />
        {/* fact (center) */}
        <rect x="80" y="56" width="40" height="28" fill="var(--ink)" />
        <text x="100" y="74" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="var(--bg)" textAnchor="middle" fontWeight="700">FACT</text>
        {/* dimensions */}
        {[
          { x: 20, y: 18, label: 'TIME' },
          { x: 140, y: 18, label: 'CUST' },
          { x: 20, y: 100, label: 'PROD' },
          { x: 140, y: 100, label: 'STORE' }
        ].map((d, i) => (
          <g key={i}>
            <line x1={d.x + 20} y1={d.y + 12} x2="100" y2="70" stroke="var(--cherry)" strokeWidth="1.5" />
            <rect x={d.x} y={d.y} width="40" height="24" fill="var(--cherry)" />
            <text x={d.x + 20} y={d.y + 16} fontFamily="JetBrains Mono, monospace" fontSize="9" fill="var(--bg)" textAnchor="middle" fontWeight="700">{d.label}</text>
          </g>
        ))}
      </svg>
    );
  }
  if (kind === 'cup') {
    return (
      <svg viewBox="0 0 200 140" style={{ width: '100%', height: '100%', display: 'block' }}>
        <rect width="200" height="140" fill="var(--cherry)" />
        {/* cup */}
        <path d="M 70 60 H 130 V 100 a 12 12 0 0 1 -12 12 H 82 a 12 12 0 0 1 -12 -12 Z" fill="var(--bg)" />
        <path d="M 130 70 a 10 10 0 0 1 0 20" fill="none" stroke="var(--bg)" strokeWidth="3" />
        {/* matcha surface */}
        <ellipse cx="100" cy="62" rx="28" ry="5" fill="var(--ink)" />
        {/* steam */}
        <path d="M 85 50 q 5 -10 0 -20 q -5 -10 0 -20" fill="none" stroke="var(--bg)" strokeWidth="2" opacity="0.7" />
        <path d="M 100 48 q 5 -10 0 -20 q -5 -10 0 -20" fill="none" stroke="var(--bg)" strokeWidth="2" opacity="0.7" />
        <path d="M 115 50 q 5 -10 0 -20 q -5 -10 0 -20" fill="none" stroke="var(--bg)" strokeWidth="2" opacity="0.7" />
      </svg>
    );
  }
  return null;
}

function BlogCard({ post, i, onOpen }) {
  const [hover, setHover] = useState_B(false);
  return (
    <article
      onClick={() => onOpen(post)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: 'pointer',
        background: 'var(--bg-2)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transform: hover ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hover
          ? '0 28px 60px rgba(23,42,57,0.18), 0 0 0 1px var(--line)'
          : '0 8px 24px rgba(23,42,57,0.06), 0 0 0 1px var(--line)',
        transition: 'transform 0.45s cubic-bezier(.2,.8,.2,1), box-shadow 0.45s'
      }}
    >
      {/* Cover */}
      <div style={{ aspectRatio: '10 / 7', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          transform: hover ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 0.7s cubic-bezier(.2,.8,.2,1)'
        }}>
          <BlogCoverArt kind={post.cover.kind} />
        </div>
        {/* Index badge */}
        <div className="mono" style={{
          position: 'absolute', top: 14, left: 14,
          background: 'var(--bg)', color: 'var(--ink)',
          padding: '4px 9px', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.2em', borderRadius: 999
        }}>
          0{i + 1}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '22px 22px 24px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div className="mono" style={{
          fontSize: 10, color: 'var(--ink-faint)',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap'
        }}>
          <span>{post.date}</span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-faint)' }} />
          <span>{post.readTime}</span>
        </div>

        <h3 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 26, fontWeight: 600,
          letterSpacing: '-0.02em', lineHeight: 1.15,
          color: hover ? 'var(--cherry)' : 'var(--ink)',
          transition: 'color 0.3s'
        }}>{post.title}</h3>

        <p style={{
          fontSize: 14, lineHeight: 1.55,
          color: 'var(--ink-dim)', margin: 0, flex: 1
        }}>{post.excerpt}</p>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 6, paddingTop: 14, borderTop: '1px solid var(--line)'
        }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {post.tags.map((t) => (
              <span key={t} className="mono" style={{
                fontSize: 9, padding: '3px 8px',
                background: 'var(--bg)', border: '1px solid var(--line)',
                borderRadius: 999, color: 'var(--ink-dim)',
                letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700
              }}>{t}</span>
            ))}
          </div>
          <span className="mono" style={{
            fontSize: 11, color: 'var(--cherry)', fontWeight: 700,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transform: hover ? 'translateX(4px)' : 'translateX(0)',
            transition: 'transform 0.3s'
          }}>
            READ <span style={{ fontSize: 14 }}>→</span>
          </span>
        </div>
      </div>
    </article>
  );
}

function BlogModal({ post, onClose }) {
  useEffect_B(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!post) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(23,42,57,0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        padding: '60px 24px',
        overflowY: 'auto',
        animation: 'modalFade 0.3s ease-out'
      }}
    >
      <article
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg)',
          maxWidth: 760, width: '100%',
          borderRadius: 18,
          boxShadow: '0 40px 100px rgba(23,42,57,0.4)',
          overflow: 'hidden',
          animation: 'modalSlide 0.45s cubic-bezier(.2,.8,.2,1)'
        }}
      >
        {/* Cover */}
        <div style={{ aspectRatio: '10 / 4', position: 'relative' }}>
          <BlogCoverArt kind={post.cover.kind} />
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 38, height: 38, borderRadius: '50%',
              background: 'var(--bg)', border: '1px solid var(--line)',
              color: 'var(--ink)', fontSize: 20, lineHeight: 1,
              cursor: 'pointer', display: 'grid', placeItems: 'center',
              boxShadow: '0 6px 14px rgba(23,42,57,0.20)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--cherry)'; e.currentTarget.style.color = 'var(--bg)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--ink)'; }}
          >×</button>
        </div>

        {/* Header */}
        <div style={{ padding: '36px 44px 0' }}>
          <div className="mono" style={{
            fontSize: 11, color: 'var(--ink-faint)',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18,
            flexWrap: 'wrap'
          }}>
            <span>{post.date}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-faint)' }} />
            <span>{post.readTime}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-faint)' }} />
            {post.tags.map((t, i) => (
              <React.Fragment key={t}>
                <span style={{ color: 'var(--cherry)', fontWeight: 700 }}>{t}</span>
                {i < post.tags.length - 1 && <span>·</span>}
              </React.Fragment>
            ))}
          </div>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700, letterSpacing: '-0.03em',
            lineHeight: 1.05, marginBottom: 12,
            color: 'var(--ink)'
          }}>{post.title}</h1>

          <p className="serif" style={{
            fontSize: 22, fontStyle: 'italic',
            color: 'var(--ink-dim)', fontWeight: 400,
            lineHeight: 1.4, marginBottom: 32
          }}>{post.subtitle}</p>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 0', borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)', marginBottom: 32
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'var(--cherry)', color: 'var(--bg)',
              display: 'grid', placeItems: 'center',
              fontWeight: 700, fontSize: 14
            }}>SR</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Sharif Ruzaimi</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>
                BSc Computer Science · UniSZA
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '0 44px 48px' }}>
          {post.body.map((block, i) => {
            if (block.type === 'h') {
              return (
                <h2 key={i} style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em',
                  color: 'var(--ink)', marginTop: 36, marginBottom: 12
                }}>{block.text}</h2>
              );
            }
            return (
              <p key={i} style={{
                fontSize: 17, lineHeight: 1.75,
                color: 'var(--ink)', marginBottom: 18
              }}>{block.text}</p>
            );
          })}

          {/* Footer */}
          <div style={{
            marginTop: 48, paddingTop: 24,
            borderTop: '1px solid var(--line)',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: 14
          }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>
              END OF POST · thanks for reading
            </div>
            <button onClick={onClose} className="mono" style={{
              background: 'var(--ink)', color: 'var(--bg)',
              padding: '10px 18px', borderRadius: 999,
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
              cursor: 'pointer'
            }}>← BACK TO NOTES</button>
          </div>
        </div>
      </article>

      <style>{`
        @keyframes modalFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlide { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

function Blog() {
  const [open, setOpen] = useState_B(null);
  return (
    <section id="blog" style={{
      padding: '140px 32px',
      maxWidth: 1200, margin: '0 auto'
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', marginBottom: 60,
        flexWrap: 'wrap', gap: 20
      }}>
        <div>
          <div className="mono" style={{
            color: 'var(--cherry)', fontSize: 12, letterSpacing: '0.3em',
            marginBottom: 18, fontWeight: 700
          }}>
            05 / NOTES
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(48px, 8vw, 96px)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: 'var(--ink)'
          }}>
            things i&rsquo;ve <span className="serif" style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--cherry)' }}>written</span>
          </h2>
        </div>
        <div className="mono" style={{
          fontSize: 12, color: 'var(--ink-faint)', maxWidth: 280,
          lineHeight: 1.6
        }}>
          Field notes from projects, school, and the matcha bar.<br />
          Short reads, no fluff.
        </div>
      </div>

      <div className="blog-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24
      }}>
        {BLOG_POSTS.map((p, i) => (
          <BlogCard key={p.id} post={p} i={i} onOpen={setOpen} />
        ))}
      </div>

      {open && <BlogModal post={open} onClose={() => setOpen(null)} />}

      <style>{`
        @media (max-width: 920px) {
          .blog-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 620px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

window.Blog = Blog;
