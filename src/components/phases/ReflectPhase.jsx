// src/components/phases/ReflectPhase.jsx
// Phase 5: Reflect — 3 Misconception Recap Questions, Scorecard, and Reflection Journal

import React, { useState, useEffect, useRef } from 'react';
import './ReflectPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { BADGES } from '../../utils/badgeEngine.js';
import { calcStars } from '../../utils/scoring.js';
import { useAudio } from '../../hooks/useAudio.js';
import { reflectNarration, reflectCompleteNarration } from '../../utils/narration.js';
import { generateSessionQuestions } from '../../utils/shuffle.js';
import questionBank from '../../data/questionBank.js';

const REFLECT_QUESTIONS = [
  {
    q: "1. What is the fundamental geometric difference between reflecting a motif across a line and translating (sliding) it?",
    options: [
      "Reflection flips the motif across a mirror line, reversing its left/right orientation; translation simply slides it without flipping",
      "Translation flips the motif across a line, while reflection simply slides it across the surface",
      "Reflection and translation produce geometrically identical orientations in all cases",
    ],
    correct: 0,
  },
  {
    q: "2. Nadia says: 'A motif that rotates 90° clockwise at each step has line symmetry.' Arjun checks and corrects her. Why?",
    options: [
      "Rotation turns a motif around a center point; line symmetry requires folding across a mirror line so both halves match",
      "Rotation and reflection symmetry are always the exact same mathematical property",
      "Turning 90° always creates line symmetry on any shape automatically",
    ],
    correct: 0,
  },
  {
    q: "3. When mathematically justifying why a mosaic figure has line symmetry, what must you always specify?",
    options: [
      "Exactly where the mirror line sits and that folding along it produces an exact match",
      "Simply that 'it looks balanced' to the naked eye without locating any line",
      "Only count the number of sides, assuming any polygon has that many symmetry lines",
    ],
    correct: 0,
  },
];

export default function ReflectPhase({ state, dispatch }) {
  const [answers, setAnswers] = useState({});
  const [journal, setJournal] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled ?? true);
  const narrated = useRef(false);

  const totalCorrect = state?.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  const totalStars =
    state?.districtScores?.reduce((s, sc) => {
      if (sc === null || sc === undefined) return s;
      return s + calcStars(sc);
    }, 0) || 0;

  useEffect(() => {
    if (!narrated.current) {
      narrated.current = true;
      narrate(reflectNarration());
    }
    dispatch({ type: 'COMPLETE_PHASE', payload: 'reflect' });
    return () => stopAll();
  }, [dispatch, narrate, stopAll]);

  function handleSelectOption(qIdx, optIdx) {
    sounds.click();
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  }

  function handleSubmit() {
    setSubmitted(true);
    stopAll();
    sounds.badge();
    narrate(reflectCompleteNarration());
  }

  function playAgain() {
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  }

  const earnedBadges = BADGES.filter((b) => state?.badges?.includes(b.id));

  if (submitted) {
    return (
      <div className="reflect-wrap">
        <div className="trophy-card glass-card anim-bounce-in">
          <div className="trophy-icon">🏆</div>
          <h1 className="trophy-title headline">You're a Master Mosaicist!</h1>
          <p className="trophy-sub subheadline" style={{ color: 'var(--gold)' }}>
            Grade 7 Visual Patterns Mastery Complete ✅
          </p>

          {/* Stats Breakdown */}
          <div className="trophy-stats">
            <div className="trophy-stat">
              <span className="stat-value number-display">{totalCorrect}</span>
              <span className="stat-label label-text">/ 100 Questions</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display">{totalStars}</span>
              <span className="stat-label label-text">/ 30 Stars ⭐</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display">{state?.xp || 0}</span>
              <span className="stat-label label-text">Total XP ⚡</span>
            </div>
          </div>

          {/* Badges Gallery */}
          {earnedBadges.length > 0 && (
            <div className="trophy-badges-section">
              <h3 className="section-label">Badges Earned:</h3>
              <div className="trophy-badges-row">
                {earnedBadges.map((b) => (
                  <div key={b.id} className="earned-badge-chip" title={b.description}>
                    <span className="badge-chip-icon">{b.icon}</span>
                    <span className="badge-chip-name">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {journal && (
            <div className="journal-reflection-box">
              <span className="journal-label">Your Reflection:</span>
              <p className="journal-quote">"{journal}"</p>
            </div>
          )}

          <button className="btn btn-primary btn-lg restart-btn" onClick={playAgain}>
            Play Again 🔄
          </button>
        </div>
      </div>
    );
  }

  const allAnswered = REFLECT_QUESTIONS.every((_, idx) => answers[idx] !== undefined);

  return (
    <div className="reflect-wrap">
      <div className="reflect-card glass-card anim-slide-up">
        {/* Header */}
        <div className="reflect-header">
          <span className="reflect-badge-icon">🏛️</span>
          <h1 className="reflect-title headline">Mosaic Workshop Reflection</h1>
          <p className="reflect-sub subheadline">
            Review the core spatial principles before receiving your Master Artisan rank!
          </p>
        </div>

        {/* 3 Misconception Recap Questions */}
        <div className="recap-questions-list">
          {REFLECT_QUESTIONS.map((item, qIdx) => (
            <div key={qIdx} className="recap-q-block">
              <p className="recap-q-text">{item.q}</p>
              <div className="recap-options">
                {item.options.map((opt, oIdx) => {
                  const isSelected = answers[qIdx] === oIdx;
                  return (
                    <button
                      key={oIdx}
                      className={`recap-opt-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(qIdx, oIdx)}
                    >
                      <span className="recap-opt-indicator">{isSelected ? '◉' : '○'}</span>
                      <span className="recap-opt-text">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Reflection Journal Prompt (PRD §8.5) */}
        <div className="journal-block">
          <label className="journal-prompt-label" htmlFor="reflect-journal">
            💭 Master Artisan Prompt: Which tile or transformation in your panel was hardest to justify, and why?
          </label>
          <textarea
            id="reflect-journal"
            className="journal-textarea"
            rows={3}
            placeholder="e.g. Distinguishing a 180° rotation from a reflection across the vertical axis took careful checking of the tile's corner orientation..."
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
          />
        </div>

        {/* Mascot Note */}
        <div className="reflect-mascot-row">
          <Mascot
            mood="thinking"
            message="Mathematical justification turns intuition into rigorous proof! Complete your reflection to claim your rank!"
            size="sm"
          />
        </div>

        {/* Submit Button */}
        <div className="reflect-footer">
          <button
            className="btn btn-primary btn-lg reflect-submit-btn"
            disabled={!allAnswered}
            onClick={handleSubmit}
          >
            Submit Reflection &amp; View Rank 🏆
          </button>
        </div>
      </div>
    </div>
  );
}
