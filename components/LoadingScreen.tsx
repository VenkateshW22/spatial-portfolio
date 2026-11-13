'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Terminal,
  Cpu,
  Activity,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
} from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
  reduceMotion?: boolean;
}

interface LogEntry {
  id: string;
  threshold: number;
  time: string;
  tag: string;
  text: string;
}

const SYSTEM_LOGS: LogEntry[] = [
  {
    id: 'l1',
    threshold: 12,
    time: '0.12s',
    tag: 'AURORA_RDS',
    text: 'Mounted AWS Aurora PostgreSQL cluster (-20% cost optimization)',
  },
  {
    id: 'l2',
    threshold: 32,
    time: '0.34s',
    tag: 'SHARD_ENGINE',
    text: '128-bucket hash partitioning verified · CRC32 distribution active',
  },
  {
    id: 'l3',
    threshold: 54,
    time: '0.62s',
    tag: 'EXEC_SANDBOX',
    text: 'Pre-warming Docker & Piston runners for 1,000+ concurrent test-takers',
  },
  {
    id: 'l4',
    threshold: 74,
    time: '0.88s',
    tag: 'GEO_VECTOR',
    text: 'Calibrated geographical route (Mysuru → Bengaluru → Noida → Punjab)',
  },
  {
    id: 'l5',
    threshold: 90,
    time: '1.12s',
    tag: 'PHYSICS_3D',
    text: 'Three.js / Rapier rigid-body lanyard badge & spline camera aligned',
  },
  {
    id: 'l6',
    threshold: 99,
    time: '1.38s',
    tag: 'SPATIAL_HUD',
    text: 'All 6 polyglot matrices & tactile spring physics ready for interaction',
  },
];

export default function LoadingScreen({ onComplete, reduceMotion = false }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isTurbo, setIsTurbo] = useState(false);
  const [rpm, setRpm] = useState(1420);
  const completedRef = useRef(false);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setProgress(100);
    setTimeout(() => {
      onComplete();
    }, 450);
  }, [onComplete]);

  // Lock body scroll while loader is visible
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Live fluctuating RPM meter
  useEffect(() => {
    const rpmInterval = setInterval(() => {
      if (isTurbo) {
        setRpm(3800 + Math.floor(Math.random() * 240));
      } else {
        setRpm(1410 + Math.floor(Math.random() * 35));
      }
    }, 120);

    return () => clearInterval(rpmInterval);
  }, [isTurbo]);

  // Smooth realistic boot progress sequence
  useEffect(() => {
    if (reduceMotion) {
      finish();
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          finish();
          return 100;
        }
        // Turbo speed increments at 3.5x rate
        const increment = isTurbo ? Math.random() * 6 + 3.8 : Math.random() * 2.2 + 1.2;
        const next = Math.min(100, prev + increment);
        if (next >= 100) {
          clearInterval(interval);
          finish();
          return 100;
        }
        return next;
      });
    }, isTurbo ? 28 : 50);

    // Keyboard shortcuts: Space toggles turbo; Enter or Esc skips
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setIsTurbo((t) => !t);
      } else if (e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [finish, isTurbo, reduceMotion]);

  // Computed power wattage output based on progress & turbo
  const currentWatts = Math.floor(progress * 3.8 + (isTurbo ? 520 : 140));

  // Filter logs that have been reached by current progress
  const unlockedLogs = SYSTEM_LOGS.filter((l) => progress >= l.threshold);
  const latestLog = unlockedLogs[unlockedLogs.length - 1] || SYSTEM_LOGS[0];

  return (
    <motion.div
      className="elite-loader-backdrop"
      role="status"
      aria-live="polite"
      aria-label="Portfolio initializing"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.03,
        filter: 'blur(12px)',
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
      }}
    >
      {/* Background Spatial Atmosphere */}
      <div className="elite-loader-grid" aria-hidden="true" />
      <div className={`elite-loader-radial-aura ${isTurbo ? 'turbo' : ''}`} aria-hidden="true" />

      {/* Screen HUD Brackets (Top Left / Right / Bottom) */}
      <div className="elite-hud-bracket top-left" aria-hidden="true">
        <span className="bracket-mark">┌</span>
        <span className="mono">SYS.BOOT // ARCHITECTURE_V2.4</span>
      </div>

      <div className="elite-hud-bracket top-right" aria-hidden="true">
        <span className="mono">HOST: VENKATESH_K // IST (UTC+5:30)</span>
        <span className="bracket-mark">┐</span>
      </div>

      <div className="elite-hud-bracket bottom-left" aria-hidden="true">
        <span className="bracket-mark">└</span>
        <span className="mono">ORACLE ALUM · 450+ HRS TAUGHT · 4K+ STUDENTS</span>
      </div>

      <div className="elite-hud-bracket bottom-right" aria-hidden="true">
        <button
          type="button"
          onClick={finish}
          className="elite-quick-skip mono"
          aria-label="Skip initialization and enter portfolio immediately"
        >
          <span>SKIP BOOT</span>
          <kbd>↵ ENTER</kbd>
        </button>
        <span className="bracket-mark">┘</span>
      </div>

      {/* Central Interactive Turbine Stage */}
      <div className="elite-loader-container">
        {/* Top Header Tag */}
        <div className="elite-turbine-pill">
          <span className="elite-pulse-dot" />
          <span className="mono text-semibold">HAMSTER KINEMATIC GENERATOR · M2 DUAL-CORE</span>
          <span className="elite-pill-divider">/</span>
          <span className={`elite-turbo-badge mono ${isTurbo ? 'active' : ''}`}>
            {isTurbo ? (
              <>
                <Flame size={12} className="animate-bounce" /> 3.5x OVERCLOCKED
              </>
            ) : (
              '1.0x NOMINAL'
            )}
          </span>
        </div>

        {/* Central Dyno Reactor Module */}
        <div className="elite-reactor-assembly">
          {/* Left Power Conduit */}
          <div className="elite-conduit left">
            <span className="conduit-label mono">COMPUTE BUS</span>
            <div className="conduit-line">
              <span className={`conduit-pulse ${isTurbo ? 'turbo' : ''}`} />
            </div>
            <span className="conduit-val mono">{isTurbo ? '3.8 GHz' : '1.8 GHz'}</span>
          </div>

          {/* Center Hamster Wheel in Rotating Tech Halo */}
          <div className="elite-wheel-stage">
            {/* Concentric Rotating Calibration Dials */}
            <div className={`elite-compass-ring outer ${isTurbo ? 'turbo' : ''}`} aria-hidden="true" />
            <div className={`elite-compass-ring inner ${isTurbo ? 'turbo' : ''}`} aria-hidden="true" />

            {/* The Animated Hamster in the Wheel (from Uiverse.io by Nawsome) */}
            <div
              className={`wheel-and-hamster ${isTurbo ? 'turbo' : ''}`}
              role="img"
              aria-label="Orange and tan hamster running in a metal wheel powering the portfolio runtime"
              onClick={() => setIsTurbo((t) => !t)}
              onMouseEnter={() => setIsTurbo(true)}
              onMouseLeave={() => setIsTurbo(false)}
              onTouchStart={() => setIsTurbo((t) => !t)}
              title="Click or press Spacebar to toggle Overclock mode!"
            >
              <div className="wheel" />
              <div className="hamster">
                <div className="hamster__body">
                  <div className="hamster__head">
                    <div className="hamster__ear" />
                    <div className="hamster__eye" />
                    <div className="hamster__nose" />
                  </div>
                  <div className="hamster__limb hamster__limb--fr" />
                  <div className="hamster__limb hamster__limb--fl" />
                  <div className="hamster__limb hamster__limb--br" />
                  <div className="hamster__limb hamster__limb--bl" />
                  <div className="hamster__tail" />
                </div>
              </div>
              <div className="spoke" />
            </div>

            {/* Reactor Industrial Base Stand */}
            <div className="elite-reactor-base" aria-hidden="true">
              <div className="reactor-base-grill" />
            </div>
          </div>

          {/* Right Power Conduit */}
          <div className="elite-conduit right">
            <span className="conduit-label mono">RENDER PIPELINE</span>
            <div className="conduit-line">
              <span className={`conduit-pulse ${isTurbo ? 'turbo' : ''}`} />
            </div>
            <span className="conduit-val mono">60 FPS WEBGL2</span>
          </div>
        </div>

        {/* Tactile Live Telemetry Gauges (3-Column Matrix) */}
        <div className="elite-telemetry-grid">
          <div className="elite-telemetry-card">
            <div className="telemetry-header mono">
              <Activity size={13} className="text-blue-500" />
              <span>TURBINE FREQUENCY</span>
            </div>
            <div className="telemetry-value mono">
              <span>{rpm.toLocaleString()}</span>
              <span className="telemetry-unit">RPM</span>
            </div>
          </div>

          <div className="elite-telemetry-card highlight">
            <div className="telemetry-header mono">
              <Zap size={13} className="text-amber-500" />
              <span>KINETIC HARVEST</span>
            </div>
            <div className="telemetry-value mono text-amber-500">
              <span>{currentWatts}</span>
              <span className="telemetry-unit">WATTS</span>
            </div>
          </div>

          <div className="elite-telemetry-card">
            <div className="telemetry-header mono">
              <Cpu size={13} className="text-emerald-500" />
              <span>SYSTEM ALLOCATION</span>
            </div>
            <div className="telemetry-value mono">
              <span>128 / 128</span>
              <span className="telemetry-unit">SHARDS</span>
            </div>
          </div>
        </div>

        {/* Dynamic Progress Engine (Massive Typography & Segmented Bar) */}
        <div className="elite-progress-section">
          <div className="elite-progress-head">
            <div className="elite-status-ticker mono">
              <span className="ticker-badge">LIVE LOG</span>
              <span className="ticker-text truncate">
                <span className="ticker-tag">[{latestLog.tag}]</span> {latestLog.text}
              </span>
            </div>

            <div className="elite-large-counter mono">
              <span className="counter-number">{Math.floor(progress).toString().padStart(2, '0')}</span>
              <span className="counter-pct">%</span>
            </div>
          </div>

          {/* Segmented Neon Progress Track */}
          <div className="elite-progress-track">
            <div
              className={`elite-progress-fill ${isTurbo ? 'turbo' : ''}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Multi-Row Boot Terminal Console */}
        <div className="elite-terminal-console" aria-hidden="true">
          <div className="terminal-topbar mono">
            <Terminal size={12} className="text-blue-500" />
            <span>INITIALIZATION FEED (LATEST EVENTS)</span>
            <span className="ml-auto text-xs text-muted">
              {progress >= 100 ? 'STATUS: NOMINAL' : 'INITIALIZING ARCHITECTURE'}
            </span>
          </div>

          <div className="terminal-feed mono">
            {SYSTEM_LOGS.slice(0, Math.max(1, unlockedLogs.length)).slice(-3).map((log) => (
              <div key={log.id} className="terminal-row">
                <span className="terminal-bullet">✓</span>
                <span className="terminal-time">[{log.time}]</span>
                <span className="terminal-tag">{log.tag}</span>
                <span className="terminal-desc truncate">{log.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Overclock Action Pill & Tip */}
        <div className="elite-interaction-bar mono">
          <button
            type="button"
            onClick={() => setIsTurbo((t) => !t)}
            className={`elite-overclock-btn ${isTurbo ? 'active' : ''}`}
          >
            <Zap size={13} />
            <span>{isTurbo ? 'OVERCLOCK ACTIVE (CLICK TO SLOW)' : 'OVERCLOCK GENERATOR (SPACE / CLICK)'}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
