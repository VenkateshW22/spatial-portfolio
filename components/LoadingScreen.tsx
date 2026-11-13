'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
  reduceMotion?: boolean;
}

export default function LoadingScreen({ onComplete, reduceMotion = false }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const completedRef = useRef(false);

  const finish = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setProgress(100);
    setTimeout(() => {
      onComplete();
    }, 280);
  }, [onComplete]);

  // Lock body scroll while loader is visible
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Smooth, fast, non-blocking progress (completes in ~1.2 seconds)
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
        const increment = Math.random() * 4.5 + 2.5;
        const next = Math.min(100, prev + increment);
        if (next >= 100) {
          clearInterval(interval);
          finish();
          return 100;
        }
        return next;
      });
    }, 40);

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
  }, [finish, reduceMotion]);

  return (
    <motion.aside
      className="minimal-loader-backdrop"
      role="status"
      aria-live="polite"
      aria-label="Portfolio initializing"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        filter: 'blur(6px)',
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      }}
      onClick={finish}
      title="Click or press Enter to skip"
    >
      <div className="minimal-loader-content">
        {/* The Animated Hamster in the Wheel (from Uiverse.io by Nawsome) */}
        <div
          className="wheel-and-hamster"
          role="img"
          aria-label="Orange and tan hamster running in a metal wheel"
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

        {/* Minimalist Hairline Progress Bar */}
        <div className="minimal-loader-track" aria-hidden="true">
          <div
            className="minimal-loader-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Quiet Minimalist Typography with Unified Brand Logo */}
        <div className="minimal-loader-meta">
          <span className="brand minimal-loader-brand" aria-label="Venkatesh K">
            vk<span>.</span>
          </span>
          <span className="minimal-loader-sep">/</span>
          <span className="minimal-loader-pct mono">{Math.floor(progress).toString().padStart(2, '0')}%</span>
        </div>
      </div>
    </motion.aside>
  );
}
