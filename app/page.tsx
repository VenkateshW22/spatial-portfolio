'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { Command } from 'cmdk';
import useSound from 'use-sound';
import {
  ArrowUpRight,
  ArrowDown,
  Github,
  Linkedin,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  X,
  Command as CommandIcon,
  Play,
  MoveUpRight,
  Terminal,
  ExternalLink,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Layers,
  Sparkles,
} from 'lucide-react';
import { worldState } from '../components/world-state';
import LoadingScreen from '../components/LoadingScreen';

// Dynamic imports with SSR disabled for 3D and Flow Canvas
const World = dynamic(() => import('../components/World'), { ssr: false });
const Sandbox = dynamic(() => import('../components/Sandbox'), {
  ssr: false,
  loading: () => (
    <p className="mono" style={{ padding: '40px', textAlign: 'center' }}>
      Loading interactive architecture model…
    </p>
  ),
});
const ExplainerLab = dynamic(() => import('../components/ExplainerLab'), {
  ssr: false,
  loading: () => (
    <p className="mono" style={{ padding: '40px', textAlign: 'center' }}>
      Loading explainer lab simulation…
    </p>
  ),
});
const IndiaMap = dynamic(() => import('../components/IndiaMap'), {
  ssr: false,
  loading: () => (
    <p className="mono" style={{ padding: '40px', textAlign: 'center' }}>
      Loading geographic map of India…
    </p>
  ),
});

// Journey Data from Resume
const journey = [
  {
    city: 'Mysuru',
    label: 'THE ACADEMIC FOUNDATION',
    date: '2017 — 2022',
    role: 'Computer Science Scholar',
    org: 'Amrita Vishwa Vidyapeetham',
    flightNo: 'AMRITA-CS-01',
    gate: 'MYS-BLR',
    body: 'Earned BCA (2020) and MCA (2022). Built a deep algorithmic foundation in data structures, relational database engines, and authored research on eye-movement-based assistive communication systems.',
    x: 440,
    y: 1420,
  },
  {
    city: 'Bengaluru',
    label: 'ENTERPRISE BACKEND ENGINEERING',
    date: 'Jan 2022 — Nov 2024',
    role: 'Software Engineer',
    org: 'Oracle',
    flightNo: 'ORCL-PROD-24',
    gate: 'BLR-DEL',
    body: 'Developed resilient Spring Boot microservices, high-throughput REST APIs, and RBAC security. Key technical owner for AWS RDS database cluster migrations, achieving a 20% reduction in infrastructure costs and deploying Resilience4j circuit breakers.',
    x: 485,
    y: 1380,
  },
  {
    city: 'Noida & Hybrid',
    label: 'TECHNICAL BOOTCAMPS & TRAINER',
    date: 'Jan 2025 — Dec 2025',
    role: 'Technical Trainer (Freelance)',
    org: 'VTS · MyAnatomy · HitBullseye',
    flightNo: 'VTS-EDTECH-25',
    gate: 'DEL-PB',
    body: 'Delivered 250+ hours of intensive Java Full Stack bootcamps to 3,000+ engineering students at NIET Noida, Chitkara University, and Lovely Professional University (LPU). Awarded the Best Teacher Award.',
    x: 468,
    y: 535,
  },
  {
    city: 'Punjab',
    label: 'FULL-TIME TECHNICAL EDUCATOR',
    date: 'Jan 2026 — Present',
    role: 'Technical Trainer',
    org: 'Chandigarh University',
    flightNo: 'CU-TITAN-26',
    gate: 'PB-ALL',
    body: 'Delivered 200+ hours of instructor-led engineering training to 1,000+ students. Architected curricula in Spring Boot, PostgreSQL, Microservices, and live systems debugging. Honored with the Teaching Titan Award.',
    x: 412,
    y: 405,
  },
];

// Flagship Projects from Resume
const projects = [
  {
    name: 'CodeSkill',
    tag: 'SCALABLE CODING & ASSESSMENT PLATFORM',
    desc: 'Distributed code execution, real-time proctoring & 128 database shards.',
    body: 'Architected and developed a full-stack automated assessment platform designed for 1,000+ concurrent test-takers. Features timed contests, untrusted multi-language execution in isolated Docker/Piston sandboxes, 128 hash-based database partition buckets, and a multi-signal client anti-cheat system.',
    challenge:
      'Executing untrusted multi-language user code (Java, C++, Python, TS) safely without memory exhaustion, thread starvation, or cheating, while scaling past 1,000 concurrent submissions.',
    approach:
      'Decoupled submissions using NestJS and BullMQ on Redis. Docker/Piston sandboxes enforce strict cgroups memory and 2.0s CPU limits. Database partitioned into 128 hash buckets. Next.js & Socket.IO monitor tab blurs and devtools tampering.',
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'NestJS',
      'PostgreSQL (128 Shards)',
      'Redis',
      'BullMQ',
      'Docker Sandboxes',
      'Terraform',
      'AWS',
    ],
    number: '01',
    github: 'https://github.com/VenkateshW22',
  },
  {
    name: 'SyncDeck',
    tag: 'REAL-TIME VIRTUAL CLASSROOM & COLLABORATION',
    desc: 'Synchronized presentations, interactive whiteboards & WebRTC mesh.',
    body: 'A distributed real-time virtual classroom platform for synchronized presentations, interactive whiteboard sketching, live audience polling, and attendance tracking with automated AI session summaries.',
    challenge:
      'Maintaining millisecond-accurate state synchronization across hundreds of mobile and desktop participants over unstable cellular and campus Wi-Fi networks without losing canvas strokes or slide state.',
    approach:
      'Express.js and Socket.IO distribute event frames with Redis cluster pub/sub. Redis circular delta buffer guarantees instant catch-up upon client reconnection. WebRTC powers P2P screen sharing.',
    stack: ['React.js', 'Node.js', 'Express.js', 'Socket.IO', 'PostgreSQL', 'Redis', 'WebRTC', 'GCP'],
    number: '02',
    github: 'https://github.com/VenkateshW22',
  },
];

// Awards & Honors from Resume
const awards = [
  {
    icon: '🏆',
    title: 'Teaching Titan Award',
    org: 'Chandigarh University · 2026',
    desc: 'Recognized for teaching excellence and exemplary pedagogical design across 1,000+ engineering students in Spring Boot and enterprise backend architectures.',
  },
  {
    icon: '🥇',
    title: 'Best Teacher Award',
    org: 'Freelance Technical Training · 2025',
    desc: 'Awarded for delivering 250+ hours of top-rated enterprise Java Full Stack bootcamps across NIET Noida, Chitkara University, and Lovely Professional University.',
  },
  {
    icon: '⚡',
    title: 'Rockstar Award & Operational Excellence',
    org: 'Oracle · 2023',
    desc: 'Recognized at Oracle for high-availability Spring Boot microservices engineering, Circuit Breaker resilience patterns, and zero-downtime releases.',
  },
  {
    icon: '☁️',
    title: 'AWS Aurora RDS Migration Recognition',
    org: 'Oracle · 2024',
    desc: 'Owned core technical migration activities of staging and production AWS RDS database clusters, directly reducing cloud infrastructure costs by 20%.',
  },
];

// Languages Spoken (6 Indian & Global Languages)
const languages = [
  { name: 'English', greeting: 'Hello & Welcome', note: 'Global professional standard & technical training' },
  { name: 'Hindi (हिंदी)', greeting: 'नमस्ते', note: 'Widely spoken across North Indian university cohorts' },
  { name: 'Kannada (ಕನ್ನಡ)', greeting: 'ನಮಸ್ಕಾರ', note: 'Native tongue · Karnataka engineering network' },
  { name: 'Tamil (தமிழ்)', greeting: 'வணக்கம்', note: 'Fluent technical instruction & mentorship' },
  { name: 'Telugu (తెలుగు)', greeting: 'నమస్కారం', note: 'Bilingual student engagement & collaboration' },
  { name: 'Malayalam (മലയാളം)', greeting: 'നമസ്കാരം', note: 'Campus & university cohort fluency' },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [palette, setPalette] = useState(false);
  const [sound, setSound] = useState(false);
  const [dark, setDark] = useState(false);
  const [city, setCity] = useState(3); // Default to Chandigarh University
  const [projectModal, setProjectModal] = useState<number | null>(null);
  const [labModal, setLabModal] = useState<number | null>(null);
  const [webgl, setWebgl] = useState(false);
  const [compact, setCompact] = useState(false);
  const [activeLangIndex, setActiveLangIndex] = useState<number>(0);

  const reduce = useReducedMotion();
  const desk = useRef<HTMLDivElement>(null);
  const modalClose = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const [click] = useSound('/click.wav', { volume: 0.22, soundEnabled: sound });

  // Pointer velocity tracker for realistic badge throwing
  const pointerTracker = useRef({
    lastX: 0,
    lastY: 0,
    lastTime: Date.now(),
  });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      worldState.dragging = true;
      pointerTracker.current = {
        lastX: e.clientX,
        lastY: e.clientY,
        lastTime: Date.now(),
      };
      click();
    },
    [click]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = 1 - ((e.clientY - r.top) / r.height) * 2;

    const now = Date.now();
    const dt = Math.max(0.001, (now - pointerTracker.current.lastTime) / 1000);
    const vx = (e.clientX - pointerTracker.current.lastX) / dt / 500;
    const vy = (pointerTracker.current.lastY - e.clientY) / dt / 500;

    pointerTracker.current = {
      lastX: e.clientX,
      lastY: e.clientY,
      lastTime: now,
    };

    worldState.x = nx;
    worldState.y = ny;
    worldState.vx = vx;
    worldState.vy = vy;
  }, []);

  const handlePointerUp = useCallback(() => {
    worldState.dragging = false;
  }, []);

  // Initialize Lenis smooth scroll and WebGL
  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const handleResize = () => setCompact(media.matches);
    handleResize();
    media.addEventListener('change', handleResize);

    try {
      const c = document.createElement('canvas');
      setWebgl(!!(c.getContext('webgl2') || c.getContext('webgl')));
    } catch {
      setWebgl(false);
    }

    const lenis = new Lenis({
      smoothWheel: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
    lenis.on('scroll', ({ progress }: { progress: number }) => {
      worldState.progress = progress;
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPalette((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      media.removeEventListener('change', handleResize);
      lenis.destroy();
      gsap.ticker.remove(tick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Sync theme
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    worldState.theme = dark ? 'dark' : 'light';
  }, [dark]);

  // Handle modal escape & body lock
  useEffect(() => {
    if (projectModal === null && labModal === null) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modalClose.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProjectModal(null);
        setLabModal(null);
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', handleKey);
      lastFocus.current?.focus();
    };
  }, [projectModal, labModal]);

  const scrollToSection = (id: string) => {
    setPalette(false);
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth' });
  };

  return (
    <>
      <AnimatePresence>
        {loading && (
          <LoadingScreen
            onComplete={() => setLoading(false)}
            reduceMotion={!!reduce}
          />
        )}
      </AnimatePresence>

      <main>
      {/* LAYER 1: Persistent 3D World (Fixed Fullscreen Canvas) */}
      {webgl && !reduce && !compact && <World />}

      {/* LAYER 3: HUD & Header (Fixed DOM) */}
      <header className="header">
        <a href="#home" className="brand" aria-label="Venkatesh K home">
          vk<span>.</span>
        </a>
        <nav aria-label="Main Navigation">
          <a href="#work">Selected Work <span>02</span></a>
          <a href="#lab">Explainer Lab <span>04</span></a>
          <a href="#awards">Awards</a>
          <a href="#journey">Journey</a>
          <a href="#toolkit">Toolkit</a>
        </nav>
        <div className="header-actions">
          <button
            type="button"
            aria-label="Open command palette (Command + K)"
            onClick={() => setPalette(true)}
            className="command-key"
          >
            <CommandIcon size={12} /> K
          </button>
          <a className="contact-link" href="mailto:venkateshwork2212@gmail.com">
            Let’s talk <ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      {/* LAYER 2: Tactile Interactive Workbench (Scrollable DOM) */}

      {/* Scene 1: The Hero — 3D Physics + Tactile Desk */}
      <section className="hero section" id="home" ref={desk}>
        <div className="eyebrow">
          <span className="status-dot" /> ENGINEER BY CRAFT. EDUCATOR BY HEART. · OPEN TO RELOCATION
        </div>

        <h1>
          Complex systems.<br />
          <span>Human impact.</span>
        </h1>

        <p className="hero-description">
          I’m Venkatesh K. Software Engineer with enterprise backend experience at Oracle,
          and Technical Educator with 450+ hours of training delivered to 4,000+ engineering students.
          I build resilient distributed systems and teach the architecture behind them.
        </p>

        <div className="hero-actions">
          <button
            type="button"
            className="blue-button"
            onClick={() => scrollToSection('work')}
          >
            Explore selected systems <ArrowDown size={15} />
          </button>
          <a
            href="/Venkatesh_K_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Download Résumé (PDF) <ArrowUpRight size={15} />
          </a>
        </div>

        {/* Interactive Badge Touch/Mouse Grab Zone */}
        <div
          className="badge-zone"
          aria-label="Interactive swinging identity badge"
          role="img"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {(!webgl || reduce || compact) && (
            <div className="fallback-badge">
              <div>VK. // SYSTEMS & EDUCATION</div>
              <strong>VK</strong>
              <h3>Venkatesh K</h3>
              <p>SOFTWARE ENGINEER · TECHNICAL TRAINER</p>
              <span>ORACLE ALUM · 450+ HRS TAUGHT · 4K+ STUDENTS</span>
            </div>
          )}
          <span className="badge-hint">↖ grab & throw the 3D badge</span>
        </div>

        {/* Tactile Draggable Note 1 (James Chugh Style) */}
        <motion.div
          drag={!reduce}
          dragConstraints={desk}
          dragElastic={0.15}
          whileDrag={{ scale: 1.06, rotate: 0, zIndex: 35 }}
          className="sticky"
          initial={{ rotate: -5 }}
          onPointerDown={() => click()}
        >
          <span className="tape" />
          <span className="mono">NOTE TO SELF / 001</span>
          <p>
            Build things.<br />
            Teach things.<br />
            <em>Stay curious.</em>
          </p>
          <span className="sticky-foot">✳ &nbsp; always a work in progress</span>
        </motion.div>

        {/* Tactile Draggable Note 2 (Architecture Rule) */}
        <motion.div
          drag={!reduce}
          dragConstraints={desk}
          dragElastic={0.15}
          whileDrag={{ scale: 1.06, rotate: 0, zIndex: 35 }}
          className="sticky sticky-secondary"
          initial={{ rotate: 4 }}
          style={{ right: '16%', bottom: '40px', background: '#e0f2fe', color: '#0369a1' }}
          onPointerDown={() => click()}
        >
          <span className="tape" style={{ background: 'rgba(255,255,255,0.7)' }} />
          <span className="mono">SYSTEM RULE / 002</span>
          <p style={{ fontSize: '15px', fontFamily: 'monospace', lineHeight: 1.4, margin: '10px 0' }}>
            Decouple early.<br />
            Partition (128 shards).<br />
            Circuit Breaker fallback.
          </p>
          <span className="sticky-foot" style={{ color: '#0284c7' }}>
            ⚡ Oracle RDS: -20% infra cost
          </span>
        </motion.div>

        <div className="hero-bottom">
          <span className="mono">KARNATAKA, INDIA · BUILDING & TEACHING EVERYWHERE</span>
          <a href="#journey" className="scroll-label">
            SCROLL TO EXPLORE <ArrowDown size={12} />
          </a>
        </div>
      </section>

      {/* Credibility Strip */}
      <div className="credibility">
        <span className="mono">
          PROVEN IN ENTERPRISE.<br />
          SHARED IN CLASSROOMS.
        </span>
        <span className="oracle">ORACLE</span>
        <span className="university">
          CHANDIGARH<br />
          <b>UNIVERSITY</b>
        </span>
        <span className="university">
          NIET<br />
          <b>NOIDA</b>
        </span>
        <span className="university">
          CHITKARA<br />
          <b>UNIVERSITY</b>
        </span>
        <span className="lpu">
          LPU <small>Lovely Professional<br />University</small>
        </span>
        <span className="university">
          AMRITA<br />
          <b>VISHWA VIDYAPEETHAM</b>
        </span>
      </div>

      {/* Impact Metrics */}
      <div className="section" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="impact-strip">
          <div className="impact-metric">
            <strong>450<span>+</span></strong>
            <p>Hours Taught</p>
            <small>Live instructor-led bootcamps & university cohorts</small>
          </div>
          <div className="impact-metric">
            <strong>4,000<span>+</span></strong>
            <p>Engineers Mentored</p>
            <small>In Java Full Stack, Spring Boot & microservices</small>
          </div>
          <div className="impact-metric">
            <strong>20<span>%</span></strong>
            <p>RDS Cost Reduction</p>
            <small>Oracle AWS Aurora migration across staging/prod</small>
          </div>
          <div className="impact-metric">
            <strong>128</strong>
            <p>DB Sharding Buckets</p>
            <small>Partitioned for 1,000+ concurrent CodeSkill test-takers</small>
          </div>
          <div className="impact-metric">
            <strong>6</strong>
            <p>Languages Spoken</p>
            <small>Connecting authentically across diverse Indian campuses</small>
          </div>
        </div>
      </div>

      {/* Scene 3: The Interactive Architecture Box (Projects Showcase) */}
      <section className="section work" id="work">
        <div className="section-top">
          <span className="eyebrow">01 / SELECTED WORK</span>
          <span className="mono muted">TACTILE PERSPECTIVE RACK · TEST DRIVE LIVE ARCHITECTURES</span>
        </div>

        <div className="section-title">
          <h2>
            Engineered to scale.<br />
            <span>Built to matter.</span>
          </h2>
          <p>
            Real engineering problems solved with considered architectures.
            Hover for 3D tilt. Click any project to open its live interactive React Flow sandbox.
          </p>
        </div>

        <div className="project-grid">
          {projects.map((p, i) => (
            <motion.article
              key={p.name}
              className="project-card"
              whileHover={reduce ? {} : { y: -8, rotateX: 2, rotateY: i === 0 ? -2 : 2 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              onClick={() => {
                setProjectModal(i);
                click();
              }}
            >
              <div className="project-art">
                {i === 0 ? (
                  <div className="codeskill-art">
                    <div className="window-top">
                      <i /><i /><i />
                      <span>codeskill / judge-cluster</span>
                      <b>● RUNNING</b>
                    </div>
                    <div className="art-body">
                      <h4>1,000+ Concurrent Sandboxes</h4>
                      <p>BullMQ on Redis + Piston Docker Sandboxes + 128 Hash Shards</p>
                      <div className="art-tags">
                        <span>Java 21</span>
                        <span>Python</span>
                        <span>C++</span>
                        <span>Anti-Cheat AI</span>
                        <span>AWS ASG</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="syncdeck-art">
                    <div className="window-top">
                      <i /><i /><i />
                      <span>syncdeck / session-live</span>
                      <b>● LIVE WEBRTC</b>
                    </div>
                    <div className="art-body">
                      <h4>Synchronized Virtual Classroom</h4>
                      <p>Socket.IO + Redis Reconnection Buffer + Interactive Canvas</p>
                      <div className="art-tags">
                        <span>WebRTC</span>
                        <span>Redis Pub/Sub</span>
                        <span>AI Summaries</span>
                        <span>Express</span>
                      </div>
                    </div>
                  </div>
                )}
                <span className="project-open" title="Open architecture simulator">
                  <ArrowUpRight size={18} />
                </span>
              </div>

              <div className="project-info">
                <div className="project-label">
                  <span className="mono">{p.tag}</span>
                  <span className="mono">/{p.number}</span>
                </div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <div className="tags">
                  {p.stack.slice(0, 6).map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                  {p.stack.length > 6 && <span key="more">+{p.stack.length - 6} more</span>}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="work-note">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Terminal size={22} color="var(--blue)" />
            <p>
              <strong>Don’t just read the architecture.</strong> Test drive live simulated requests, anti-cheat triggers, and container scaling.
            </p>
          </div>
          <span className="mono">CLICK ANY PROJECT TO LAUNCH SANDBOX ↗</span>
        </div>
      </section>

      {/* Scene 4: The Explainer Lab (Playable Lessons) */}
      <section className="section lab" id="lab">
        <div className="section-top">
          <span className="eyebrow">02 / THE EXPLAINER LAB</span>
          <span className="mono muted">BIG ARCHITECTURAL IDEAS. PLAYABLE LESSONS.</span>
        </div>

        <div className="section-title">
          <h2>
            Make it click<span>.</span>
          </h2>
          <p>
            As an educator who has trained 4,000+ students, I believe the best way to understand complex systems is to watch them move—then experiment with them.
          </p>
        </div>

        <div className="lesson-grid">
          {[
            {
              title: '128-Bucket DB Sharding',
              subtitle: 'PostgreSQL hash partitioning without table lock contention.',
              tag: '01 / DATABASE SCALE',
              icon: '▥',
            },
            {
              title: 'Resilience4j Circuit Breaker',
              subtitle: 'Preventing cascading thread starvation at Oracle.',
              tag: '02 / FAULT TOLERANCE',
              icon: '🛡️',
            },
            {
              title: 'BullMQ Isolated Sandboxes',
              subtitle: 'Safely evaluating untrusted code inside Docker containers.',
              tag: '03 / ASYNC QUEUES',
              icon: '⚙️',
            },
            {
              title: 'WebSocket Reconnection Buffer',
              subtitle: 'Guaranteed zero state desync during student Wi-Fi drops.',
              tag: '04 / REAL-TIME COLLAB',
              icon: '⚡',
            },
          ].map((l, i) => (
            <motion.button
              key={l.title}
              type="button"
              className="lesson-card"
              whileHover={{ y: -6 }}
              onClick={() => {
                setLabModal(i);
                click();
              }}
            >
              <div className="lesson-art">
                <span style={{ fontSize: '42px' }}>{l.icon}</span>
                <span className="play-icon">
                  <Play size={13} fill="currentColor" />
                </span>
              </div>
              <span className="mono muted">{l.tag}</span>
              <h3>
                {l.title} <ArrowUpRight size={16} />
              </h3>
              <p>{l.subtitle}</p>
            </motion.button>
          ))}
        </div>

        <p className="lab-note mono">4 INTERACTIVE MICRO-LESSONS · CLICK ANY TO PLAY SIMULATION</p>
      </section>

      {/* Awards & Recognition */}
      <section className="section awards" id="awards">
        <div className="section-top">
          <span className="eyebrow">03 / AWARDS & RECOGNITION</span>
          <span className="mono muted">VALIDATED EXCELLENCE IN INDUSTRY & ACADEMIA</span>
        </div>

        <div className="section-title">
          <h2>
            Honors for code.<br />
            <span>Passion for teaching.</span>
          </h2>
          <p>
            Recognized both for mission-critical enterprise engineering at Oracle and outstanding pedagogical impact in higher education.
          </p>
        </div>

        <div className="awards-grid">
          {awards.map((a) => (
            <div key={a.title} className="award-card">
              <span className="award-badge-icon">{a.icon}</span>
              <h3>{a.title}</h3>
              <strong>{a.org}</strong>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Multilingual Polyglot Section */}
      <section className="section languages-section">
        <div className="section-top">
          <span className="eyebrow">04 / MULTILINGUAL PEDAGOGY</span>
          <span className="mono muted">6 LANGUAGES · ZERO BARRIERS</span>
        </div>

        <div className="section-title">
          <h2>
            Speaking the language<br />
            <span>of every student.</span>
          </h2>
          <p>
            Mentoring students from across India requires more than technical mastery—it demands cultural connection. Click each language to hear how I connect with diverse cohorts:
          </p>
        </div>

        <div className="languages-grid">
          {languages.map((l, i) => (
            <button
              key={l.name}
              type="button"
              className={`lang-card ${activeLangIndex === i ? 'active' : ''}`}
              onClick={() => {
                setActiveLangIndex(i);
                click();
              }}
            >
              <span className="lang-name">{l.name}</span>
              <span className="lang-greeting">{l.greeting}</span>
              <p className="lang-note">{l.note}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Scene 2: The "Scroll to Fly-In" Journey Map (James Chugh Boarding Pass) */}
      <section className="section journey" id="journey">
        <div className="section-top">
          <span className="eyebrow">05 / THE JOURNEY</span>
          <span className="mono muted">MY ROAD FROM MYSURU TO ORACLE & UNIVERSITY CAMPUSES</span>
        </div>

        <div className="section-title">
          <h2>
            Code travels.<br />
            <span>So do I.</span>
          </h2>
          <p>
            From Amrita University to Oracle backend systems, then on-campus bootcamps across North India and Chandigarh University.
          </p>
        </div>

        <div className="journey-layout">
          <div className="map">
            <div className="map-grid" />
            <IndiaMap
              activeCity={city}
              onSelectCity={(idx) => {
                setCity(idx);
                click();
              }}
              milestones={journey}
            />
            <span className="map-caption mono">GEOGRAPHIC MAP OF INDIA · CLICK ANY PIN TO INSPECT</span>
          </div>

          {/* James Chugh Style Boarding Pass */}
          <AnimatePresence mode="wait">
            <motion.article
              key={city}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="boarding-pass"
            >
              <div className="pass-head">
                <div>
                  <span className="mono" style={{ fontSize: '9px', color: 'var(--blue)' }}>
                    BOARDING PASS · {journey[city].flightNo}
                  </span>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'baseline', marginTop: '4px' }}>
                    <span className="mono" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      GATE: {journey[city].gate}
                    </span>
                    <span className="mono muted" style={{ fontSize: '11px' }}>
                      SEAT: 0{city + 1}A
                    </span>
                  </div>
                </div>
                <MoveUpRight size={24} color="var(--blue)" />
              </div>

              <span className="eyebrow">{journey[city].date}</span>
              <h3>{journey[city].role}</h3>
              <strong>{journey[city].org}</strong>
              <p>{journey[city].body}</p>

              <div className="pass-footer">
                <div>
                  <span className="mono" style={{ display: 'block', fontSize: '9px', color: 'var(--muted)' }}>
                    CREDENTIAL TYPE
                  </span>
                  <span className="mono" style={{ fontWeight: 'bold', fontSize: '11px' }}>
                    {journey[city].label}
                  </span>
                </div>
                <span className="barcode">▎▌▏▎▍▏▌▎▌▏▍▎</span>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </section>

      {/* Technical Toolkit */}
      <section className="section toolkit" id="toolkit">
        <div className="section-top">
          <span className="eyebrow">06 / TOOLS OF THE TRADE</span>
          <span className="mono muted">ENTERPRISE STACK & PRODUCTION INFRASTRUCTURE</span>
        </div>

        <div className="section-title">
          <h2>
            Good tools.<br />
            <span>Disciplined craft.</span>
          </h2>
          <p>
            Technologies I have built high-scale systems with in industry and trained thousands of engineers to master.
          </p>
        </div>

        <div className="tool-rows">
          <div className="tool-group">
            <span className="mono">CORE LANGUAGES</span>
            <h3>Languages</h3>
            <p>Java (Core & Enterprise), TypeScript, JavaScript, SQL, Python</p>
          </div>

          <div className="tool-group">
            <span className="mono">BACKEND & MICROSERVICES</span>
            <h3>Backend Architecture</h3>
            <p>
              Spring Boot, NestJS, Node.js, Express.js, Microservices, REST APIs, BullMQ, Socket.IO, WebRTC, Spring
              Data JPA, Hibernate ORM
            </p>
          </div>

          <div className="tool-group">
            <span className="mono">DATA & SHARDING</span>
            <h3>Databases & Scaling</h3>
            <p>PostgreSQL (Sharding & Partitioning), Redis, MySQL, MongoDB, Query Optimization, Database Indexing</p>
          </div>

          <div className="tool-group">
            <span className="mono">CLOUD & INFRASTRUCTURE</span>
            <h3>Cloud & DevOps</h3>
            <p>
              AWS (ALB, ASG, RDS Aurora, ElastiCache, S3), GCP, Terraform IaC, Docker Sandboxes, Kubernetes, Jenkins,
              GitHub Actions CI/CD
            </p>
          </div>

          <div className="tool-group">
            <span className="mono">SECURITY & RESILIENCE</span>
            <h3>Fault Tolerance</h3>
            <p>JWT, OAuth2, Role-Based Access Control (RBAC), Resilience4j Circuit Breaker, Sandboxed Execution</p>
          </div>

          <div className="tool-group">
            <span className="mono">TESTING & OBSERVABILITY</span>
            <h3>Quality & Telemetry</h3>
            <p>JUnit, Mockito, Maven, SLF4J, New Relic, Splunk, Prometheus, Grafana, Next.js, React.js, Tailwind CSS</p>
          </div>
        </div>

        {/* Education Highlight */}
        <div
          style={{
            marginTop: '50px',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: '12px',
            padding: '30px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <GraduationCap size={24} color="var(--blue)" />
            <span className="mono" style={{ fontSize: '12px', fontWeight: 'bold' }}>
              EDUCATION & DEGREES
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <strong style={{ fontSize: '16px', display: 'block', color: 'var(--ink)' }}>
                Master of Computer Applications (MCA)
              </strong>
              <span style={{ fontSize: '13px', color: 'var(--blue)' }}>
                Amrita Vishwa Vidyapeetham · 2020 – 2022
              </span>
            </div>
            <div>
              <strong style={{ fontSize: '16px', display: 'block', color: 'var(--ink)' }}>
                Bachelor of Computer Applications (BCA)
              </strong>
              <span style={{ fontSize: '13px', color: 'var(--blue)' }}>
                Amrita Vishwa Vidyapeetham · 2017 – 2020
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer className="section footer" id="contact">
        <span className="eyebrow">HAVE A SYSTEM TO SCALE OR A COHORT TO ELEVATE?</span>
        <h2>
          Let’s build<br />
          something <em>meaningful.</em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
          <a className="email-link" href="mailto:venkateshwork2212@gmail.com">
            <Mail size={28} /> venkateshwork2212@gmail.com <ArrowUpRight size={26} />
          </a>
          <div
            style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              color: 'var(--muted)',
              fontSize: '14px',
              marginTop: '6px',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={15} /> +91-8660216971
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} /> Karnataka, India (Open to Relocation)
            </span>
          </div>
        </div>

        <div className="footer-bottom">
          <a className="brand" href="#home">
            vk<span>.</span>
          </a>
          <span className="mono">HYBRID SPATIAL CANVAS · BUILT WITH NEXT.JS 15 + R3F + FRAMER</span>
          <div className="footer-socials">
            <a href="https://github.com/VenkateshW22" target="_blank" rel="noreferrer">
              <Github size={15} /> GitHub
            </a>
            <a href="https://linkedin.com/in/venkatesh-k" target="_blank" rel="noreferrer">
              <Linkedin size={15} /> LinkedIn
            </a>
            <a href="/Venkatesh_K_Resume.pdf" target="_blank" rel="noreferrer">
              <ExternalLink size={15} /> Résumé
            </a>
          </div>
        </div>
      </footer>

      {/* LAYER 3: Global HUD Controls Pill */}
      <div className="global-controls">
        <span className="status-dot" />
        <span className="mono">HYBRID SPATIAL</span>
        <span className="control-separator" />
        <button
          type="button"
          aria-label={sound ? 'Mute interaction sounds' : 'Enable interaction sounds'}
          onClick={() => setSound(!sound)}
        >
          {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
        <button
          type="button"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => {
            setDark(!dark);
            click();
          }}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Command Palette (cmdk) */}
      <Command.Dialog
        open={palette}
        onOpenChange={setPalette}
        label="Explore Venkatesh's Portfolio"
        className="command-dialog"
      >
        <Command.Input placeholder="Search projects, skills, or jump to section…" />
        <Command.List>
          <Command.Empty>No matches found.</Command.Empty>
          {[
            ['CodeSkill (1,000+ Concurrent Sandbox)', () => { setPalette(false); setProjectModal(0); }],
            ['SyncDeck (Real-time Virtual Classroom)', () => { setPalette(false); setProjectModal(1); }],
            ['Explainer Lab: 128-Shard Partitioning', () => { setPalette(false); setLabModal(0); }],
            ['Explainer Lab: Resilience4j Circuit Breaker', () => { setPalette(false); setLabModal(1); }],
            ['Explainer Lab: BullMQ Sandboxed Code Judge', () => { setPalette(false); setLabModal(2); }],
            ['Explainer Lab: WebSocket Reconnection Sync', () => { setPalette(false); setLabModal(3); }],
            ['View Awards & Recognition', () => scrollToSection('awards')],
            ['Career Journey Map', () => scrollToSection('journey')],
            ['Tools of the Trade (Skills)', () => scrollToSection('toolkit')],
            ['Get in Touch (Contact)', () => scrollToSection('contact')],
          ].map(([label, action], idx) => (
            <Command.Item key={idx} onSelect={action as () => void}>
              {label as string}
              <ArrowUpRight size={15} />
            </Command.Item>
          ))}
          <Command.Item onSelect={() => window.open('/Venkatesh_K_Resume.pdf', '_blank')}>
            Download Résumé (PDF) <ArrowUpRight size={15} />
          </Command.Item>
        </Command.List>
        <small>↑ ↓ to navigate &nbsp;·&nbsp; ↵ to select &nbsp;·&nbsp; esc to close</small>
      </Command.Dialog>

      {/* Project Modal with Live Architecture Sandbox */}
      <AnimatePresence>
        {projectModal !== null && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setProjectModal(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              className="modal"
              initial={{ y: 30, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={modalClose}
                className="close-modal"
                aria-label="Close dialog"
                onClick={() => setProjectModal(null)}
              >
                <X size={18} />
              </button>

              <span className="eyebrow">
                PROJECT {projects[projectModal].number} · ARCHITECTURE SIMULATOR
              </span>
              <h2 id="modal-title">{projects[projectModal].name}</h2>
              <p className="modal-desc">{projects[projectModal].body}</p>

              {/* Interactive Sandbox Model */}
              <Sandbox project={projects[projectModal].name} />

              <div className="case-details">
                <div>
                  <h4>The Architectural Challenge</h4>
                  <p>{projects[projectModal].challenge}</p>
                </div>
                <div>
                  <h4>Engineering Strategy & Solution</h4>
                  <p>{projects[projectModal].approach}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explainer Lab Modal */}
      <AnimatePresence>
        {labModal !== null && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLabModal(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="lab-modal-title"
              className="modal"
              initial={{ y: 30, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={modalClose}
                className="close-modal"
                aria-label="Close dialog"
                onClick={() => setLabModal(null)}
              >
                <X size={18} />
              </button>

              <span className="eyebrow">THE EXPLAINER LAB · PLAYABLE ARCHITECTURE LESSON</span>
              <h2 id="lab-modal-title">Interactive Systems Lab</h2>

              <ExplainerLab initialLesson={labModal} onSound={click} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  </>
  );
}
