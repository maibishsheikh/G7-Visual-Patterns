// src/components/simulations/SpotTheBrokenTile.jsx
// Station 4: Error-Detective — Spot the Broken Tile
// Student finds seeded mistakes and provides correct geometric fixes.

import React, { useState } from 'react';
import './Stations.css';
import { MOTIF_CATALOG } from '../../utils/visualPatternMath.js';
import { useAudio } from '../../hooks/useAudio.js';

const ERROR_SCENARIOS = [
  {
    id: 1,
    title: 'Flaw 1: The Reflection Slip-Up',
    description: 'Apprentice Wei Jie tried to reflect the L-tile across a vertical mirror at Step 3, but simply slid it without flipping (translation misconception)!',
    motif: MOTIF_CATALOG[0],
    flawedStepIndex: 2,
    flawType: 'translation-instead-of-reflection',
    tiles: [
      { step: 1, rotation: 0, flipH: false },
      { step: 2, rotation: 0, flipH: true },
      { step: 3, rotation: 0, flipH: false, isFlawed: true },
      { step: 4, rotation: 0, flipH: true },
      { step: 5, rotation: 0, flipH: false },
    ],
    correctionPrompt: 'What transformation is needed for Step 3?',
    options: [
      'Flip across vertical mirror line (True Reflection)',
      'Keep the slid copy without flipping (Translation)',
      'Rotate 180° upside down',
      'Shrink the tile by half',
    ],
    correctOption: 'Flip across vertical mirror line (True Reflection)',
    explanation: 'A reflection reverses left and right across the mirror line. Sliding without flipping is merely translation!',
  },
  {
    id: 2,
    title: 'Flaw 2: The Inverted Rotation',
    description: 'Apprentice Priya rotated the Arrow 90° clockwise each step, but turned it anti-clockwise at Step 4!',
    motif: MOTIF_CATALOG[2],
    flawedStepIndex: 3,
    flawType: 'wrong-direction',
    tiles: [
      { step: 1, rotation: 0, flipH: false },
      { step: 2, rotation: 90, flipH: false },
      { step: 3, rotation: 180, flipH: false },
      { step: 4, rotation: 90, flipH: false, isFlawed: true },
      { step: 5, rotation: 0, flipH: false },
    ],
    correctionPrompt: 'Which direction should the Arrow at Step 4 face (continuing 90° CW)?',
    options: [
      'Pointing Left (West) — 270° Clockwise',
      'Pointing Right (East) — 90° Anti-clockwise',
      'Pointing Up (North) — 0°',
      'Pointing Down (South) — 180°',
    ],
    correctOption: 'Pointing Left (West) — 270° Clockwise',
    explanation: '180° + 90° clockwise = 270° (pointing Left). Turning anti-clockwise gave Right (East)!',
  },
  {
    id: 3,
    title: 'Flaw 3: Symmetry Confusion',
    description: 'Apprentice Jun claimed the Pennant Flag has rotational symmetry of order 4, but confused line symmetry with rotational symmetry!',
    motif: MOTIF_CATALOG[1],
    flawedStepIndex: 1,
    flawType: 'symmetry-confusion',
    tiles: [
      { step: 1, rotation: 0, flipH: false },
      { step: 2, rotation: 0, flipH: false, isFlawed: true },
      { step: 3, rotation: 90, flipH: false },
      { step: 4, rotation: 180, flipH: false },
      { step: 5, rotation: 270, flipH: false },
    ],
    correctionPrompt: 'What is the actual rotational symmetry order of this asymmetric motif?',
    options: [
      'Order 1 (no rotational symmetry — asymmetric shape)',
      'Order 2 (180° matches)',
      'Order 4 (90° matches)',
      'Order 3 (120° matches)',
    ],
    correctOption: 'Order 1 (no rotational symmetry — asymmetric shape)',
    explanation: 'An asymmetric shape like the Pennant Flag has rotational symmetry order 1 — it only maps to itself at 360°.',
  },
];

export default function SpotTheBrokenTile({ onComplete, audioEnabled }) {
  const { narrate, sounds } = useAudio(audioEnabled);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [selectedTileIndex, setSelectedTileIndex] = useState(null);
  const [selectedCorrection, setSelectedCorrection] = useState(null);
  const [isRepaired, setIsRepaired] = useState(false);

  const scenario = ERROR_SCENARIOS[scenarioIdx];
  const foundFlaw = selectedTileIndex === scenario.flawedStepIndex;

  function handleTileClick(index) {
    sounds.click();
    setSelectedTileIndex(index);
    if (index === scenario.flawedStepIndex) {
      sounds.correct();
      narrate([{ text: 'You found the flawed tile! Now select the correct fix.', style: 'instruction' }]);
    } else {
      sounds.wrong();
      narrate([{ text: 'That tile follows the rule correctly. Look more closely at the transformations.', style: 'thinking' }]);
    }
  }

  function handleCorrectionSelect(opt) {
    setSelectedCorrection(opt);
    if (opt === scenario.correctOption) {
      sounds.correct();
      setIsRepaired(true);
      narrate([{ text: 'Flaw repaired! The mosaic is geometrically perfect!', style: 'celebration' }]);
    } else {
      sounds.wrong();
      narrate([{ text: 'Not the right fix. Think about the difference between these transformations!', style: 'encouragement' }]);
    }
  }

  function handleNextScenario() {
    sounds.correct();
    setScenarioIdx(prev => prev + 1);
    setSelectedTileIndex(null);
    setSelectedCorrection(null);
    setIsRepaired(false);
  }

  function renderTile(tile, idx) {
    const isFlawed = tile.isFlawed && !isRepaired;
    const isSelected = selectedTileIndex === idx;

    // After repair, show corrected version
    let tileRot = tile.rotation;
    let tileFlipH = tile.flipH;
    if (isRepaired && tile.isFlawed) {
      if (scenario.flawType === 'translation-instead-of-reflection') {
        tileFlipH = true;
      } else if (scenario.flawType === 'wrong-direction') {
        tileRot = 270;
      }
      // symmetry-confusion keeps the tile as-is (it's about understanding, not tile correction)
    }

    const transform = `
      translate(50, 50)
      scale(${tileFlipH ? -1 : 1}, 1)
      rotate(${tileRot})
      translate(-50, -50)
    `;

    const slotClass = [
      'mosaic-tile-slot',
      isSelected ? 'active' : '',
      isFlawed && isSelected ? 'flawed' : '',
      isRepaired && tile.isFlawed ? 'repaired' : '',
    ].filter(Boolean).join(' ');

    return (
      <div
        key={idx}
        className={slotClass}
        onClick={() => !isRepaired && handleTileClick(idx)}
        role="button"
        tabIndex={0}
        aria-label={`Tile Step ${tile.step}`}
      >
        <svg width={48} height={48} viewBox="0 0 100 100">
          <g transform={transform}>
            <rect width="90" height="90" x="5" y="5" rx="8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            <path
              d={scenario.motif.svgPath}
              fill={isRepaired && tile.isFlawed ? '#10b981' : isFlawed ? '#f43f5e' : scenario.motif.color}
              stroke={scenario.motif.accentColor || '#ffffff'}
              strokeWidth="3"
              strokeLinejoin="round"
            />
          </g>
        </svg>
        <span className="tile-step-label">S{tile.step}</span>
      </div>
    );
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔍 Station 4: Spot the Broken Tile</h3>
        <span className="station-round-badge">Flaw {scenarioIdx + 1}/{ERROR_SCENARIOS.length}</span>
      </div>

      <div className="station-grid-2col">
        {/* Left: Tile Strip + Description */}
        <div className="station-card-panel">
          <div className="panel-title"><span>🧩</span> {scenario.title}</div>

          {/* Description */}
          <div className="scenario-desc-card">
            {scenario.description}
          </div>

          {/* Tile Strip */}
          <div className="panel-title"><span>🔎</span> Click the broken tile:</div>
          <div className="tile-strip-row">
            {scenario.tiles.map((tile, idx) => renderTile(tile, idx))}
          </div>

          {/* Explanation after repair */}
          {isRepaired && (
            <div className="hint-card anim-slide-up">
              ✅ {scenario.explanation}
            </div>
          )}
        </div>

        {/* Right: Correction Options */}
        <div className="station-card-panel">
          <div className="panel-title"><span>🔧</span> Repair the Flaw</div>

          {!foundFlaw ? (
            <div className="scenario-desc-card">
              👆 First, click the tile you think is broken in the strip on the left.
            </div>
          ) : (
            <>
              <div className="scenario-desc-card">
                {scenario.correctionPrompt}
              </div>
              <div className="repair-options-grid">
                {scenario.options.map(opt => (
                  <button
                    key={opt}
                    className={`repair-btn ${selectedCorrection === opt ? (opt === scenario.correctOption ? 'correct' : 'wrong') : ''}`}
                    onClick={() => handleCorrectionSelect(opt)}
                    disabled={isRepaired}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Success + Next */}
          {isRepaired && (
            <div className="station-success-panel anim-bounce-in">
              <span className="success-text">🎉 Flaw #{scenarioIdx + 1} Repaired!</span>
              {scenarioIdx + 1 < ERROR_SCENARIOS.length ? (
                <button className="btn btn-primary btn-sm" onClick={handleNextScenario}>
                  Next Flaw ➔
                </button>
              ) : (
                <button className="btn btn-green btn-sm" onClick={onComplete}>
                  Complete Station 4 ✓
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
