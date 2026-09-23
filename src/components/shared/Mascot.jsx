// src/components/shared/Mascot.jsx
// Kaleido the Chameleon 🦎 — MosaicQuest Mascot & Mentor

import React from 'react';
import './Mascot.css';
import { MASCOT } from '../../config/characters.config.js';

export default function Mascot({ mood = 'curious', message, size = 'md' }) {
  const moodEmoji =
    mood === 'celebrate' ? '🦎✨' : mood === 'thinking' ? '🦎💭' : mood === 'excited' ? '🦎🔥' : '🦎';

  return (
    <div className={`mascot-row-wrap mascot-${size}`}>
      <div className={`mascot-avatar-circle mood-${mood}`} title={MASCOT.name}>
        <span className="mascot-avatar-emoji">{moodEmoji}</span>
      </div>
      {message && (
        <div className="mascot-speech-bubble anim-fade-in">
          <span className="speech-name">{MASCOT.name}</span>
          <span className="speech-text">{message}</span>
        </div>
      )}
    </div>
  );
}
