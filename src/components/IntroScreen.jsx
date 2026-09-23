// src/components/IntroScreen.jsx
// Main Welcome & Navigation Screen for MosaicQuest (Grade 7 · Visual Patterns)

import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc: 'The Broken Panel mystery' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'Nadia & Arjun\'s commission' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '4 interactive spatial labs' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 worlds & master critiques' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Review & Master Artisan rank' },
];

export default function IntroScreen({ state, dispatch }) {
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);

  function startFresh() {
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  return (
    <div className="intro-wrap">
      {/* Top Curriculum Tag */}
      <div className="intro-top-badge">
        ✨ Singapore Math · Grade 7 (Secondary 1) · Visual Patterns
      </div>

      {/* Main Title */}
      <h1 className="intro-title">
        <span className="text-orange">Mosaic</span> <span className="text-white">Quest</span>
      </h1>
      <h2 className="intro-subtitle">
        Spatial Patterns · Repeating Motifs, Rotations, Reflections &amp; Symmetry
      </h2>

      {/* Mascot Greeting */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle" style={{ background: 'radial-gradient(circle, #34d399, #059669)' }}>
          🦎
        </div>
        <div className="intro-speech-bubble">
          Greetings, apprentice! I'm Kaleido the Chameleon. Ready to explore the mosaic workshop,
          master rotations and reflections, and restore the ancient panels? 🎨📐
        </div>
      </div>

      {/* Module Overview Description */}
      <p className="intro-desc">
        Learn how to identify repeating motifs, distinguish repeating from growing patterns, continue rotation &amp; reflection sequences, find line and rotational symmetry, and predict far figures with geometric proof!
      </p>

      {/* 5-Phase Journey Card */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY · CLICK ANY PHASE TO JUMP IN</div>

        <div className="journey-steps-container">
          <div className="journey-row top-row">
            {JOURNEY.slice(0, 3).map((j, i) => (
              <React.Fragment key={j.num}>
                <div
                  className="journey-step-item clickable-step"
                  onClick={() =>
                    dispatch({
                      type: 'SET_PHASE',
                      payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase(),
                    })
                  }
                  role="button"
                  tabIndex={0}
                  title={`Click to open ${j.label} phase`}
                >
                  <span className="journey-icon-circle">{j.icon}</span>
                  <div className="journey-text-col">
                    <span className="journey-item-title">{j.label}</span>
                    <span className="journey-item-desc">{j.desc}</span>
                  </div>
                </div>
                <span className={`journey-arrow ${i === 2 ? 'fade-arrow' : ''}`}>→</span>
              </React.Fragment>
            ))}
          </div>

          <div className="journey-row bottom-row">
            {JOURNEY.slice(3, 5).map((j, i) => (
              <React.Fragment key={j.num}>
                <div
                  className="journey-step-item clickable-step"
                  onClick={() =>
                    dispatch({
                      type: 'SET_PHASE',
                      payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase(),
                    })
                  }
                  role="button"
                  tabIndex={0}
                  title={`Click to open ${j.label} phase`}
                >
                  <span className="journey-icon-circle">{j.icon}</span>
                  <div className="journey-text-col">
                    <span className="journey-item-title">{j.label}</span>
                    <span className="journey-item-desc">{j.desc}</span>
                  </div>
                </div>
                {i === 0 && <span className="journey-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Start Button Row */}
      <div className="intro-actions-row">
        <button className="btn btn-primary btn-lg" onClick={startFresh}>
          Start Workshop Journey 🚀
        </button>
      </div>
    </div>
  );
}
