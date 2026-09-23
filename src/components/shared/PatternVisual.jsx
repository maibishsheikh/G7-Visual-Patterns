// src/components/shared/PatternVisual.jsx
// Core visual rendering component for MosaicQuest (Grade 7 · Visual Patterns)
// Renders SVG mosaic strips, figure grids, rotation diagrams, reflection diagrams, and symmetry overlays.

import React from 'react';
import { MOTIF_CATALOG, getRotationOrientationName } from '../../utils/visualPatternMath.js';

function renderMotifSvg(motif, size = 60, rotation = 0, flipH = false, flipV = false) {
  const m = typeof motif === 'string' ? MOTIF_CATALOG.find((x) => x.id === motif) : motif;
  if (!m) return null;

  const color = m.color || '#C08497';
  const stroke = m.accentColor || '#ffffff';
  const scale = size / 100;

  // Center is (50, 50)
  const transform = `
    translate(50, 50)
    scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})
    rotate(${rotation})
    translate(-50, -50)
  `;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: 'block', overflow: 'visible' }}
      aria-label={`${m.name} rotated ${rotation} degrees`}
    >
      <g transform={transform}>
        <rect width="90" height="90" x="5" y="5" rx="10" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <path d={m.svgPath} fill={color} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
        {/* Subtle mosaic gloss line */}
        <line x1="15" y1="15" x2="85" y2="15" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function PatternVisual({ type, data, compact = false }) {
  if (!data) return null;

  // ── 1. MOTIF STRIP (Worlds 0–1) ──────────────────────────────────────────
  if (type === 'motif-strip') {
    const strip = data.strip || [];
    const missingSlot = data.missingSlot;

    return (
      <div
        className="pattern-visual-strip-wrap"
        style={{
          display: 'flex',
          gap: compact ? '8px' : '14px',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: compact ? '8px 12px' : '14px 20px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {strip.map((tile, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '6px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: tile.isCycleStart ? '1.5px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {renderMotifSvg(tile, compact ? 44 : 56, tile.rotation || 0, tile.flipH, tile.flipV)}
            <span
              style={{
                fontSize: compact ? '0.65rem' : '0.75rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: tile.isCycleStart ? 'var(--gold)' : 'var(--color-text-muted)',
              }}
            >
              Step {i + 1}
            </span>
          </div>
        ))}

        {missingSlot !== undefined && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: compact ? '56px' : '70px',
              height: compact ? '68px' : '84px',
              borderRadius: '12px',
              border: '2px dashed var(--gold)',
              background: 'rgba(245, 158, 11, 0.12)',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.25)',
            }}
          >
            <span style={{ fontSize: compact ? '1.3rem' : '1.8rem', fontWeight: 900, color: 'var(--gold)' }}>?</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--gold-light)' }}>
              Step {missingSlot + 1}
            </span>
          </div>
        )}
      </div>
    );
  }

  // ── 2. FIGURE GRID (Worlds 2–3) ──────────────────────────────────────────
  if (type === 'figure-grid') {
    const figures = data.figures || [];
    const isComparison = data.comparison;

    if (isComparison) {
      const borders = data.border || [];
      const filleds = data.filled || [];

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {/* Border Pattern Row */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--world-3)', marginBottom: '6px' }}>
              Pattern A: Border Square (Constant Growth)
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {borders.map((fig, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  {renderGridFigure(fig, compact ? 42 : 54, '#8AC926')}
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8AC926' }}>
                    Fig {fig.stage}: {fig.count} tiles (+4)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Filled Pattern Row */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--world-1)', marginBottom: '6px' }}>
              Pattern B: Filled Square (Increasing Growth)
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {filleds.map((fig, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  {renderGridFigure(fig, compact ? 42 : 54, '#6A4C93')}
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#c4b5fd' }}>
                    Fig {fig.stage}: {fig.count} tiles ({idx === 0 ? '1' : idx === 1 ? '+3' : '+5'})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          display: 'flex',
          gap: compact ? '12px' : '20px',
          justifyContent: 'center',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          padding: compact ? '8px 14px' : '14px 20px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {figures.map((fig, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '6px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {renderGridFigure(fig, compact ? 48 : 64, data.kind === 'filled-square' ? '#6A4C93' : '#1982C4')}
            <span style={{ fontSize: compact ? '0.75rem' : '0.85rem', fontWeight: 800, color: 'var(--gold)' }}>
              Figure {fig.stage}: {fig.count} tiles
            </span>
          </div>
        ))}
      </div>
    );
  }

  // ── 3. ROTATION DIAGRAM (World 4, 7) ──────────────────────────────────────
  if (type === 'rotation-diagram') {
    const motif = data.motif || MOTIF_CATALOG[2];
    const angle = data.angle || 90;
    const direction = data.direction || 'clockwise';
    const finalAngle = data.finalAngle !== undefined ? data.finalAngle : angle;
    const steps = data.steps || 1;

    return (
      <div
        style={{
          display: 'flex',
          gap: compact ? '12px' : '24px',
          justifyContent: 'center',
          alignItems: 'center',
          padding: compact ? '10px 14px' : '16px 24px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {/* Start Orientation */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)' }}>Start</span>
          {renderMotifSvg(motif, compact ? 50 : 68, data.startAngle || 0)}
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>Pointing Up</span>
        </div>

        {/* Rotation Arc & Direction Indicator (Never color-only!) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '4px 10px',
            borderRadius: '10px',
            background: 'rgba(255, 202, 58, 0.12)',
            border: '1px solid rgba(255, 202, 58, 0.3)',
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>{direction === 'clockwise' ? '↷' : '↶'}</span>
          <span style={{ fontSize: compact ? '0.75rem' : '0.85rem', fontWeight: 900, color: 'var(--gold)' }}>
            {angle}° {direction.toUpperCase()}
          </span>
          {steps > 1 && (
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--gold-light)' }}>
              ({steps} step{steps > 1 ? 's' : ''})
            </span>
          )}
        </div>

        {/* Final Rotated Orientation */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--green-light)' }}>Result</span>
          {renderMotifSvg(motif, compact ? 50 : 68, finalAngle)}
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--green-light)' }}>
            {getRotationOrientationName(finalAngle)}
          </span>
        </div>
      </div>
    );
  }

  // ── 4. REFLECTION DIAGRAM (World 5) ──────────────────────────────────────
  if (type === 'reflection-diagram') {
    const motif = data.motif || MOTIF_CATALOG[0];
    const mirrorLine = data.mirrorLine || 'vertical';
    const isVertical = mirrorLine === 'vertical';

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: isVertical ? 'row' : 'column',
          gap: compact ? '12px' : '20px',
          justifyContent: 'center',
          alignItems: 'center',
          padding: compact ? '10px 14px' : '16px 24px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {/* Original Tile */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)' }}>Original Tile</span>
          {renderMotifSvg(motif, compact ? 52 : 70, 0, false, false)}
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-text-dim)' }}>Face: Left</span>
        </div>

        {/* Mirror Line */}
        <div
          style={{
            display: 'flex',
            flexDirection: isVertical ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
        >
          <div
            style={{
              width: isVertical ? '3px' : '140px',
              height: isVertical ? '80px' : '3px',
              borderLeft: isVertical ? '3px dashed #52B788' : 'none',
              borderTop: !isVertical ? '3px dashed #52B788' : 'none',
              boxShadow: '0 0 10px rgba(82, 183, 136, 0.5)',
            }}
          />
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#52B788',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            🪞 {mirrorLine} mirror line
          </span>
        </div>

        {/* Reflected Tile */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#52B788' }}>Reflected Tile (Flipped)</span>
          {renderMotifSvg(motif, compact ? 52 : 70, 0, isVertical, !isVertical)}
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#6ee7b7' }}>Face: Reversed</span>
        </div>
      </div>
    );
  }

  // ── 5. SYMMETRY OVERLAY (World 6, 9) ─────────────────────────────────────
  if (type === 'symmetry-overlay') {
    const motif = data.motif || MOTIF_CATALOG[5];
    const lines = data.linesCount || 5;
    const rotOrder = data.rotOrder || 5;

    return (
      <div
        style={{
          display: 'flex',
          gap: compact ? '12px' : '20px',
          justifyContent: 'center',
          alignItems: 'center',
          padding: compact ? '10px 14px' : '16px 24px',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {renderMotifSvg(motif, compact ? 70 : 90)}
          {/* Center Rotation Axis Dot */}
          <div
            style={{
              position: 'absolute',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#F15BB5',
              boxShadow: '0 0 12px #F15BB5',
            }}
            title="Center of Rotational Symmetry"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(241, 91, 181, 0.15)',
              border: '1px solid rgba(241, 91, 181, 0.35)',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#F15BB5',
            }}
          >
            <span>⚖️</span> {lines} Lines of Symmetry
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(25, 130, 196, 0.15)',
              border: '1px solid rgba(25, 130, 196, 0.35)',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#38bdf8',
            }}
          >
            <span>🌀</span> Order {rotOrder} Rotational Symmetry ({360 / rotOrder}°)
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/**
 * Grid rendering helper for growing figures (border square / filled square)
 */
function renderGridFigure(fig, size, tileColor) {
  if (!fig || !fig.tiles) return null;
  const side = fig.side || 2;
  const cellSize = (size - (side - 1) * 2) / side;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${side}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${side}, ${cellSize}px)`,
        gap: '2px',
        padding: '3px',
        borderRadius: '8px',
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      {Array.from({ length: side * side }).map((_, i) => {
        const r = Math.floor(i / side);
        const c = i % side;
        const isTile = fig.tiles.some((t) => t.r === r && t.c === c);

        return (
          <div
            key={i}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              borderRadius: '3px',
              background: isTile ? tileColor : 'transparent',
              border: isTile ? '1px solid rgba(255,255,255,0.4)' : '1px dashed rgba(255,255,255,0.06)',
              boxShadow: isTile ? '0 0 6px rgba(0,0,0,0.3)' : 'none',
            }}
          />
        );
      })}
    </div>
  );
}
