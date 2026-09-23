// src/components/simulations/DesignTheMosaicPanel.jsx
// Station 3: Design the Mosaic Panel — Multi-Step Construction
// Student selects rule, watches Figures 1–4, and predicts Figure 6.

import React, { useState } from 'react';
import './Stations.css';
import { MOTIF_CATALOG, getRotationOrientationName } from '../../utils/visualPatternMath.js';
import { useAudio } from '../../hooks/useAudio.js';

const RULES = [
  {
    id: 'rot-90-cw',
    label: 'Rotate 90° CW each step',
    type: 'rotation',
    delta: 90,
    dir: 'clockwise',
    description: 'Each subsequent figure turns a quarter-turn (90°) clockwise.',
  },
  {
    id: 'rot-180',
    label: 'Rotate 180° each step',
    type: 'rotation',
    delta: 180,
    dir: 'clockwise',
    description: 'Each figure turns a half-turn, alternating directions.',
  },
  {
    id: 'flip-v',
    label: 'Reflect vertically each step',
    type: 'reflection',
    axis: 'vertical',
    description: 'Each figure flips across a vertical mirror line.',
  },
];

export default function DesignTheMosaicPanel({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [selectedMotifIdx, setSelectedMotifIdx] = useState(2); // Arrow
  const [selectedRuleId, setSelectedRuleId] = useState('rot-90-cw');
  const [predictedFig6, setPredictedFig6] = useState(null);
  const [isPredictionCorrect, setIsPredictionCorrect] = useState(false);

  const motif = MOTIF_CATALOG[selectedMotifIdx];
  const activeRule = RULES.find(r => r.id === selectedRuleId) || RULES[0];

  // Compute Figures 1–4
  const figures = [1, 2, 3, 4].map(n => {
    const stepIdx = n - 1;
    let angle = 0, flipH = false;
    if (activeRule.type === 'rotation') {
      angle = (stepIdx * activeRule.delta) % 360;
    } else {
      flipH = stepIdx % 2 === 1;
    }
    return { figNum: n, angle, flipH };
  });

  // True Figure 6 (stepIdx = 5)
  let trueFig6Angle = 0, trueFig6FlipH = false, targetDescription = '';
  if (activeRule.type === 'rotation') {
    trueFig6Angle = (5 * activeRule.delta) % 360;
    targetDescription = `${getRotationOrientationName(trueFig6Angle)} (${trueFig6Angle}°)`;
  } else {
    trueFig6FlipH = true; // 5 % 2 === 1
    targetDescription = 'Reflected (Flipped across vertical line)';
  }

  // Generate 4 UNIQUE candidate options — fixes duplicate bug
  let candidateOptions = [];
  if (activeRule.type === 'rotation') {
    // Use angle-based labels which are always unique
    candidateOptions = [0, 90, 180, 270].map(a =>
      `${getRotationOrientationName(a)} (${a}°)`
    );
  } else {
    candidateOptions = [
      'Reflected (Flipped across vertical line)',
      'Unchanged (Slid without flipping — translation)',
      'Rotated 180° upside down',
      'Rotated 90° clockwise',
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
    if (opt === targetDescription) {
      sounds.correct();
      setIsPredictionCorrect(true);
      narrate([{ text: `Brilliant spatial reasoning! You predicted Figure 6 correctly!`, style: 'celebration' }]);
    } else {
      sounds.wrong();
      setIsPredictionCorrect(false);
      narrate([{ text: 'Look at the cycle pattern again: calculate step-by-step.', style: 'encouragement' }]);
    }
  }

  function renderFigSvg(angle, flipH, size = 52) {
    const transform = `
      translate(50, 50)
      scale(${flipH ? -1 : 1}, 1)
      rotate(${angle})
      translate(-50, -50)
    `;
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <g transform={transform}>
          <rect width="90" height="90" x="5" y="5" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <path d={motif.svgPath} fill={motif.color} stroke={motif.accentColor || '#ffffff'} strokeWidth="3" strokeLinejoin="round" />
        </g>
      </svg>
    );
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🏛️ Station 3: Design the Mosaic Panel</h3>
        <span className="station-badge">Construction Lab</span>
      </div>

      <div className="station-grid-2col">
        {/* Left: Figure Gallery */}
        <div className="station-card-panel">
          <div className="panel-title"><span>📐</span> Figure Sequence (Rule: {activeRule.label})</div>

          {/* Figures 1–4 */}
          <div className="figure-gallery">
            {figures.map((fig, idx) => (
              <React.Fragment key={fig.figNum}>
                <div className="figure-card">
                  {renderFigSvg(fig.angle, fig.flipH, 52)}
                  <span className="figure-card-label">Fig {fig.figNum}</span>
                </div>
                {idx < figures.length - 1 && <span className="figure-arrow">→</span>}
              </React.Fragment>
            ))}
            <span className="figure-arrow">→</span>
            <div className="figure-card">
              <span className="figure-card-label">Fig 5</span>
              <span className="figure-card-label" style={{ fontSize: '0.65rem', color: '#94a3b8' }}>…</span>
            </div>
            <span className="figure-arrow">→</span>
            {/* Figure 6 mystery */}
            <div className={`figure-card mystery ${isPredictionCorrect ? '' : ''}`}>
              {isPredictionCorrect
                ? renderFigSvg(trueFig6Angle, trueFig6FlipH, 52)
                : <span style={{ fontSize: '1.6rem', opacity: 0.5 }}>❓</span>
              }
              <span className="figure-card-label gold">Fig 6</span>
            </div>
          </div>

          {/* Prediction */}
          <div className="panel-title"><span>🎯</span> Predict Figure 6:</div>
          <div className="prediction-grid">
            {candidateOptions.map(opt => (
              <button
                key={opt}
                className={`prediction-btn ${predictedFig6 === opt ? (isPredictionCorrect ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleSelectPrediction(opt)}
                disabled={isPredictionCorrect}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Rule Description */}
          <div className="hint-card">
            📖 Rule: {activeRule.description}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="station-card-panel">
          <div className="panel-title"><span>🎨</span> Design Settings</div>

          {/* Motif Selector */}
          <div className="controls-group">
            <span className="control-label">Base Motif:</span>
            <div className="tile-chips-row">
              {MOTIF_CATALOG.slice(0, 5).map((m, idx) => (
                <button
                  key={m.id}
                  className={`tile-chip ${selectedMotifIdx === idx ? 'active' : ''}`}
                  onClick={() => { sounds.click(); setSelectedMotifIdx(idx); setPredictedFig6(null); setIsPredictionCorrect(false); }}
                >
                  {m.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Rule Selector */}
          <div className="controls-group">
            <span className="control-label">Transformation Rule:</span>
            {RULES.map(r => (
              <button
                key={r.id}
                className={`control-toggle-btn ${selectedRuleId === r.id ? 'active' : ''}`}
                style={{ textAlign: 'left', padding: '8px 12px', width: '100%' }}
                onClick={() => handleRuleChange(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Success */}
          {isPredictionCorrect && (
            <div className="station-success-panel anim-bounce-in">
              <span className="success-text">🎉 Figure 6 Predicted Correctly!</span>
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
