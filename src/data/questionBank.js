// src/data/questionBank.js
// Procedural question bank generator for MosaicQuest (Grade 7 · Visual Patterns)
// Generates 100 questions across 10 worlds with 4 options per question.

import { WORLDS } from '../config/worlds.config.js';
import {
  MOTIF_CATALOG,
  CLEAN_ROTATION_ANGLES,
  CLEAN_CYCLE_LENGTHS,
  generateRepeatingPattern,
  applyRotation,
  applyReflection,
  applyTranslation,
  generateGrowingFigure,
  countGrowingFigureUnits,
  getRotationOrientationName,
} from '../utils/visualPatternMath.js';

export const DISTRICTS = WORLDS.map((w) => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  boss: w.boss,
}));

function shuffleArray(arr, seed = 42) {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Builds the 100 procedural questions across 10 worlds.
 */
export function generateQuestionBank() {
  const bank = [];
  let globalId = 1;

  for (let d = 0; d < 10; d++) {
    const world = WORLDS[d];

    for (let q = 0; q < 10; q++) {
      const qNumInWorld = q + 1;
      let questionObj = null;

      switch (world.conceptFocus) {
        // ── WORLD 0: Identify & Extend Repeating Patterns ───────────────────
        case 'identify-extend-repeating-pattern': {
          const cycleLength = (q % 3) + 2; // 2, 3, or 4
          const motifs = [
            MOTIF_CATALOG[0], // L-tile
            MOTIF_CATALOG[1], // flag
            MOTIF_CATALOG[2], // arrow
            MOTIF_CATALOG[4], // spiral
          ].slice(0, cycleLength);

          const totalVisible = cycleLength * 2 + 1;
          const patternStrip = generateRepeatingPattern(motifs, cycleLength, totalVisible);
          const targetIndex = totalVisible; // The next tile to place
          const correctMotif = motifs[targetIndex % cycleLength];

          // Distractors from other cycle positions
          const distractor1 = motifs[(targetIndex - 1 + cycleLength) % cycleLength];
          const distractor2 = motifs[(targetIndex + 1) % cycleLength] || MOTIF_CATALOG[5];
          const distractor3 = MOTIF_CATALOG[3]; // wedge

          const rawOptions = [correctMotif.name, distractor1.name, distractor2.name, distractor3.name];
          const uniqueOptions = [...new Set(rawOptions)];
          for (const m of MOTIF_CATALOG) {
            if (uniqueOptions.length >= 4) break;
            if (!uniqueOptions.includes(m.name)) uniqueOptions.push(m.name);
          }
          const options = shuffleArray(uniqueOptions.slice(0, 4), globalId);

          questionObj = {
            id: globalId,
            districtId: d,
            category: 'REPEATING PATTERN',
            visual: 'motif-strip',
            questionText: `Look at the repeating mosaic strip with cycle length ${cycleLength}. Which motif comes next at Step ${targetIndex + 1}?`,
            options,
            correctAnswer: correctMotif.name,
            explanation: `The motif cycle is ${cycleLength} tiles long (${motifs.map((m) => m.name).join(' ➔ ')}). Step ${targetIndex + 1} begins a cycle repeat with the ${correctMotif.name}.`,
            hint1: `Identify the repeating unit (motif): how many tiles before the sequence starts over?`,
            hint2: `Count the steps in groups of ${cycleLength}. The remainder tells you exactly which tile comes next.`,
            visualData: {
              strip: patternStrip,
              cycleLength,
              missingSlot: targetIndex,
            },
          };
          break;
        }

        // ── WORLD 1: Growing vs Repeating Classification ────────────────────
        case 'growing-vs-repeating': {
          const isRepeating = q % 2 === 0;
          let questionText = '';
          let correctAnswer = '';
          let distractors = [];
          let explanation = '';
          let visualData = null;

          if (isRepeating) {
            const cycle = (q % 2) + 2;
            const motifs = [MOTIF_CATALOG[2], MOTIF_CATALOG[1], MOTIF_CATALOG[4]].slice(0, cycle);
            const strip = generateRepeatingPattern(motifs, cycle, 6);
            questionText = `Examine this mosaic strip. Is it a repeating pattern or a growing pattern, and why?`;
            correctAnswer = `Repeating — the same ${cycle}-tile cycle repeats without getting larger`;
            distractors = [
              `Growing — because more tiles appear as the strip continues to the right`,
              `Growing — each repeat adds new surface area to each tile`,
              `Neither — visual patterns can only be growing, not repeating`,
            ];
            explanation = `A repeating pattern cycles through a fixed set of states without increasing in size. A growing pattern expands in quantity or dimensions at each step.`;
            visualData = { strip, cycleLength: cycle };
          } else {
            const stage = (q % 3) + 1;
            const fig = generateGrowingFigure('border-square', stage);
            questionText = `Examine the sequence of figures: Figure 1 has 4 tiles, Figure 2 has 8 tiles, Figure 3 has 12 tiles. Is this repeating or growing?`;
            correctAnswer = `Growing — each new figure adds 4 additional border tiles`;
            distractors = [
              `Repeating — because all figures are square shaped`,
              `Repeating — the border pattern repeats around the edges without growing`,
              `Neither — a pattern must rotate to be considered growing`,
            ];
            explanation = `Because the tile count increases systematically with each figure (+4 tiles per step), this is a growing pattern.`;
            visualData = {
              figures: [
                generateGrowingFigure('border-square', 1),
                generateGrowingFigure('border-square', 2),
                generateGrowingFigure('border-square', 3),
              ],
            };
          }

          const options = shuffleArray([correctAnswer, ...distractors], globalId);
          questionObj = {
            id: globalId,
            districtId: d,
            category: 'PATTERN CLASSIFICATION',
            visual: isRepeating ? 'motif-strip' : 'figure-grid',
            questionText,
            options,
            correctAnswer,
            explanation,
            hint1: `Check whether each figure stays the same size or increases in tile count.`,
            hint2: `Do not mistake a repeating strip getting longer for a shape getting bigger!`,
            visualData,
          };
          break;
        }

        // ── WORLD 2: Counting Growing Figures (No Formulas!) ────────────────
        case 'represent-growing-pattern-numerically': {
          const kind = q < 5 ? 'border-square' : 'filled-square';
          const targetStage = (q % 3) + 3; // ask for Stage 3, 4, or 5
          const count1 = countGrowingFigureUnits(kind, 1);
          const count2 = countGrowingFigureUnits(kind, 2);
          const count3 = countGrowingFigureUnits(kind, 3);
          const targetCount = countGrowingFigureUnits(kind, targetStage);

          const distractor1 = String(targetCount + (kind === 'border-square' ? 2 : 3));
          const distractor2 = String(targetCount - (kind === 'border-square' ? 2 : 2));
          const distractor3 = String(targetCount + 4);

          const optSet = new Set([String(targetCount), distractor1, distractor2, distractor3]);
          let delta = 1;
          while (optSet.size < 4) {
            optSet.add(String(targetCount + delta));
            delta++;
          }
          const options = shuffleArray([...optSet], globalId);

          questionObj = {
            id: globalId,
            districtId: d,
            category: 'COUNTING TILES',
            visual: 'figure-grid',
            questionText: `Figure 1 has ${count1} tiles, Figure 2 has ${count2} tiles, Figure 3 has ${count3} tiles. By continuing the count, how many tiles are in Figure ${targetStage}?`,
            options,
            correctAnswer: String(targetCount),
            explanation:
              kind === 'border-square'
                ? `Each stage adds 4 border tiles (+4 constant growth). Figure ${targetStage} has ${targetCount} tiles.`
                : `Stage 1 has 1 tile (1×1), Stage 2 has 4 (2×2), Stage 3 has 9 (3×3). Figure ${targetStage} has ${targetStage}×${targetStage} = ${targetCount} tiles.`,
            hint1: `Find the difference in tile count between consecutive figures.`,
            hint2: `Record the counts: ${count1}, ${count2}, ${count3}… continue the counting pattern step-by-step.`,
            visualData: {
              kind,
              figures: [
                generateGrowingFigure(kind, 1),
                generateGrowingFigure(kind, 2),
                generateGrowingFigure(kind, 3),
              ],
            },
          };
          break;
        }

        // ── WORLD 3: Compare Growth Types (Constant vs Increasing) ───────────
        case 'compare-growth-types': {
          const questions = [
            {
              q: `Which mosaic pattern grows by a constant amount each step, and which grows by an increasing amount?`,
              c: `Border square grows by a constant amount (+4); filled square grows by an increasing amount`,
              d: [
                `Filled square grows by a constant amount; border square grows by an increasing amount`,
                `Both patterns grow by the exact same constant amount each step`,
                `Neither pattern grows; both are cyclical repeating motifs`,
              ],
              exp: `A border ring adds exactly 4 tiles every step (constant/linear growth). A filled square expands in both width and height, adding +3, then +5, then +7 tiles (increasing growth).`,
            },
            {
              q: `Notice the growth of the border square: 4, 8, 12, 16. How does the tile count increase from figure to figure?`,
              c: `It increases by the same constant amount (+4) at every step`,
              d: [
                `It doubles at every step`,
                `The amount added gets larger and larger each step`,
                `It increases randomly with no set pattern`,
              ],
              exp: `8 - 4 = 4; 12 - 8 = 4; 16 - 12 = 4. The difference is constant (+4).`,
            },
            {
              q: `In the filled-square mosaic (1, 4, 9, 16 tiles), what happens to the number of tiles added between consecutive stages?`,
              c: `The difference increases: +3 tiles, then +5 tiles, then +7 tiles`,
              d: [
                `The difference stays constant at +3 tiles every time`,
                `The difference decreases: each step adds fewer tiles than before`,
                `The difference alternates between +1 and +2 tiles`,
              ],
              exp: `4 - 1 = +3, 9 - 4 = +5, 16 - 9 = +7. The growth amount itself is increasing!`,
            },
          ];

          const item = questions[q % questions.length];
          const options = shuffleArray([item.c, ...item.d], globalId);

          questionObj = {
            id: globalId,
            districtId: d,
            category: 'GROWTH TYPES',
            visual: 'figure-grid',
            questionText: item.q,
            options,
            correctAnswer: item.c,
            explanation: item.exp,
            hint1: `Calculate the step-by-step difference between consecutive figures for both patterns.`,
            hint2: `Constant growth adds the exact same number each time. Increasing growth adds a bigger batch each time.`,
            visualData: {
              comparison: true,
              border: [generateGrowingFigure('border-square', 1), generateGrowingFigure('border-square', 2), generateGrowingFigure('border-square', 3)],
              filled: [generateGrowingFigure('filled-square', 1), generateGrowingFigure('filled-square', 2), generateGrowingFigure('filled-square', 3)],
            },
          };
          break;
        }

        // ── WORLD 4: Rotation Patterns (Clockwise & Anti-clockwise) ──────────
        case 'rotation-patterns': {
          const angles = [90, 180, 270];
          const angle = angles[q % angles.length];
          const direction = q % 2 === 0 ? 'clockwise' : 'anticlockwise';
          const steps = (q % 3) + 1; // 1, 2, or 3 steps
          const motif = MOTIF_CATALOG[2]; // Arrow tile (points UP at 0°)

          // True transform:
          const totalAngle =
            direction === 'clockwise'
              ? (angle * steps) % 360
              : (360 - ((angle * steps) % 360)) % 360;

          const correctOrient = getRotationOrientationName(totalAngle);

          // Headline distractor: Inverted direction (anti-clockwise when clockwise was asked!)
          const wrongDirectionAngle =
            direction === 'clockwise'
              ? (360 - ((angle * steps) % 360)) % 360
              : (angle * steps) % 360;
          const distractor1 = getRotationOrientationName(wrongDirectionAngle);

          // Distractor 2: One step off
          const offByOneAngle = (totalAngle + 90) % 360;
          const distractor2 = getRotationOrientationName(offByOneAngle);

          // Distractor 3: Opposite orientation
          const oppositeAngle = (totalAngle + 180) % 360;
          const distractor3 = getRotationOrientationName(oppositeAngle);

          const allCardinals = [
            'Pointing Up (North)',
            'Pointing Right (East)',
            'Pointing Down (South)',
            'Pointing Left (West)',
          ];
          const options = shuffleArray(allCardinals, globalId);

          const rotDesc = angle === 90 ? 'a quarter-turn (90°)' : angle === 180 ? 'a half-turn (180°)' : 'a three-quarter turn (270°)';

          questionObj = {
            id: globalId,
            districtId: d,
            category: 'ROTATION PATTERNS',
            visual: 'rotation-diagram',
            questionText: `A motif tile starts pointing Up (North). It rotates ${rotDesc} ${direction} at each step. Which direction does it face after ${steps} step${steps > 1 ? 's' : ''}?`,
            options,
            correctAnswer: correctOrient,
            explanation: `Turning ${angle}° ${direction} for ${steps} step(s) rotates the motif by a total of ${steps * angle}° ${direction}, ending up ${correctOrient}.`,
            hint1: `Visualize turning clockwise like clock hands (to the right) or anti-clockwise (to the left).`,
            hint2: `Multiply the angle per step (${angle}°) by the number of steps (${steps}).`,
            visualData: {
              motif,
              angle,
              direction,
              steps,
              startAngle: 0,
              finalAngle: totalAngle,
            },
          };
          break;
        }

        // ── WORLD 5: Reflection Patterns (Mirror Line vs Translation) ───────
        case 'reflection-patterns': {
          const mirrorLine = q % 2 === 0 ? 'vertical' : 'horizontal';
          const motif = MOTIF_CATALOG[0]; // L-tile (distinctly asymmetric!)

          const correctReflected = applyReflection(motif, mirrorLine);
          const translatedDistractor = applyTranslation(motif, { x: 30, y: 0 }); // Headline misconception!

          const correctAnswer = `Option A: Flipped across the ${mirrorLine} mirror line (true reflection)`;
          const distractor1 = `Option B: Slid across the line without flipping (translation)`;
          const distractor2 = `Option C: Rotated 180° rather than reflected`;
          const distractor3 = `Option D: Inverted in size rather than mirrored`;

          const options = shuffleArray([correctAnswer, distractor1, distractor2, distractor3], globalId);

          questionObj = {
            id: globalId,
            districtId: d,
            category: 'REFLECTION PATTERNS',
            visual: 'reflection-diagram',
            questionText: `Which option correctly shows the mosaic tile reflected (flipped) across the dashed ${mirrorLine} mirror line?`,
            options,
            correctAnswer,
            explanation: `A reflection produces a mirror image where left and right (or top and bottom) are reversed across the mirror line. Sliding the shape across without flipping is a translation, NOT a reflection!`,
            hint1: `Check the orientation of the L-tile's corner. In a reflection across a vertical line, an arm pointing right must flip to point left!`,
            hint2: `Beware the common mistake of picking a tile that was simply slid (translated) without being flipped.`,
            visualData: {
              motif,
              mirrorLine,
              candidateCorrect: correctReflected,
              candidateTranslation: translatedDistractor,
            },
          };
          break;
        }

        // ── WORLD 6: Line & Rotational Symmetry ─────────────────────────────
        case 'symmetry-recognition': {
          const shapes = [
            {
              name: 'Regular Pentagon',
              lines: 5,
              rotOrder: 5,
              motif: MOTIF_CATALOG[5],
              q: `How many lines of symmetry does a regular pentagon have, and does it have rotational symmetry?`,
              c: `5 lines of symmetry and rotational symmetry of order 5 (turns of 72°)`,
              d: [
                `4 lines of symmetry (same as a square) and no rotational symmetry`,
                `5 lines of symmetry but NO rotational symmetry`,
                `1 line of symmetry (vertical only)`,
              ],
              exp: `A regular polygon with n sides has n lines of symmetry and rotational symmetry of order n. A regular pentagon has 5 lines of symmetry and matches itself every 360°/5 = 72°.`,
            },
            {
              name: 'Mosaic Rhombus / Diamond',
              lines: 2,
              rotOrder: 2,
              motif: MOTIF_CATALOG[6],
              q: `How many lines of symmetry does this mosaic rhombus have, and what is its rotational symmetry order?`,
              c: `2 lines of symmetry (vertical & horizontal) and rotational symmetry of order 2 (180°)`,
              d: [
                `4 lines of symmetry (like a square) and order 4`,
                `0 lines of symmetry and order 1`,
                `2 lines of symmetry but no rotational symmetry`,
              ],
              exp: `A rhombus has 2 lines of symmetry connecting opposite vertices and rotational symmetry of order 2 (matches itself after a 180° half-turn).`,
            },
            {
              name: 'Mosaic Arrow',
              lines: 1,
              rotOrder: 1,
              motif: MOTIF_CATALOG[2],
              q: `What type of symmetry does the standard mosaic arrow tile possess?`,
              c: `Line symmetry only (1 vertical mirror line); no non-trivial rotational symmetry`,
              d: [
                `Rotational symmetry only (order 2); no line symmetry`,
                `Both 2 lines of symmetry and order 2 rotational symmetry`,
                `No symmetry at all (completely asymmetric)`,
              ],
              exp: `The arrow has a single vertical line of symmetry down its centre. It does NOT match itself under any rotation less than a full 360° turn.`,
            },
          ];

          const item = shapes[q % shapes.length];
          const options = shuffleArray([item.c, ...item.d], globalId);

          questionObj = {
            id: globalId,
            districtId: d,
            category: 'SYMMETRY RECOGNITION',
            visual: 'symmetry-overlay',
            questionText: item.q,
            options,
            correctAnswer: item.c,
            explanation: item.exp,
            hint1: `Fold the shape mentally across candidate lines to check if both halves match exactly.`,
            hint2: `Remember that line symmetry (mirroring) and rotational symmetry (turning about the centre) are separate properties!`,
            visualData: {
              motif: item.motif,
              linesCount: item.lines,
              rotOrder: item.rotOrder,
            },
          };
          break;
        }

        // ── WORLD 7: Predict Far Figures via Spatial Reasoning ──────────────
        case 'predict-far-figure': {
          const farStep = (q % 3) * 4 + 10; // Step 10, 14, or 18
          const angle = 90;
          const direction = q % 2 === 0 ? 'clockwise' : 'anticlockwise';
          const cycle = 4; // 360 / 90 = 4 steps per full rotation

          const netTurns = (farStep - 1) % cycle;
          const totalAngle =
            direction === 'clockwise'
              ? (netTurns * angle) % 360
              : (360 - ((netTurns * angle) % 360)) % 360;

          const correctDesc = getRotationOrientationName(totalAngle);
          const wrongDesc1 = getRotationOrientationName((totalAngle + 90) % 360);
          const wrongDesc2 = getRotationOrientationName((totalAngle + 180) % 360);
          const wrongDesc3 = getRotationOrientationName((totalAngle + 270) % 360);

          const options = shuffleArray([correctDesc, wrongDesc1, wrongDesc2, wrongDesc3], globalId);

          questionObj = {
            id: globalId,
            districtId: d,
            category: 'FAR FIGURE PREDICTION',
            visual: 'rotation-diagram',
            questionText: `A motif tile starts pointing Up (North) at Step 1 and turns 90° ${direction} at each subsequent step. Predict which direction Figure ${farStep} will face without drawing every intermediate step.`,
            options,
            correctAnswer: correctDesc,
            explanation: `The rotation completes a full 360° circle every 4 steps. Step ${farStep} is ${farStep - 1} steps from Step 1. Since (${farStep - 1}) mod 4 = ${netTurns}, it has turned ${netTurns * 90}° ${direction}, ending up ${correctDesc}.`,
            hint1: `How many 90° turns does it take to make one full circle back to pointing Up? (Hint: 360 ÷ 90 = 4).`,
            hint2: `Divide the step number by the cycle length (4) and inspect the remainder.`,
            visualData: {
              motif: MOTIF_CATALOG[2],
              farStep,
              direction,
              finalAngle: totalAngle,
            },
          };
          break;
        }

        // ── WORLD 8: Applied Multi-Step Visual Reasoning ────────────────────
        case 'multi-step-applied-visual-reasoning': {
          const commissionItems = [
            {
              q: `Apprentice Nadia needs a border tile for a square frame. The tile must satisfy TWO rules: (1) it must possess at least 1 line of symmetry, and (2) it must alternate reflection across a vertical line without breaking symmetry. Which tile candidate satisfies both rules?`,
              c: `The Mosaic Arrow Tile (vertical line symmetry preserved under reflection)`,
              d: [
                `The L-Tromino Tile (asymmetric shape)`,
                `The Pennant Flag Tile (points only to one side)`,
                `The Spiral Hook Tile (curved asymmetric motif)`,
              ],
              exp: `Only the Mosaic Arrow Tile possesses line symmetry that stays geometrically balanced when reflected across a vertical axis.`,
            },
            {
              q: `A mosaic border uses a 3-tile repeating cycle. The client requests that every 4th tile must also be rotated 90° clockwise. At which tile position will both rules first align at the exact same step?`,
              c: `Step 12 (the least common multiple of 3 and 4)`,
              d: [`Step 7 (3 + 4)`, `Step 9 (3 × 3)`, `Step 16 (4 × 4)`],
              exp: `To find where a 3-step cycle and a 4-step cycle synchronize, find the least common multiple: LCM(3, 4) = 12.`,
            },
            {
              q: `Arjun creates a growing mosaic medallion. Stage 1 has 4 tiles, Stage 2 has 8 tiles, Stage 3 has 12 tiles. If the workshop master requires at least 28 tiles for the grand plaque, which Stage will first meet or exceed this requirement?`,
              c: `Stage 7 (7 × 4 = 28 tiles)`,
              d: [`Stage 5 (20 tiles)`, `Stage 6 (24 tiles)`, `Stage 8 (32 tiles)`],
              exp: `The pattern adds 4 tiles per stage (4, 8, 12, 16, 20, 24, 28). Stage 7 has exactly 28 tiles.`,
            },
          ];

          const item = commissionItems[q % commissionItems.length];
          const options = shuffleArray([item.c, ...item.d], globalId);

          questionObj = {
            id: globalId,
            districtId: d,
            category: 'APPLIED REASONING',
            visual: 'figure-grid',
            questionText: item.q,
            options,
            correctAnswer: item.c,
            explanation: item.exp,
            hint1: `Break the commission requirements into separate conditions and test candidate options against both.`,
            hint2: `Check line symmetry and cycle multiples independently before combining them.`,
            visualData: {
              commissionScenario: true,
              step: q + 1,
            },
          };
          break;
        }

        // ── WORLD 9: Mixed Review Finale (Grand Exhibition) ─────────────────
        case 'mixed-review': {
          const finaleTypes = [
            {
              q: `Grand Exhibition Review: A motif tile has 1 vertical line of symmetry and rotates 90° clockwise each step. If it starts pointing Up, which direction does it face in Figure 7, and does Figure 7 still possess line symmetry?`,
              c: `Pointing Left (West); it possesses horizontal line symmetry`,
              d: [
                `Pointing Right (East); it has no line symmetry`,
                `Pointing Down (South); it has rotational symmetry only`,
                `Pointing Up (North); symmetry is completely destroyed`,
              ],
              exp: `Figure 7 is 6 steps forward: (6 × 90°) = 540° = 180° + 360° = 180° clockwise (wait: 6 mod 4 = 2 steps = 180° turn from Up is Down, wait: let's verify step index: Step 1 = Up, Step 2 = Right, Step 3 = Down, Step 4 = Left, Step 5 = Up, Step 6 = Right, Step 7 = Down). Let's make sure exact arithmetic: (7-1)*90 = 540 = 180° -> Points Down with vertical line of symmetry!`,
              correctAnswer: `Pointing Down (South); it retains line symmetry (now pointing vertically down)`,
              altDistractors: [
                `Pointing Right (East); it has no symmetry remaining`,
                `Pointing Left (West); direction was calculated anti-clockwise`,
                `Pointing Up (North); because 7 is an odd number`,
              ],
            },
            {
              q: `Grand Exhibition Review: Which of the following statements correctly distinguishes reflection from translation in mosaic design?`,
              c: `Reflection flips the motif across a mirror line, reversing its orientation; translation merely slides the motif without flipping`,
              altDistractors: [
                `Translation flips the motif across a line, while reflection turns it about a point`,
                `Reflection and translation produce identical geometric figures in all cases`,
                `Reflection is only possible for circles and squares; other shapes cannot be reflected`,
              ],
              exp: `A reflection flips the shape producing a reversed mirror orientation. A translation preserves the exact orientation, simply shifting its position.`,
            },
            {
              q: `Grand Exhibition Review: Look at the two patterns: Pattern A (border square: 4, 8, 12 tiles) and Pattern B (repeating strip: 🔺🔵🔺🔵). Which describes their growth behaviour?`,
              c: `Pattern A grows by a constant +4 tiles per step; Pattern B does not grow at all (it is a repeating cyclical pattern)`,
              altDistractors: [
                `Both patterns grow at a constant rate`,
                `Pattern B grows faster because triangles have 3 sides`,
                `Pattern A is repeating while Pattern B is quadratic growing`,
              ],
              exp: `Pattern A is a growing pattern with constant difference +4. Pattern B is a repeating pattern with cycle length 2 that does not grow.`,
            },
          ];

          const item = finaleTypes[q % finaleTypes.length];
          const cAnswer = item.correctAnswer || item.c;
          const distractors = item.altDistractors || item.d;
          const options = shuffleArray([cAnswer, ...distractors], globalId);

          questionObj = {
            id: globalId,
            districtId: d,
            category: 'MIXED REVIEW',
            visual: 'symmetry-overlay',
            questionText: item.q,
            options,
            correctAnswer: cAnswer,
            explanation: item.exp,
            hint1: `Combine your spatial rules: tracking cycles, rotation directions, and symmetry properties.`,
            hint2: `Read the question carefully to ensure both the direction and symmetry conditions are satisfied.`,
            visualData: {
              mixedFinale: true,
              motif: MOTIF_CATALOG[2],
            },
          };
          break;
        }

        default:
          break;
      }

      if (questionObj) {
        bank.push(questionObj);
        globalId++;
      }
    }
  }

  return bank;
}

const questionBank = generateQuestionBank();
export default questionBank;
