// src/components/simulations/DesignTheMosaicPanel.jsx
// Station 3: Multi-Step/Composite Construction — Design the Mosaic Panel
// Student places a motif, selects a transformation rule, renders figures live, and predicts Figure 6.

import React, { useState } from 'react';
import './Stations.css';
import { MOTIF_CATALOG, getRotationOrientationName } from '../../utils/visualPatternMath.js';
import { useAudio } from '../../hooks/useAudio.js';

const RULES = [
  {
    id: 'rot-90-cw',
    label: 'Rotate 90° Clockwise each step',
    type: 'rotation',
    delta: 90,
    dir: 'clockwise',
    description: 'Each subsequent figure turns a quarter-turn (90°) clockwise.',
  },
  {
    id: 'rot-180',
    label: 'Rotate 180° Half-Turn each step',
    type: 'rotation',
    delta: 180,
    dir: 'clockwise',
    description: 'Each subsequent figure turns a half-turn (180°), alternating facing directions.',
  },
  {
    id: 'flip-v',
    label: 'Reflect across Vertical Mirror Line each step',
    type: 'reflection',
    axis: 'vertical',
    description: 'Each subsequent figure flips across a vertical mirror line, reversing left and right.',
  },
];

export default function DesignTheMosaicPanel({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [selectedMotif, setSelectedMotif] = useState(MOTIF_CATALOG[2]); // Arrow
  const [selectedRuleId, setSelectedRuleId] = useState('rot-90-cw');
  const [predictedFig6, setPredictedFig6] = useState(null);
  const [isPredictionCorrect, setIsPredictionCorrect] = useState(false);

  const activeRule = RULES.find((r) => r.id === selectedRuleId) || RULES[0];

  // Compute orientations for Figures 1 to 4
  const generatedFigures = [1, 2, 3, 4].map((figNum) => {
    const stepIdx = figNum - 1;
    let angle = 0;
    let flipH = false;

    if (activeRule.type === 'rotation') {
      angle = (stepIdx * activeRule.delta) % 360;
    } else if (activeRule.type === 'reflection') {
      flipH = stepIdx % 2 === 1;
    }

    return { figNum, angle, flipH };
  });

  // Calculate true Figure 6:
  // Step 6 is stepIdx = 5
  let trueFig6Angle = 0;
  let trueFig6FlipH = false;
  let targetDescription = '';

  if (activeRule.type === 'rotation') {
    trueFig6Angle = (5 * activeRule.delta) % 360;
    targetDescription = getRotationOrientationName(trueFig6Angle);
  } else {
    trueFig6FlipH = 5 % 2 === 1; // odd -> flipped!
    targetDescription = 'Reversed (Flipped across vertical line)';
  }

  // Generate 4 candidate options for Figure 6
  let candidateOptions = [];
  if (activeRule.type === 'rotation') {
    candidateOptions = [
      getRotationOrientationName(trueFig6Angle),
      getRotationOrientationName((trueFig6Angle + 90) % 360),
      getRotationOrientationName((trueFig6Angle + 180) % 360),
      getRotationOrientationName((trueFig6Angle + 270) % 360),
    ];
  } else {
    candidateOptions = [
      'Reversed (Flipped across vertical line)',
      'Unchanged (Slid across without flipping — translation)',
      'Rotated 180° upside down',
      'Inverted in colour only',
    ];
  }

  function handleRuleChange(ruleId) {
    sounds.click();
    setSelectedRuleId(ruleId);
    setPredictedFig6(null);
    setIsPredictionCorrect(false);
  }

  function handleSelectPrediction(opt) {
    setPredictedFig6(opt);
    const correct = opt === targetDescription;
    if (correct) {
      sounds.correct();
      setIsPredictionCorrect(true);
      narrate([
        {
          text: `Brilliant spatial reasoning! You predicted Figure 6 (${targetDescription}) without drawing it out!`,
          style: 'celebration',
        },
      ]);
    } else {
      sounds.wrong();
      setIsPredictionCorrect(false);
      narrate([
        {
          text: 'Look at the pattern cycle again: calculate the transform for Step 6 step-by-step.',
          style: 'encouragement',
        },
      ]);
    }
  }

  function renderFigSvg(figNum, angle, flipH, size = 48) {
    const transform = `
      translate(50, 50)
      scale(${flipH ? -1 : 1}, 1)
      rotate(${angle})
      translate(-50, -50)
    `;

    return (
      <div
        key={figNum}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '8px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100">
          <g transform={transform}>
            <rect width="90" height="90" x="5" y="5" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            <path d={selectedMotif.svgPath} fill={selectedMotif.color} stroke={selectedMotif.accentColor || '#ffffff'} strokeWidth="3" strokeLinejoin="round" />
          </g>
        </svg>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--gold)' }}>
          Figure {figNum}
        </span>
        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)' }}>
          {activeRule.type === 'rotation' ? `${angle}°` : flipH ? 'Flipped' : 'Normal'}
        </span>
      </div>
    );
  }

  return (
    <div className="station-wrap">
      {/* Station Header */}
      <div className="station-header">
        <h3 className="station-title">
          <span>🏛️</span> Station 3: Design the Mosaic Panel
        </h3>
        <span className="station-badge">Multi-Step Construction</span>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Live Rendered Figure Sequence */}
        <div className="station-card-panel">
          <div className="panel-title">
            <span>✨</span> Live Generated Mosaic Sequence (Figures 1–4)
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '14px',
              background: 'rgba(10, 14, 30, 0.7)',
              borderRadius: '14px',
              border: '1.5px solid rgba(255, 255, 255, 0.12)',
              flexWrap: 'wrap',
            }}
          >
            {generatedFigures.map((f) => renderFigSvg(f.figNum, f.angle, f.flipH))}

            {/* Unknown Far Figure 6 Slot */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '68px',
                height: '84px',
                borderRadius: '12px',
                border: '2px dashed var(--gold)',
                background: 'rgba(245, 158, 11, 0.12)',
                boxShadow: '0 0 16px rgba(245, 158, 11, 0.25)',
              }}
            >
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold)' }}>?</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                Figure 6
              </span>
            </div>
          </div>

          {/* Active Rule Description */}
          <div
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Applied Rule: <strong style={{ color: 'var(--gold)' }}>{activeRule.label}</strong>
              <br />
              {activeRule.description}
            </span>
          </div>
        </div>

        {/* Right Column: Rule Selection & Far-Figure Prediction */}
        <div className="station-card-panel">
          <div className="panel-title">
            <span>📐</span> Rule Selection &amp; Spatial Prediction
          </div>

          {/* Step 1: Select Transformation Rule */}
          <div className="controls-group">
            <span className="control-label">1. Select Geometric Rule:</span>
            {RULES.map((r) => (
              <button
                key={r.id}
                className={`tile-chip ${selectedRuleId === r.id ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px' }}
                onClick={() => handleRuleChange(r.id)}
              >
                <span>{r.id.startsWith('rot') ? '🌀' : '🪞'}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{r.label}</span>
              </button>
            ))}
          </div>

          {/* Step 2: Far Figure 6 Challenge */}
          <div style={{ marginTop: '6px' }}>
            <span className="control-label" style={{ display: 'block', marginBottom: '6px' }}>
              2. Far-Figure Challenge: What will <strong>Figure 6</strong> look like?
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
              {candidateOptions.map((opt, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${predictedFig6 === opt ? (isPredictionCorrect ? 'btn-green' : 'btn-outline') : 'btn-outline'}`}
                  style={{
                    fontSize: '0.8rem',
                    padding: '8px 10px',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    whiteSpace: 'normal',
                  }}
                  onClick={() => handleSelectPrediction(opt)}
                >
                  <span style={{ fontWeight: 800 }}>{String.fromCharCode(65 + i)}:</span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Completion Gate */}
          {isPredictionCorrect && (
            <div className="station-success-panel anim-slide-up" style={{ padding: '10px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--green-light)' }}>
                🎉 Panel Rule &amp; Prediction Verified!
              </span>
              <button className="btn btn-green btn-sm" onClick={onComplete}>
                Complete Station 3 ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
