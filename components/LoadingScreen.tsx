'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
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
    }, 320);
  }, [onComplete]);

  // Lock body scroll while loader is visible
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Smooth realistic progress progression to 100%
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
        // Smooth organic increments (~1.4s total load duration)
        const increment = Math.random() * 3.6 + 2.2;
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

  // Cubic bezier sine wave generator for seamless horizontal animation
  const { frontWavePath, backWavePath } = useMemo(() => {
    function makeSineWave(wavelength: number, amplitude: number, totalWidth: number, bottomY: number) {
      let d = 'M 0 0';
      const numCycles = Math.ceil(totalWidth / wavelength);
      for (let i = 0; i < numCycles; i++) {
        const x0 = i * wavelength;
        const cp1x = (x0 + wavelength * 0.18).toFixed(1);
        const cp1y = (-amplitude).toFixed(1);
        const cp2x = (x0 + wavelength * 0.32).toFixed(1);
        const cp2y = (-amplitude).toFixed(1);
        const midX = (x0 + wavelength * 0.5).toFixed(1);

        const cp3x = (x0 + wavelength * 0.68).toFixed(1);
        const cp3y = amplitude.toFixed(1);
        const cp4x = (x0 + wavelength * 0.82).toFixed(1);
        const cp4y = amplitude.toFixed(1);
        const endX = ((i + 1) * wavelength).toFixed(1);

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${midX} 0`;
        d += ` C ${cp3x} ${cp3y}, ${cp4x} ${cp4y}, ${endX} 0`;
      }
      d += ` V ${bottomY} H 0 Z`;
      return d;
    }

    // Front wave: 300px wavelength, 18px amplitude, spans 2700px
    const front = makeSineWave(300, 18, 2700, 600);
    // Back wave: 360px wavelength, 14px amplitude, spans 2880px
    const back = makeSineWave(360, 14, 2880, 600);
    return { frontWavePath: front, backWavePath: back };
  }, []);

  // Vertical water rise from below the text (275) to fully submerging the text (85)
  const waterY = 275 - (progress / 100) * 190;
  const pctInt = Math.floor(progress);

  return (
    <motion.aside
      className="neoleaf-loader-backdrop"
      role="status"
      aria-live="polite"
      aria-label="Venkatesh K portfolio loading"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        filter: 'blur(8px)',
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
      }}
      onClick={finish}
      title="Click or press Enter to skip"
    >
      <div className="neoleaf-loader-box">
        <svg
          viewBox="0 0 1200 360"
          className="neoleaf-svg"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="neoleaf-text-clip" clipPathUnits="userSpaceOnUse">
              <text
                x="600"
                y="180"
                textAnchor="middle"
                dominantBaseline="central"
                className="neoleaf-svg-text"
              >
                Venkatesh K
              </text>
            </clipPath>
          </defs>

          {/* 1. Base / Unfilled Dim Text */}
          <text
            x="600"
            y="180"
            textAnchor="middle"
            dominantBaseline="central"
            className="neoleaf-svg-text neoleaf-text-base"
          >
            Venkatesh K
          </text>

          {/* 2. Liquid Waves Clipped into Text Outline */}
          <g clipPath="url(#neoleaf-text-clip)">
            {/* Back Wave (translucent depth layer) */}
            <g
              transform={`translate(0, ${waterY - 7})`}
              style={{ transition: 'transform 0.08s ease-out' }}
            >
              <path
                className="neoleaf-wave-back"
                d={backWavePath}
                fill="rgba(255, 255, 255, 0.38)"
              />
            </g>

            {/* Front Wave (solid bright white fill) */}
            <g
              transform={`translate(0, ${waterY})`}
              style={{ transition: 'transform 0.08s ease-out' }}
            >
              <path
                className="neoleaf-wave-front"
                d={frontWavePath}
                fill="#ffffff"
              />
            </g>
          </g>
        </svg>

        {/* Bottom Right Counter: matching inspiration layout `loading... 57 %` */}
        <div className="neoleaf-meta-row">
          <span className="neoleaf-counter mono">
            loading... {pctInt} %
          </span>
        </div>
      </div>
    </motion.aside>
  );
}
