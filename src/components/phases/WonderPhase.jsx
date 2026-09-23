// src/components/phases/WonderPhase.jsx
// Phase 1: Wonder — The Mystery of the Damaged Mosaic Panel

import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['🧩', '🔷', '🔶', '🔺', '🟩', '🌀', '🪞', '✨', '📐', '🎨'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    const segs = wonderNarration();
    narrate(segs);
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  return (
    <div className="wonder-wrap">
      {/* Floating particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 9.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.6}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main hook card */}
        <div className="wonder-card glass-card">
          <div className="wonder-stadium-icon" aria-hidden="true">
            🏛️
          </div>
          <h1 className="wonder-title headline">The Grand Tile Mystery!</h1>

          <div className="wonder-number-display">
            <span className="number-display wonder-num">
              🔺 ➔ 90° CW ➔ 180° Half-Turn ➔ 🪞 Mirrored ➔ Missing Tile?
            </span>
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              The workshop's oldest mosaic panel is <strong className="wonder-em">missing three crucial tiles</strong>—but the surrounding pattern gives you everything you need to know exactly what they should look like.
            </p>
            <p className="body-text wonder-q">
              Can you <span className="wonder-highlight">spot the transformation rule</span> and restore the ancient masterpiece?
            </p>
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot mood="curious" message="Every motif tells a story! Let's decode how patterns rotate, reflect, and grow!" size="sm" />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Enter the Workshop 🔍
          </button>
        </div>
      </div>
    </div>
  );
}
