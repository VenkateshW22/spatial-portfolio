'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Zap, Terminal, Sparkles, FastForward } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
  reduceMotion?: boolean;
}

const BOOT_STEPS = [
  { threshold: 0, text: 'SYS.INIT // Booting 3D WebGL physics & spline camera...' },
  { threshold: 22, text: 'DATABASE // Allocating 128-bucket PostgreSQL sharding topology...' },
  { threshold: 44, text: 'SANDBOX // Pre-warming Docker & Piston code execution runners...' },
  { threshold: 68, text: 'GEOMAP // Calibrating official Indian geographic boundary...' },
  { threshold: 88, text: 'HUD_BUS // Synchronizing tactile spring physics & audio bus...' },
  { threshold: 98, text: 'READY // All nodes nominal. Powering up spatial canvas...' },
];

export default function LoadingScreen({ onComplete, reduceMotion = false }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isTurbo, setIsTurbo] = useState(false);
  const completedRef = useRef(false);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setProgress(100);
    setTimeout(() => {
      onComplete();
    }, 350);
  }, [onComplete]);

  // Lock body scroll while loader is visible
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

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
        // Turbo speed increments faster if user is hovering/interacting with the hamster
        const increment = isTurbo ? Math.random() * 8 + 4 : Math.random() * 3 + 1.8;
        const next = Math.min(100, prev + increment);
        if (next >= 100) {
          clearInterval(interval);
          finish();
          return 100;
        }
        return next;
      });
    }, isTurbo ? 25 : 45);

    // Keyboard shortcut: Press Enter, Space, or Escape to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
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

  // Find the active boot message based on current progress
  const currentStep = [...BOOT_STEPS].reverse().find((s) => progress >= s.threshold)?.text || BOOT_STEPS[0].text;

  return (
    <motion.aside
      className="hamster-loader-overlay"
      role="status"
      aria-live="polite"
      aria-label="Portfolio initializing"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="hamster-loader-grid" aria-hidden="true" />
      <div className="hamster-loader-glow" aria-hidden="true" />

      <div className="hamster-loader-card">
        {/* Top Header Tag */}
        <div className="hamster-loader-badge">
          <span className="hamster-status-light" />
          <span className="mono">VK.SYS // KINEMATIC_TURBINE_V1</span>
          <span className="hamster-speed-pill mono">
            {isTurbo ? (
              <>
                <Zap size={11} className="text-amber-500 animate-pulse" /> 2.5x TURBO
              </>
            ) : (
              '1,420 RPM'
            )}
          </span>
        </div>

        {/* The Animated Hamster in the Wheel (from Uiverse.io by Nawsome) */}
        <div
          className={`wheel-and-hamster ${isTurbo ? 'turbo' : ''}`}
          role="img"
          aria-label="Orange and tan hamster running in a metal wheel powering portfolio systems"
          onMouseEnter={() => setIsTurbo(true)}
          onMouseLeave={() => setIsTurbo(false)}
          onTouchStart={() => setIsTurbo(true)}
          onTouchEnd={() => setIsTurbo(false)}
          title="Click or hover to turbo-charge!"
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

        {/* Playful Interactive Hint */}
        <div className="hamster-hint mono">
          <Sparkles size={12} />
          <span>{isTurbo ? 'TURBO BOOST ENGAGED!' : 'Hover or tap hamster to boost turbine'}</span>
        </div>

        {/* High-Tech Progress Bar */}
        <div className="hamster-progress-wrapper">
          <div className="hamster-progress-meta">
            <span className="mono hamster-pct">{Math.floor(progress).toString().padStart(2, '0')}%</span>
            <span className="mono hamster-status">
              {progress >= 100 ? 'INITIALIZATION COMPLETE' : 'GENERATING SYSTEM POWER'}
            </span>
          </div>

          <div className="hamster-progress-track">
            <div
              className="hamster-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dynamic Telemetry Terminal Ticker */}
        <div className="hamster-telemetry mono">
          <Terminal size={13} className="text-blue-500 shrink-0" />
          <span className="truncate">{currentStep}</span>
        </div>

        {/* Skip Button */}
        <button
          type="button"
          onClick={finish}
          className="hamster-skip-btn mono"
          aria-label="Skip loading animation and enter portfolio"
        >
          <span>Skip boot</span>
          <kbd className="hamster-kbd">↵</kbd>
        </button>
      </div>
    </motion.aside>
  );
}
