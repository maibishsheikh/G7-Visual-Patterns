// src/components/simulations/KaleidoscopeWallLab.jsx
// Station 1: Concept Discovery Lab — The Kaleidoscope Wall
// Interactive tile grid where student explores rotation and reflection transforms live.

import React, { useState } from 'react';
import './Stations.css';
import { MOTIF_CATALOG, applyRotation, applyReflection, getRotationOrientationName } from '../../utils/visualPatternMath.js';
import { useAudio } from '../../hooks/useAudio.js';

const DIRECTION_LABELS = { 0: 'N', 90: 'E', 180: 'S', 270: 'W' };

function getGateQuestion(motifName, angle) {
  const resultAngle = (angle + 180) % 360;
  const resultDir = getRotationOrientationName(resultAngle);
  const startDir = getRotationOrientationName(angle);
  return {
    prompt: `If the ${motifName} is currently facing ${startDir} (${angle}°) and you apply a 180° half-turn, which direction will it face?`,
    correct: `${resultDir} (${resultAngle}°)`,
    options: [0, 90, 180, 270].map(a => `${getRotationOrientationName(a)} (${a}°)`),
  };
}

export default function KaleidoscopeWallLab({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [selectedMotifIndex, setSelectedMotifIndex] = useState(0);
  const [angle, setAngle] = useState(0);
  const [direction, setDirection] = useState('clockwise');
  const [flipMode, setFlipMode] = useState('none');

  // Gate state
  const [answeredQuestion, setAnsweredQuestion] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrectQuestion, setIsCorrectQuestion] = useState(false);

  const baseMotif = MOTIF_CATALOG[selectedMotifIndex];

  function handleRotateStep(delta) {
    sounds.click();
    setAngle(prev => (prev + delta + 360) % 360);
  }

  function handleFlipToggle(mode) {
    sounds.click();
    setFlipMode(prev => (prev === mode ? 'none' : mode));
  }

  const gate = getGateQuestion(baseMotif.name, angle);

  function handleAnswer(ans) {
    setSelectedOption(ans);
    if (ans === gate.correct) {
      sounds.correct();
      setIsCorrectQuestion(true);
      setAnsweredQuestion(true);
      narrate([{ text: `Spot on! A half-turn of 180 degrees flips the direction!`, style: 'celebration' }]);
    } else {
      sounds.wrong();
      setIsCorrectQuestion(false);
      narrate([{ text: 'Think carefully: 180° is two quarter-turns. Try again!', style: 'encouragement' }]);
    }
  }

  function renderMotifSvg(m, rot, flipH, flipV, size = 60) {
    const transform = `
      translate(50, 50)
      scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})
      rotate(${rot})
      translate(-50, -50)
    `;
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <g transform={transform}>
          <rect width="90" height="90" x="5" y="5" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <path d={m.svgPath} fill={m.color} stroke={m.accentColor || '#ffffff'} strokeWidth="3" strokeLinejoin="round" />
        </g>
      </svg>
    );
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🌀 Station 1: The Kaleidoscope Wall Lab</h3>
        <span className="station-badge">Concept Discovery</span>
      </div>

      <div className="station-grid-2col">
        {/* Left: Live Preview */}
        <div className="station-card-panel">
          <div className="panel-title"><span>🎨</span> Mosaic Wall Live Preview</div>

          <div className="tile-grid-3x3">
            {Array.from({ length: 9 }).map((_, idx) => {
              const cellRot = (angle + (idx % 2 === 0 ? 0 : 90)) % 360;
              const cellFlipH = flipMode === 'vertical' ? (idx % 2 === 1) : false;
              const cellFlipV = flipMode === 'horizontal' ? (idx > 2) : false;
              const cellDir = DIRECTION_LABELS[cellRot] || '';

              return (
                <div key={idx} className="tile-cell">
                  {renderMotifSvg(baseMotif, cellRot, cellFlipH, cellFlipV, 54)}
                  <span className="tile-cell-label">{cellDir}</span>
                </div>
              );
            })}
          </div>

          <div className="orientation-status">
            <span className="orientation-label">Current State:</span>
            <span className="orientation-value">
              {angle}° {direction.toUpperCase()} · {flipMode === 'none' ? 'No Flip' : `${flipMode.toUpperCase()} Flip`}
            </span>
          </div>
        </div>

        {/* Right: Controls + Gate */}
        <div className="station-card-panel">
          <div className="panel-title"><span>⚙️</span> Transformation Controls</div>

          {/* Motif Selector */}
          <div className="controls-group">
            <span className="control-label">1. Choose Base Motif:</span>
            <div className="tile-chips-row">
              {MOTIF_CATALOG.slice(0, 4).map((m, idx) => (
                <button
                  key={m.id}
                  className={`tile-chip ${selectedMotifIndex === idx ? 'active' : ''}`}
                  onClick={() => { sounds.click(); setSelectedMotifIndex(idx); }}
                >
                  {m.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Rotation */}
          <div className="control-row">
            <span className="control-label">2. Rotation:</span>
            <div className="control-stepper">
              <button className="stepper-btn" onClick={() => handleRotateStep(-90)} aria-label="Rotate anti-clockwise">↶</button>
              <span className="stepper-val">{angle}°</span>
              <button className="stepper-btn" onClick={() => handleRotateStep(90)} aria-label="Rotate clockwise">↷</button>
            </div>
          </div>

          {/* Direction */}
          <div className="control-row">
            <span className="control-label">Direction:</span>
            <div className="control-toggle-group">
              <button
                className={`control-toggle-btn ${direction === 'clockwise' ? 'active' : ''}`}
                onClick={() => { sounds.click(); setDirection('clockwise'); }}
              >Clockwise</button>
              <button
                className={`control-toggle-btn ${direction === 'anticlockwise' ? 'active' : ''}`}
                onClick={() => { sounds.click(); setDirection('anticlockwise'); }}
              >Anti-CW</button>
            </div>
          </div>

          {/* Flip */}
          <div className="control-row">
            <span className="control-label">3. Mirror Flip:</span>
            <div className="control-toggle-group">
              <button
                className={`control-toggle-btn ${flipMode === 'vertical' ? 'active-green' : ''}`}
                onClick={() => handleFlipToggle('vertical')}
              >Vertical ↕</button>
              <button
                className={`control-toggle-btn ${flipMode === 'horizontal' ? 'active-green' : ''}`}
                onClick={() => handleFlipToggle('horizontal')}
              >Horizontal ↔</button>
            </div>
          </div>

          {/* Discovery Gate */}
          <div className="concept-gate">
            <p className="concept-gate-title">🧠 Discovery Gate: {gate.prompt}</p>
            <div className="prediction-grid">
              {gate.options.map(opt => (
                <button
                  key={opt}
                  className={`prediction-btn ${selectedOption === opt ? (isCorrectQuestion ? 'correct' : 'wrong') : ''}`}
                  onClick={() => handleAnswer(opt)}
                  disabled={answeredQuestion && isCorrectQuestion}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Complete */}
          {answeredQuestion && isCorrectQuestion && (
            <div className="station-success-panel anim-bounce-in">
              <span className="success-text">🎉 Concept Verified! Kaleidoscope Wall Mastered.</span>
              <button className="btn btn-green btn-sm" onClick={onComplete}>Complete Station 1 ✓</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
