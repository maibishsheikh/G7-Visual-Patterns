// src/components/simulations/SpotTheBrokenTile.jsx
// Station 4: Error-Detective — Spot the Broken Tile
// Student finds a seeded mistake in an apprentice's pattern and provides the correct geometric fix.

import React, { useState } from 'react';
import './Stations.css';
import { MOTIF_CATALOG } from '../../utils/visualPatternMath.js';
import { useAudio } from '../../hooks/useAudio.js';

const ERROR_SCENARIOS = [
  {
    id: 1,
    title: 'Flaw 1: The Reflection Slip-Up',
    description: 'Apprentice Wei Jie attempted to reflect the L-tile across a vertical mirror line at Step 3, but simply slid the tile without flipping it (translation misconception)!',
    motif: MOTIF_CATALOG[0], // L-tile
    flawedStepIndex: 2, // 3rd tile (0-indexed 2)
    flawType: 'translation-instead-of-reflection',
    tiles: [
      { step: 1, rotation: 0, flipH: false },
      { step: 2, rotation: 0, flipH: true },
      { step: 3, rotation: 0, flipH: false, isFlawed: true }, // Should be flipH: false or alternating!
      { step: 4, rotation: 0, flipH: true },
      { step: 5, rotation: 0, flipH: false },
    ],
    correctionPrompt: 'What is the correct geometric transformation needed for Step 3?',
    options: [
      'Flip horizontally across the vertical mirror line (True Reflection)',
      'Keep the slid copy without flipping (Translation)',
      'Rotate 180° upside down',
      'Shrink the tile by half',
    ],
    correctOption: 'Flip horizontally across the vertical mirror line (True Reflection)',
    explanation: 'A reflection MUST reverse left and right across the mirror line. Sliding the tile without flipping is merely a translation!',
  },
  {
    id: 2,
    title: 'Flaw 2: The Inverted Rotation',
    description: 'Apprentice Priya tried to rotate the Arrow tile 90° clockwise at each step, but turned it anti-clockwise at Step 4!',
    motif: MOTIF_CATALOG[2], // Arrow
    flawedStepIndex: 3, // 4th tile
    flawType: 'wrong-direction',
    tiles: [
      { step: 1, rotation: 0, flipH: false },
      { step: 2, rotation: 90, flipH: false },
      { step: 3, rotation: 180, flipH: false },
      { step: 4, rotation: 90, flipH: false, isFlawed: true }, // Should be 270° (Left), but turned anti-clockwise to 90° (Right)!
      { step: 5, rotation: 0, flipH: false },
    ],
    correctionPrompt: 'Which way should the Arrow at Step 4 face if continuing 90° clockwise?',
    options: [
      'Pointing Left (West) — 270° Clockwise',
      'Pointing Right (East) — 90° Anti-clockwise',
      'Pointing Up (North) — 0°',
      'Pointing Down (South) — 180°',
    ],
    correctOption: 'Pointing Left (West) — 270° Clockwise',
    explanation: '180° + 90° clockwise = 270° (pointing Left). Turning anti-clockwise resulted in pointing Right (East), which broke the sequence!',
  },
];

export default function SpotTheBrokenTile({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selectedTileIndex, setSelectedTileIndex] = useState(null);
  const [selectedCorrection, setSelectedCorrection] = useState(null);
  const [isRepaired, setIsRepaired] = useState(false);

  const scenario = ERROR_SCENARIOS[scenarioIdx];

  function handleTileClick(index) {
    sounds.click();
    setSelectedTileIndex(index);
    if (index === scenario.flawedStepIndex) {
      sounds.correct();
      narrate([{ text: "You found the flawed tile! Now select the correct replacement.", style: 'instruction' }]);
    } else {
      sounds.wrong();
      narrate([{ text: "That tile follows the rule correctly. Look closely at the transformations along the strip.", style: 'thinking' }]);
    }
  }

  function handleCorrectionSelect(opt) {
    setSelectedCorrection(opt);
    if (opt === scenario.correctOption) {
      sounds.correct();
      setIsRepaired(true);
      narrate([{ text: "Flaw repaired! The mosaic panel is geometrically perfect!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      narrate([{ text: "Not quite the right fix. Remember the difference between a reflection and a slide!", style: 'encouragement' }]);
    }
  }

  function handleNextScenario() {
    sounds.correct();
    setScenarioIdx((prev) => prev + 1);
    setSelectedTileIndex(null);
    setSelectedCorrection(null);
    setIsRepaired(false);
  }

  function renderTile(tile, idx) {
    const isFlawed = tile.isFlawed && !isRepaired;
    const isSelected = selectedTileIndex === idx;

    const transform = `
      translate(50, 50)
      scale(${isRepaired && isFlawed ? (scenario.flawType === 'translation-instead-of-reflection' ? -1 : 1) : tile.flipH ? -1 : 1}, 1)
      rotate(${isRepaired && isFlawed ? (scenario.flawType === 'wrong-direction' ? 270 : tile.rotation) : tile.rotation})
      translate(-50, -50)
    `;

    return (
      <div
        key={idx}
        className={`mosaic-tile-slot clickable ${isSelected ? 'active' : ''} ${isFlawed && isSelected ? 'flawed' : ''}`}
        onClick={() => handleTileClick(idx)}
        role="button"
        tabIndex={0}
        aria-label={`Tile Step ${tile.step}`}
      >
        <svg width={46} height={46} viewBox="0 0 100 100">
          <g transform={transform}>
            <rect width="90" height="90" x="5" y="5" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            <path
              d={scenario.motif.svgPath}
              fill={isRepaired && isFlawed ? '#10b981' : isFlawed ? '#f43f5e' : scenario.motif.color}
              stroke={scenario.motif.accentColor || '#ffffff'}
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        <span
          style={{
            position: 'absolute',
            bottom: '2px',
            fontSize: '0.62rem',
            fontWeight: 800,
            color: isSelected ? 'var(--gold)' : 'var(--color-text-dim)',
          }}
        >
          Step {tile.step}
        </span>
      </div>
    );
  }

  return (
    <div className="station-wrap">
      {/* Station Header */}
      <div className="station-header">
        <h3 className="station-title">
          <span>🔍</span> Station 4: Spot the Broken Tile
        </h3>
        <span className="station-badge">Error-Detective Lab</span>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Defective Pattern Strip */}
        <div className="station-card-panel">
          <div className="panel-title">
            <span>🔎</span> Apprentice's Attempted Pattern: Tap the Broken Tile!
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
            {scenario.description}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px',
              background: 'rgba(10, 14, 30, 0.7)',
              borderRadius: '14px',
              border: '1.5px solid rgba(255, 255, 255, 0.12)',
              flexWrap: 'wrap',
            }}
          >
            {scenario.tiles.map((tile, idx) => renderTile(tile, idx))}
          </div>

          <div
            style={{
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>💡</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {selectedTileIndex === null
                ? 'Tap on the tile along the strip that contains the mistake.'
                : selectedTileIndex === scenario.flawedStepIndex
                ? 'Flawed tile identified! Now select the correct replacement on the right.'
                : 'That tile is correct. Inspect the other steps for the flaw.'}
            </span>
          </div>
        </div>

        {/* Right Column: Correction Selection */}
        <div className="station-card-panel">
          <div className="panel-title">
            <span>🔧</span> Supply the Master Repair
          </div>

          {selectedTileIndex === scenario.flawedStepIndex ? (
            <div className="controls-group anim-slide-up">
              <span className="control-label" style={{ color: 'var(--gold-light)' }}>
                {scenario.correctionPrompt}
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                {scenario.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm ${selectedCorrection === opt ? (isRepaired ? 'btn-green' : 'btn-outline') : 'btn-outline'}`}
                    style={{
                      fontSize: '0.8rem',
                      padding: '8px 12px',
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      whiteSpace: 'normal',
                    }}
                    onClick={() => handleCorrectionSelect(opt)}
                  >
                    <span>{String.fromCharCode(65 + i)}:</span>
                    <span>{opt}</span>
                  </button>
                ))}
              </div>

              {isRepaired && (
                <div className="station-success-panel anim-slide-up" style={{ padding: '10px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--green-light)' }}>
                    ✅ Flaw Repaired! {scenario.explanation}
                  </span>
                  {scenarioIdx + 1 < ERROR_SCENARIOS.length ? (
                    <button className="btn btn-primary btn-sm" onClick={handleNextScenario}>
                      Next Defective Panel ➔
                    </button>
                  ) : (
                    <button className="btn btn-green btn-sm" onClick={onComplete}>
                      Complete Station 4 ✓
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                color: 'var(--color-text-dim)',
                textAlign: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '2rem' }}>🔍</span>
              <span style={{ fontSize: '0.85rem' }}>
                Tap the flawed tile on the mosaic strip to unlock the repair toolkit!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
