// src/utils/visualPatternMath.js
// Pure geometric and mathematical helpers for MosaicQuest (Grade 7 · Visual Patterns)
// Serves as the single source of truth for all rotations, reflections, and growth figures.

export const CLEAN_ROTATION_ANGLES = [90, 180, 270];
export const CLEAN_CYCLE_LENGTHS = [2, 3, 4];

export const MOTIF_CATALOG = [
  {
    id: 'l-tile',
    name: 'L-Tromino Tile',
    kind: 'asymmetric',
    baseAngle: 0,
    hasLineSymmetry: false,
    rotationalSymmetryOrder: 1,
    svgPath: 'M 20 20 L 50 20 L 50 50 L 80 50 L 80 80 L 20 80 Z',
    color: '#C08497',
    accentColor: '#8a4b60',
  },
  {
    id: 'flag-tile',
    name: 'Pennant Flag Tile',
    kind: 'asymmetric',
    baseAngle: 0,
    hasLineSymmetry: false,
    rotationalSymmetryOrder: 1,
    svgPath: 'M 25 15 L 75 35 L 25 55 L 25 85 L 15 85 L 15 15 Z',
    color: '#FFCA3A',
    accentColor: '#d49b06',
  },
  {
    id: 'arrow-tile',
    name: 'Mosaic Arrow',
    kind: 'line-symmetric',
    baseAngle: 0, // points UP
    hasLineSymmetry: true,
    symmetryAxes: ['vertical'],
    rotationalSymmetryOrder: 1,
    svgPath: 'M 50 15 L 85 50 L 62 50 L 62 85 L 38 85 L 38 50 L 15 50 Z',
    color: '#1982C4',
    accentColor: '#0f527d',
  },
  {
    id: 'wedge-tile',
    name: 'Corner Wedge',
    kind: 'asymmetric',
    baseAngle: 0,
    hasLineSymmetry: false,
    rotationalSymmetryOrder: 1,
    svgPath: 'M 15 15 L 85 15 L 85 45 L 45 45 L 45 85 L 15 85 Z',
    color: '#6A4C93',
    accentColor: '#432f5f',
  },
  {
    id: 'spiral-tile',
    name: 'Glazed Spiral Hook',
    kind: 'asymmetric',
    baseAngle: 0,
    hasLineSymmetry: false,
    rotationalSymmetryOrder: 1,
    svgPath: 'M 20 20 L 80 20 L 80 80 L 50 80 L 50 50 L 35 50 L 35 35 L 65 35 L 65 65 L 20 65 Z',
    color: '#52B788',
    accentColor: '#2d6a4f',
  },
  {
    id: 'regular-pentagon',
    name: 'Regular Pentagon',
    kind: 'symmetric',
    baseAngle: 0,
    hasLineSymmetry: true,
    symmetryLineCount: 5,
    symmetryAxes: ['vertical', 'radial-5'],
    rotationalSymmetryOrder: 5,
    svgPath: 'M 50 12 L 88 40 L 73 85 L 27 85 L 12 40 Z',
    color: '#F15BB5',
    accentColor: '#b01e74',
  },
  {
    id: 'diamond-gem',
    name: 'Mosaic Rhombus',
    kind: 'symmetric',
    baseAngle: 0,
    hasLineSymmetry: true,
    symmetryLineCount: 2,
    symmetryAxes: ['vertical', 'horizontal'],
    rotationalSymmetryOrder: 2,
    svgPath: 'M 50 12 L 85 50 L 50 88 L 15 50 Z',
    color: '#4D908E',
    accentColor: '#2b5857',
  },
];

/**
 * Returns a clean rotation angle from {90, 180, 270}
 */
export function pickCleanRotationAngle() {
  const idx = Math.floor(Math.random() * CLEAN_ROTATION_ANGLES.length);
  return CLEAN_ROTATION_ANGLES[idx];
}

/**
 * Returns a clean cycle length from {2, 3, 4}
 */
export function pickCleanCycleLength() {
  const idx = Math.floor(Math.random() * CLEAN_CYCLE_LENGTHS.length);
  return CLEAN_CYCLE_LENGTHS[idx];
}

/**
 * Generates a repeating sequence of motifs for a given cycle
 */
export function generateRepeatingPattern(motifs, cycleLength, visibleLength = 6) {
  const activeCycle = motifs.slice(0, cycleLength);
  const result = [];
  for (let i = 0; i < visibleLength; i++) {
    const motif = activeCycle[i % cycleLength];
    result.push({
      ...motif,
      stepIndex: i,
      isCycleStart: i % cycleLength === 0,
    });
  }
  return result;
}

/**
 * Apply rotation transform to a motif descriptor
 * @param {Object} motifDescriptor
 * @param {number} angle (e.g. 90, 180, 270)
 * @param {'clockwise'|'anticlockwise'} direction
 */
export function applyRotation(motifDescriptor, angle, direction = 'clockwise') {
  const currentAngle = motifDescriptor.rotation || 0;
  const delta = direction === 'anticlockwise' ? (360 - (angle % 360)) % 360 : angle % 360;
  const newAngle = (currentAngle + delta) % 360;

  return {
    ...motifDescriptor,
    rotation: newAngle,
    lastTransform: {
      type: 'rotation',
      angle,
      direction,
      totalAngle: newAngle,
    },
  };
}

/**
 * Apply reflection (flip) transform across a specified mirror line
 * @param {Object} motifDescriptor
 * @param {'vertical'|'horizontal'} mirrorLine
 */
export function applyReflection(motifDescriptor, mirrorLine = 'vertical') {
  const flipH = motifDescriptor.flipH || false;
  const flipV = motifDescriptor.flipV || false;

  return {
    ...motifDescriptor,
    flipH: mirrorLine === 'vertical' ? !flipH : flipH,
    flipV: mirrorLine === 'horizontal' ? !flipV : flipV,
    lastTransform: {
      type: 'reflection',
      mirrorLine,
    },
  };
}

/**
 * Apply translation (plain positional shift without reflection)
 * Used as the researched headline-misconception distractor!
 */
export function applyTranslation(motifDescriptor, offset = { x: 20, y: 0 }) {
  return {
    ...motifDescriptor,
    offsetX: (motifDescriptor.offsetX || 0) + offset.x,
    offsetY: (motifDescriptor.offsetY || 0) + offset.y,
    lastTransform: {
      type: 'translation',
      offset,
      isMisconceptionShift: true, // Note: Not reflected, just slid across!
    },
  };
}

/**
 * Growing figure generator for curated archetypes
 * Archetypes:
 * - 'border-square': Constant / linear growth (+4 tiles per stage)
 * - 'filled-square': Increasing / non-linear quadratic growth (1, 4, 9, 16...)
 */
export function generateGrowingFigure(kind, stage) {
  const s = Math.max(1, Math.min(stage, 5));

  if (kind === 'border-square') {
    // Stage 1: 2x2 border = 4 tiles
    // Stage 2: 3x3 border = 8 tiles
    // Stage 3: 4x4 border = 12 tiles
    // Stage 4: 5x5 border = 16 tiles
    const side = s + 1;
    const tiles = [];
    for (let r = 0; r < side; r++) {
      for (let c = 0; c < side; c++) {
        if (r === 0 || r === side - 1 || c === 0 || c === side - 1) {
          tiles.push({ r, c, active: true });
        }
      }
    }
    return {
      kind: 'border-square',
      stage: s,
      side,
      tiles,
      count: tiles.length,
      growthType: 'constant',
    };
  }

  if (kind === 'filled-square') {
    // Stage 1: 1x1 = 1 tile
    // Stage 2: 2x2 = 4 tiles
    // Stage 3: 3x3 = 9 tiles
    // Stage 4: 4x4 = 16 tiles
    const side = s;
    const tiles = [];
    for (let r = 0; r < side; r++) {
      for (let c = 0; c < side; c++) {
        tiles.push({ r, c, active: true });
      }
    }
    return {
      kind: 'filled-square',
      stage: s,
      side,
      tiles,
      count: tiles.length,
      growthType: 'increasing',
    };
  }

  // Fallback linear row
  return {
    kind: 'linear-strip',
    stage: s,
    count: s * 3 + 1,
    growthType: 'constant',
  };
}

/**
 * Exact tile/unit count for a growing figure stage
 * Pure numerical count without exposing or deriving algebraic formula (PRD §3).
 */
export function countGrowingFigureUnits(kind, stage) {
  if (kind === 'border-square') {
    // 4, 8, 12, 16...
    return (stage + 1) * 4 - 4; // 4 * stage
  }
  if (kind === 'filled-square') {
    // 1, 4, 9, 16, 25...
    return stage * stage;
  }
  return stage * 3 + 1;
}

/**
 * Evaluates line symmetry of a figure descriptor
 */
export function hasLineSymmetry(figureDescriptor, candidateLine = 'vertical') {
  if (!figureDescriptor) return false;
  if (figureDescriptor.hasLineSymmetry) {
    if (figureDescriptor.symmetryAxes?.includes(candidateLine)) return true;
    if (candidateLine === 'vertical' && figureDescriptor.symmetryAxes?.includes('vertical')) return true;
  }
  return false;
}

/**
 * Evaluates non-trivial rotational symmetry (excluding 0° / 360°)
 */
export function hasRotationalSymmetry(figureDescriptor, angle) {
  if (!figureDescriptor) return false;
  const order = figureDescriptor.rotationalSymmetryOrder || 1;
  if (order <= 1) return false;
  const fundamentalAngle = 360 / order;
  return (angle % fundamentalAngle) === 0 && angle % 360 !== 0;
}

/**
 * Classifies growth type: 'constant' vs 'increasing'
 */
export function classifyGrowthType(kind) {
  if (kind === 'border-square') return 'constant';
  if (kind === 'filled-square') return 'increasing';
  return 'constant';
}

/**
 * Direction cardinal helper
 */
export function getRotationOrientationName(angle) {
  const norm = ((angle % 360) + 360) % 360;
  if (norm === 0) return 'Pointing Up (North)';
  if (norm === 90) return 'Pointing Right (East)';
  if (norm === 180) return 'Pointing Down (South)';
  if (norm === 270) return 'Pointing Left (West)';
  return `${norm}°`;
}
