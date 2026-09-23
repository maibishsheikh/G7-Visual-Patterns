// src/components/shared/FloatingNumbers.jsx
// Floating ambient mosaic tiles and geometric motifs for atmospheric background

import React from 'react';
import './FloatingNumbers.css';

const SYMBOLS = ['🔷', '🔶', '🔺', '🟩', '🌀', '🪞', '📐', '✨', '🧩', '⚖️', '🎨', '💎'];

export default function FloatingNumbers() {
  return (
    <div className="floating-symbols-layer" aria-hidden="true">
      {SYMBOLS.map((sym, idx) => (
        <span
          key={idx}
          className="floating-symbol"
          style={{
            left: `${(idx * 8.3) % 94}%`,
            top: `${(idx * 7.7) % 88}%`,
            animationDelay: `${idx * 1.8}s`,
            animationDuration: `${18 + (idx % 5) * 4}s`,
            fontSize: `${1.4 + (idx % 3) * 0.5}rem`,
          }}
        >
          {sym}
        </span>
      ))}
    </div>
  );
}
