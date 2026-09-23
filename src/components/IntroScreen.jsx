// src/components/IntroScreen.jsx
// Single-viewport welcome screen for MosaicQuest (Grade 7 · Visual Patterns)

import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc: 'The Broken Panel' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'Nadia & Arjun' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '4 spatial labs' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 worlds' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Master rank' },
];

export default function IntroScreen({ state, dispatch }) {
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);

  function startFresh() {
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function resumeSession() {
    dispatch({ type: 'SET_PHASE', payload: state.savedPhase || 'wonder' });
  }

  function jumpToPhase(label) {
    const phase = label.toLowerCase() === 'practice' ? 'play' : label.toLowerCase();
    dispatch({ type: 'SET_PHASE', payload: phase });
  }

  return (
    <div className="intro-wrap">
      {/* Top Curriculum Tag */}
      <div className="intro-top-badge">
        ✨ Singapore Math · Grade 7 · Visual Patterns
      </div>

      {/* Title */}
      <h1 className="intro-title">
        <span className="text-orange">Mosaic</span> <span className="text-white">Quest</span>
      </h1>
      <h2 className="intro-subtitle">
        Repeating Motifs · Rotations · Reflections &amp; Symmetry
      </h2>

      {/* Mascot Greeting */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle">🦎</div>
        <div className="intro-speech-bubble">
          Greetings, apprentice! I'm <strong>Kaleido</strong>. Ready to master rotations, reflections, and restore the ancient mosaic panels? 🎨📐
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Identify repeating motifs, continue rotation &amp; reflection sequences, find symmetry, and predict far figures with geometric proof!
      </p>

      {/* Journey Card — single row */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY · CLICK ANY PHASE</div>

        <div className="journey-steps-row">
          {JOURNEY.map((j, i) => (
            <React.Fragment key={j.num}>
              <div
                className="clickable-step"
                onClick={() => jumpToPhase(j.label)}
                role="button"
                tabIndex={0}
                title={`Open ${j.label} phase`}
              >
                <span className="journey-icon-circle">{j.icon}</span>
                <div className="journey-text-col">
                  <span className="journey-item-title">{j.label}</span>
                  <span className="journey-item-desc">{j.desc}</span>
                </div>
              </div>
              {i < JOURNEY.length - 1 && <span className="journey-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="intro-ctas">
        <button className="btn btn-primary btn-lg intro-cta-main" onClick={startFresh}>
          🚀 Begin Your Journey!
        </button>
        {hasSaved && (
          <button className="btn btn-outline" onClick={resumeSession}>
            ↩ Resume
          </button>
        )}
      </div>

      {/* Bottom Stats */}
      <div className="intro-bottom-cards">
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#ff6b6b' }}>🎯</div>
          <div>100 Questions</div>
        </div>
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#feca57' }}>🌍</div>
          <div>10 Worlds</div>
        </div>
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#66bb6a' }}>✨</div>
          <div>Badges &amp; XP</div>
        </div>
      </div>
    </div>
  );
}
