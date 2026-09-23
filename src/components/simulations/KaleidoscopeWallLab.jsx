// src/components/simulations/KaleidoscopeWallLab.jsx
// Station 1: Concept Discovery Lab — The Kaleidoscope Wall
// Interactive tile grid where student explores rotation and reflection transforms live.

import React, { useState } from 'react';
import './Stations.css';
import { MOTIF_CATALOG, applyRotation, applyReflection, getRotationOrientationName } from '../../utils/visualPatternMath.js';
import { useAudio } from '../../hooks/useAudio.js';

export default function KaleidoscopeWallLab({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [selectedMotifIndex, setSelectedMotifIndex] = useState(0); // L-tile
  const [angle, setAngle] = useState(0); // 0, 90, 180, 270
  const [direction, setDirection] = useState('clockwise');
  const [flipMode, setFlipMode] = useState('none'); // 'none', 'vertical', 'horizontal'

  // Concept Confirmation Question
  const [answeredQuestion, setAnsweredQuestion] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrectQuestion, setIsCorrectQuestion] = useState(false);

  const baseMotif = MOTIF_CATALOG[selectedMotifIndex];

  // Calculate current transformed motif
  let transformed = applyRotation(baseMotif, angle, direction);
  if (flipMode === 'vertical') transformed = applyReflection(transformed, 'vertical');
  if (flipMode === 'horizontal') transformed = applyReflection(transformed, 'horizontal');

  function handleRotateStep(delta) {
    sounds.click();
    setAngle((prev) => (prev + delta + 360) % 360);
  }

  function handleFlipToggle(mode) {
    sounds.click();
    setFlipMode((prev) => (prev === mode ? 'none' : mode));
  }

  function handleAnswer(ans) {
    setSelectedOption(ans);
    if (ans === 'Pointing Down (South)') {
      sounds.correct();
      setIsCorrectQuestion(true);
      setAnsweredQuestion(true);
      narrate([{ text: "Spot on! A half-turn of 180 degrees turns an upward-pointing motif directly downward!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      setIsCorrectQuestion(false);
      narrate([{ text: "Think carefully: 180 degrees is two 90-degree quarter turns in a row. Try again!", style: 'encouragement' }]);
    }
  }

  // Render SVG motif preview
  function renderMotifSvg(m, size = 52) {
    const scale = size / 100;
    const transform = `
      translate(50, 50)
      scale(${m.flipH ? -1 : 1}, ${m.flipV ? -1 : 1})
      rotate(${m.rotation || 0})
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
      {/* Station Header */}
      <div className="station-header">
        <h3 className="station-title">
          <span>🌀</span> Station 1: The Kaleidoscope Wall Lab
        </h3>
        <span className="station-badge">Concept Discovery Lab</span>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Interactive Mosaic Canvas */}
        <div className="station-card-panel">
          <div className="panel-title">
            <span>🎨</span> Mosaic Wall Live Preview
          </div>

          {/* 3x3 Kaleidoscope Wall */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              padding: '12px',
              background: 'rgba(10, 14, 30, 0.7)',
              borderRadius: '14px',
              border: '1.5px solid rgba(255, 255, 255, 0.1)',
              justifyItems: 'center',
            }}
          >
            {Array.from({ length: 9 }).map((_, idx) => {
              // Alternate rotation/reflection to show kaleidoscope effect
              const cellRot = (angle + (idx % 2 === 0 ? 0 : 90)) % 360;
              const cellFlipH = flipMode === 'vertical' ? (idx % 2 === 1) : false;
              const cellFlipV = flipMode === 'horizontal' ? (idx > 2) : false;

              return (
                <div
                  key={idx}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {renderMotifSvg(
                    {
                      ...baseMotif,
                      rotation: cellRot,
                      flipH: cellFlipH,
                      flipV: cellFlipV,
                    },
                    54
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Orientation Status Badge (Never color-only!) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              Current State:
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gold-light)' }}>
              {angle}° {direction.toUpperCase()} · {flipMode === 'none' ? 'No Flip' : `${flipMode.toUpperCase()} Flip`}
            </span>
          </div>
        </div>

        {/* Right Column: Controls & Confirmation Question */}
        <div className="station-card-panel">
          <div className="panel-title">
            <span>⚙️</span> Transformation Controls
          </div>

          {/* Motif Selector */}
          <div className="controls-group">
            <span className="control-label">1. Choose Base Motif:</span>
            <div className="tile-chips-row">
              {MOTIF_CATALOG.slice(0, 4).map((m, idx) => (
                <button
                  key={m.id}
                  className={`tile-chip ${selectedMotifIndex === idx ? 'active' : ''}`}
                  onClick={() => {
                    sounds.click();
                    setSelectedMotifIndex(idx);
                  }}
                >
                  <span>{m.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rotation Dial / Stepper */}
          <div className="control-row">
            <span className="control-label">2. Rotation Angle:</span>
            <div className="control-stepper">
              <button
                className="stepper-btn"
                onClick={() => handleRotateStep(-90)}
                aria-label="Rotate 90 degrees anti-clockwise"
              >
                ↶
              </button>
              <span className="stepper-val">{angle}°</span>
              <button
                className="stepper-btn"
                onClick={() => handleRotateStep(90)}
                aria-label="Rotate 90 degrees clockwise"
              >
                ↷
              </button>
            </div>
          </div>

          {/* Direction Toggle */}
          <div className="control-row">
            <span className="control-label">Direction:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={`btn btn-sm ${direction === 'clockwise' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                onClick={() => {
                  sounds.click();
                  setDirection('clockwise');
                }}
              >
                Clockwise
              </button>
              <button
                className={`btn btn-sm ${direction === 'anticlockwise' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                onClick={() => {
                  sounds.click();
                  setDirection('anticlockwise');
                }}
              >
                Anti-clockwise
              </button>
            </div>
          </div>

          {/* Flip Toggle */}
          <div className="control-row">
            <span className="control-label">3. Mirror Line (Flip):</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className={`btn btn-sm ${flipMode === 'vertical' ? 'btn-green' : 'btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                onClick={() => handleFlipToggle('vertical')}
              >
                Vertical ↕
              </button>
              <button
                className={`btn btn-sm ${flipMode === 'horizontal' ? 'btn-green' : 'btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                onClick={() => handleFlipToggle('horizontal')}
              >
                Horizontal ↔
              </button>
            </div>
          </div>

          {/* Concept Check Gate */}
          <div
            style={{
              marginTop: '8px',
              padding: '10px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <p style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gold)', margin: '0 0 8px 0' }}>
              🧠 Discovery Gate: When an upward-pointing motif turns 180° clockwise, which direction does it face?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {[
                'Pointing Down (South)',
                'Pointing Up (North)',
                'Pointing Right (East)',
                'Pointing Left (West)',
              ].map((opt) => (
                <button
                  key={opt}
                  className={`btn btn-sm ${selectedOption === opt ? (isCorrectQuestion ? 'btn-green' : 'btn-outline') : 'btn-outline'}`}
                  style={{ fontSize: '0.75rem', padding: '6px 8px', whiteSpace: 'normal', textAlign: 'center' }}
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Success & Completion CTA */}
          {answeredQuestion && isCorrectQuestion && (
            <div className="station-success-panel anim-slide-up" style={{ padding: '10px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--green-light)' }}>
                🎉 Concept Verified! Kaleidoscope Wall Mastered.
              </span>
              <button className="btn btn-green btn-sm" onClick={onComplete}>
                Complete Station 1 ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
