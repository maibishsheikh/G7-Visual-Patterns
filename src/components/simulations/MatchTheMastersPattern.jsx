// src/components/simulations/MatchTheMastersPattern.jsx
// Station 2: Build-to-Target — Match the Master's Pattern
// Student adjusts transformation parameters to replicate the master artisan's pattern strip.

import React, { useState } from 'react';
import './Stations.css';
import { MOTIF_CATALOG } from '../../utils/visualPatternMath.js';
import { useAudio } from '../../hooks/useAudio.js';

const COMMISSIONS = [
  {
    id: 1,
    title: 'The Spinning Arrow Border',
    motif: MOTIF_CATALOG[2],
    targetAngleStep: 90,
    targetDirection: 'clockwise',
    targetCycle: 4,
    targetFlip: false,
    hint: 'Each arrow turns 90° clockwise from the one before.',
  },
  {
    id: 2,
    title: 'The Mirrored L-Tile Border',
    motif: MOTIF_CATALOG[0],
    targetAngleStep: 0,
    targetDirection: 'clockwise',
    targetCycle: 2,
    targetFlip: true,
    hint: 'The L-tile alternates flipping across the vertical axis.',
  },
  {
    id: 3,
    title: 'The Rotating Pennant Ribbon',
    motif: MOTIF_CATALOG[1],
    targetAngleStep: 180,
    targetDirection: 'clockwise',
    targetCycle: 2,
    targetFlip: false,
    hint: 'The pennant alternates between upright and upside-down (180° half-turns).',
  },
];

export default function MatchTheMastersPattern({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [commIdx, setCommIdx] = useState(0);

  // Student controls
  const [studentAngleStep, setStudentAngleStep] = useState(0);
  const [studentDirection, setStudentDirection] = useState('clockwise');
  const [studentCycle, setStudentCycle] = useState(2);
  const [studentFlip, setStudentFlip] = useState(false);

  const comm = COMMISSIONS[commIdx];

  // Match evaluation
  const isAngleMatch = studentAngleStep === comm.targetAngleStep;
  const isDirectionMatch = comm.targetAngleStep === 0 || studentDirection === comm.targetDirection;
  const isCycleMatch = studentCycle === comm.targetCycle;
  const isFlipMatch = studentFlip === comm.targetFlip;
  const matchCount = [isAngleMatch, isDirectionMatch, isCycleMatch, isFlipMatch].filter(Boolean).length;
  const isExactMatch = matchCount === 4;

  function renderStrip(motif, angleStep, dir, cycle, flip, length = 6) {
    const tiles = [];
    for (let i = 0; i < length; i++) {
      const stepAngle = dir === 'clockwise'
        ? (i * angleStep) % 360
        : (360 - ((i * angleStep) % 360)) % 360;
      const stepFlip = flip ? i % 2 === 1 : false;

      const transform = `
        translate(50, 50)
        scale(${stepFlip ? -1 : 1}, 1)
        rotate(${stepAngle})
        translate(-50, -50)
      `;

      tiles.push(
        <div key={i} className="strip-tile">
          <svg width={48} height={48} viewBox="0 0 100 100">
            <g transform={transform}>
              <rect width="90" height="90" x="5" y="5" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <path d={motif.svgPath} fill={motif.color} stroke={motif.accentColor || '#ffffff'} strokeWidth="3" strokeLinejoin="round" />
            </g>
          </svg>
          <span className="strip-tile-label">Step {i + 1}</span>
        </div>
      );
    }
    return tiles;
  }

  function handleNextCommission() {
    sounds.correct();
    if (commIdx + 1 < COMMISSIONS.length) {
      setCommIdx(commIdx + 1);
      setStudentAngleStep(0);
      setStudentFlip(false);
      setStudentCycle(2);
      setStudentDirection('clockwise');
      narrate([{ text: "Brilliant match! Now tackle the master's next commission!", style: 'celebration' }]);
    } else {
      narrate([{ text: 'All master commissions matched to perfection!', style: 'celebration' }]);
    }
  }

  function getMismatchHint() {
    if (!isAngleMatch) return '⚠️ Rotation step mismatch — adjust degrees per step.';
    if (!isFlipMatch) return '⚠️ Reflection mismatch — toggle the flip setting.';
    if (!isCycleMatch) return '⚠️ Cycle length mismatch — adjust cycle repeat.';
    if (!isDirectionMatch) return '⚠️ Direction mismatch — try clockwise vs anti-clockwise.';
    return '';
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🎯 Station 2: Match the Master's Pattern</h3>
        <span className="station-round-badge">Commission {commIdx + 1}/{COMMISSIONS.length}</span>
      </div>

      <div className="station-grid-2col">
        {/* Left: Strip Comparison */}
        <div className="station-card-panel">
          {/* Target */}
          <div className="panel-title">👑 {comm.title} — Master's Target:</div>
          <div className="strip-display target">
            {renderStrip(comm.motif, comm.targetAngleStep, comm.targetDirection, comm.targetCycle, comm.targetFlip)}
          </div>

          {/* Student */}
          <div className="panel-title">🛠️ Your Reconstructed Strip:</div>
          <div className={`strip-display ${isExactMatch ? 'matched' : ''}`}>
            {renderStrip(comm.motif, studentAngleStep, studentDirection, studentCycle, studentFlip)}
          </div>

          {/* Match Meter */}
          <div className="match-meter">
            <span className="match-meter-label">
              {isExactMatch ? '✅ PERFECT MATCH!' : `${matchCount}/4 parameters matched`}
            </span>
            <div className="match-meter-track">
              <div className="match-meter-fill" style={{ width: `${(matchCount / 4) * 100}%` }} />
            </div>
          </div>

          {/* Status */}
          <div className={`match-status-badge ${isExactMatch ? 'matched' : 'unmatched'}`}>
            {isExactMatch
              ? <span>🎉 Pattern geometry matches the master's target!</span>
              : <span>{getMismatchHint()}</span>
            }
          </div>
        </div>

        {/* Right: Controls */}
        <div className="station-card-panel">
          <div className="panel-title"><span>🎛️</span> Pattern Controls</div>

          {/* Rotation Step */}
          <div className="control-row">
            <span className="control-label">Rotation per tile:</span>
            <div className="control-stepper">
              <button className="stepper-btn" onClick={() => { sounds.click(); setStudentAngleStep(prev => (prev <= 0 ? 270 : prev - 90)); }}>−</button>
              <span className="stepper-val">{studentAngleStep}°</span>
              <button className="stepper-btn" onClick={() => { sounds.click(); setStudentAngleStep(prev => (prev >= 270 ? 0 : prev + 90)); }}>+</button>
            </div>
          </div>

          {/* Direction */}
          <div className="control-row">
            <span className="control-label">Direction:</span>
            <div className="control-toggle-group">
              <button
                className={`control-toggle-btn ${studentDirection === 'clockwise' ? 'active' : ''}`}
                onClick={() => { sounds.click(); setStudentDirection('clockwise'); }}
              >Clockwise</button>
              <button
                className={`control-toggle-btn ${studentDirection === 'anticlockwise' ? 'active' : ''}`}
                onClick={() => { sounds.click(); setStudentDirection('anticlockwise'); }}
              >Anti-CW</button>
            </div>
          </div>

          {/* Flip */}
          <div className="control-row">
            <span className="control-label">Alternating Flip:</span>
            <button
              className={`control-toggle-btn ${studentFlip ? 'active-green' : ''}`}
              onClick={() => { sounds.click(); setStudentFlip(!studentFlip); }}
            >
              {studentFlip ? 'Flip ON (Mirrored)' : 'Flip OFF (None)'}
            </button>
          </div>

          {/* Cycle */}
          <div className="control-row">
            <span className="control-label">Cycle Length:</span>
            <div className="control-stepper">
              <button className="stepper-btn" onClick={() => { sounds.click(); setStudentCycle(c => Math.max(2, c - 1)); }}>−</button>
              <span className="stepper-val">{studentCycle} tiles</span>
              <button className="stepper-btn" onClick={() => { sounds.click(); setStudentCycle(c => Math.min(4, c + 1)); }}>+</button>
            </div>
          </div>

          {/* Hint */}
          <div className="hint-card">💡 Master's Clue: {comm.hint}</div>

          {/* Success */}
          {isExactMatch && (
            <div className="station-success-panel anim-bounce-in">
              <span className="success-text">Target Replicated Accurately!</span>
              {commIdx + 1 < COMMISSIONS.length ? (
                <button className="btn btn-primary btn-sm" onClick={handleNextCommission}>
                  Next Commission ➔
                </button>
              ) : (
                <button className="btn btn-green btn-sm" onClick={onComplete}>
                  Complete Station 2 ✓
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
