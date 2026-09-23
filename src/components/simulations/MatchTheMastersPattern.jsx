// src/components/simulations/MatchTheMastersPattern.jsx
// Station 2: Build-to-Target Challenge — Match the Master's Pattern
// Student adjusts transformation parameters to replicate the master artisan's pattern strip.

import React, { useState } from 'react';
import './Stations.css';
import { MOTIF_CATALOG, applyRotation, applyReflection } from '../../utils/visualPatternMath.js';
import { useAudio } from '../../hooks/useAudio.js';

const COMMISSIONS = [
  {
    id: 1,
    title: 'Commission 1: The Spinning Arrow Border',
    motif: MOTIF_CATALOG[2], // Arrow
    targetAngleStep: 90,
    targetDirection: 'clockwise',
    targetCycle: 4,
    targetFlip: false,
    hint: 'Notice each arrow turns 90° clockwise from the one before it.',
  },
  {
    id: 2,
    title: 'Commission 2: The Mirrored L-Tile Border',
    motif: MOTIF_CATALOG[0], // L-tile
    targetAngleStep: 0,
    targetDirection: 'clockwise',
    targetCycle: 2,
    targetFlip: true,
    hint: 'Notice the L-tile alternates flipping across the vertical axis every step.',
  },
];

export default function MatchTheMastersPattern({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [commIdx, setCommIdx] = useState(0);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  // Student Controls
  const [studentAngleStep, setStudentAngleStep] = useState(0);
  const [studentDirection, setStudentDirection] = useState('clockwise');
  const [studentCycle, setStudentCycle] = useState(2);
  const [studentFlip, setStudentFlip] = useState(false);

  const comm = COMMISSIONS[commIdx];

  // Evaluate Match
  const isAngleMatch = studentAngleStep === comm.targetAngleStep;
  const isDirectionMatch = comm.targetAngleStep === 0 || studentDirection === comm.targetDirection;
  const isCycleMatch = studentCycle === comm.targetCycle;
  const isFlipMatch = studentFlip === comm.targetFlip;
  const isExactMatch = isAngleMatch && isDirectionMatch && isCycleMatch && isFlipMatch;

  function renderStrip(motif, angleStep, dir, cycle, flip, length = 5) {
    const tiles = [];
    for (let i = 0; i < length; i++) {
      const stepAngle = dir === 'clockwise' ? (i * angleStep) % 360 : (360 - ((i * angleStep) % 360)) % 360;
      const stepFlip = flip ? i % 2 === 1 : false;

      const transform = `
        translate(50, 50)
        scale(${stepFlip ? -1 : 1}, 1)
        rotate(${stepAngle})
        translate(-50, -50)
      `;

      tiles.push(
        <div
          key={i}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            padding: '4px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <svg width={46} height={46} viewBox="0 0 100 100">
            <g transform={transform}>
              <rect width="90" height="90" x="5" y="5" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <path d={motif.svgPath} fill={motif.color} stroke={motif.accentColor || '#ffffff'} strokeWidth="3" strokeLinejoin="round" />
            </g>
          </svg>
          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
            Step {i + 1}
          </span>
        </div>
      );
    }
    return tiles;
  }

  function handleNextCommission() {
    sounds.correct();
    setRoundsCompleted((prev) => prev + 1);
    if (commIdx + 1 < COMMISSIONS.length) {
      setCommIdx(commIdx + 1);
      // Reset controls for next round
      setStudentAngleStep(0);
      setStudentFlip(false);
      setStudentCycle(2);
      narrate([{ text: "Brilliant match! Now tackle the master's second commission!", style: 'celebration' }]);
    } else {
      narrate([{ text: "All master commissions matched to perfection! Well done!", style: 'celebration' }]);
    }
  }

  return (
    <div className="station-wrap">
      {/* Station Header */}
      <div className="station-header">
        <h3 className="station-title">
          <span>🎯</span> Station 2: Match the Master's Pattern
        </h3>
        <span className="station-badge">Build-to-Target Challenge</span>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Strips comparison */}
        <div className="station-card-panel">
          {/* Target Master Strip */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span className="panel-title">👑 Master's Target Strip:</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                {comm.title}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                padding: '10px',
                background: 'rgba(10, 14, 30, 0.7)',
                borderRadius: '12px',
                border: '1.5px solid var(--gold)',
                boxShadow: '0 0 16px rgba(245, 158, 11, 0.25)',
              }}
            >
              {renderStrip(comm.motif, comm.targetAngleStep, comm.targetDirection, comm.targetCycle, comm.targetFlip)}
            </div>
          </div>

          {/* Student Live Strip */}
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span className="panel-title">🛠️ Your Reconstructed Strip:</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isExactMatch ? 'var(--green-light)' : 'var(--gold)' }}>
                {isExactMatch ? 'EXACT MATCH ✅' : 'IN PROGRESS'}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                padding: '10px',
                background: 'rgba(10, 14, 30, 0.7)',
                borderRadius: '12px',
                border: `1.5px solid ${isExactMatch ? 'var(--green)' : 'rgba(255,255,255,0.15)'}`,
                boxShadow: isExactMatch ? '0 0 20px rgba(16, 185, 129, 0.35)' : 'none',
              }}
            >
              {renderStrip(comm.motif, studentAngleStep, studentDirection, studentCycle, studentFlip)}
            </div>
          </div>

          {/* Match / Mismatch Status Text (Never color-only!) */}
          <div className={`match-status-badge ${isExactMatch ? 'matched' : 'unmatched'}`}>
            {isExactMatch ? (
              <span>🎉 Perfect Match! The pattern geometry matches the master's target!</span>
            ) : !isAngleMatch ? (
              <span>⚠️ Rotation Step mismatch: adjust the degrees per step.</span>
            ) : !isFlipMatch ? (
              <span>⚠️ Reflection mismatch: check if the pattern alternates flipping.</span>
            ) : (
              <span>⚠️ Direction mismatch: check clockwise vs anti-clockwise.</span>
            )}
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="station-card-panel">
          <div className="panel-title">
            <span>🎛️</span> Pattern Controls
          </div>

          {/* Angle Step Stepper */}
          <div className="control-row">
            <span className="control-label">Rotation Step per Tile:</span>
            <div className="control-stepper">
              <button
                className="stepper-btn"
                onClick={() => {
                  sounds.click();
                  setStudentAngleStep((prev) => (prev <= 0 ? 270 : prev - 90));
                }}
              >
                -
              </button>
              <span className="stepper-val">{studentAngleStep}°</span>
              <button
                className="stepper-btn"
                onClick={() => {
                  sounds.click();
                  setStudentAngleStep((prev) => (prev >= 270 ? 0 : prev + 90));
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Direction Toggle */}
          <div className="control-row">
            <span className="control-label">Rotation Direction:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={`btn btn-sm ${studentDirection === 'clockwise' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                onClick={() => {
                  sounds.click();
                  setStudentDirection('clockwise');
                }}
              >
                Clockwise
              </button>
              <button
                className={`btn btn-sm ${studentDirection === 'anticlockwise' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                onClick={() => {
                  sounds.click();
                  setStudentDirection('anticlockwise');
                }}
              >
                Anti-clockwise
              </button>
            </div>
          </div>

          {/* Flip Toggle */}
          <div className="control-row">
            <span className="control-label">Alternating Vertical Flip:</span>
            <button
              className={`btn btn-sm ${studentFlip ? 'btn-green' : 'btn-outline'}`}
              style={{ padding: '4px 12px', fontSize: '0.8rem' }}
              onClick={() => {
                sounds.click();
                setStudentFlip(!studentFlip);
              }}
            >
              {studentFlip ? 'Flip ON (Mirrored)' : 'Flip OFF (None)'}
            </button>
          </div>

          {/* Cycle Length Stepper */}
          <div className="control-row">
            <span className="control-label">Cycle Repeat Length:</span>
            <div className="control-stepper">
              <button
                className="stepper-btn"
                onClick={() => {
                  sounds.click();
                  setStudentCycle((c) => Math.max(2, c - 1));
                }}
              >
                -
              </button>
              <span className="stepper-val">{studentCycle} Tiles</span>
              <button
                className="stepper-btn"
                onClick={() => {
                  sounds.click();
                  setStudentCycle((c) => Math.min(4, c + 1));
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Hint Card */}
          <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              💡 Master's Clue: {comm.hint}
            </span>
          </div>

          {/* Advance or Complete Station Button */}
          {isExactMatch && (
            <div className="station-success-panel anim-slide-up" style={{ padding: '10px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--green-light)' }}>
                Target Replicated Accurately!
              </span>
              {commIdx + 1 < COMMISSIONS.length ? (
                <button className="btn btn-primary btn-sm" onClick={handleNextCommission}>
                  Next Target Commission ➔
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
