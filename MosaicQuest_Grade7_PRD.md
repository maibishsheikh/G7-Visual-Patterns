# MosaicQuest — Module PRD
**Grade 7 · Visual Patterns**
*(Produced from `Intellia_Module_Blueprint_PRD.md` — {{GRADE}} = Grade 7, {{TOPIC}} = Visual Patterns, {{SPECIAL_INSTRUCTIONS}} = none supplied, defaults assumed throughout)*

---

## 1. Overview

MosaicQuest teaches spatial/visual pattern literacy: spotting and extending repeating motifs, telling a *repeating* pattern apart from a *growing* one, continuing patterns built from rotation and reflection, recognising symmetry, and predicting a far figure in a visual sequence through spatial reasoning rather than pure calculation. It is framed as a mosaic-and-textile design workshop — every world is a design challenge, and the core motivating question is "what tile comes next, and how do you know?"

## 2. Background

This is the third Grade 7 (Secondary 1) module built against the platform blueprint's reference architecture, following **EquationQuest** (Equations from Word Problems) and **PatternQuest** (Number Patterns). It reuses `G2-Money-Money-main`'s five-phase pedagogical architecture per platform convention.

> **⚠️ Scope note (carried forward from the two prior Grade 7 PRDs):** this is the platform's third consecutive Secondary 1 build against a historically Primary (Grade 1–6) catalogue. The flag is repeated here for completeness, but by this point likely reflects a settled decision rather than an open question — recommend confirming once, rather than re-raising indefinitely.

## 3. Standards Alignment

**Source:** Singapore MOE Secondary 1 Mathematics, drawing on two related strands: the *Number and Algebra* strand's "Number Patterns" chapter (for the numeric/growing-pattern half of this topic) and the *Geometry and Measurement* strand's introductory symmetry and shape-transformation content (line and rotational symmetry are explicitly Secondary 1 content in MOE's geometry sequencing; formal transformation-geometry notation and coordinate-plane transformations are Secondary 2/3). "Visual Patterns" is treated here as the **spatial/geometric counterpart** to PatternQuest's numeric/algebraic treatment of patterns — the two modules are companions, not duplicates (see explicit scoping split below).

**In-scope skills:**
- Identifying and extending a **repeating** (cyclical) visual pattern — a motif that cycles through a fixed set of states (shape, colour, orientation) rather than growing.
- Distinguishing a **repeating pattern** from a **growing pattern** and justifying the classification.
- Representing a growing geometric pattern numerically — counting a relevant quantity (tiles, dots, sides) per figure and recording it as a simple numeric sequence.
- Comparing, at a visual/conceptual level, patterns that grow by a **constant** amount each figure versus patterns that grow by an **increasing** amount (e.g. a filled-square pattern) — without deriving a formal quadratic general term.
- Recognising and continuing patterns built from **rotation** (a motif turning by a fixed amount each step) and **reflection** (a motif mirrored across a line).
- Identifying **line symmetry** and **rotational symmetry** in a single figure or across a pattern's figures.
- Predicting a specified far figure in a visual sequence through spatial/descriptive reasoning, with a supporting count where relevant.
- Justifying a visual-pattern prediction using spatial reasoning language (motif, cycle, turn, mirror line, symmetry) rather than relying on a formula alone.

**Explicit scoping split from PatternQuest (both are Grade 7 modules and must not overlap):**
- PatternQuest owns: deriving and applying an algebraic general term (`an + b`) for a numeric sequence, including sequences drawn *from* growing figures. Its job is turning a figure into a *formula*.
- MosaicQuest owns: everything about the figure itself — repeating vs. growing classification, rotation/reflection/symmetry, and qualitative (not formula-based) growth-type comparison. Its job is reasoning about the *shape*, with numeric counting used only as supporting evidence, never as the graded skill.
- Where a MosaicQuest question needs a supporting count (World 2), it stops at "count and record the pattern" and explicitly does **not** ask for or grade an algebraic general term — that step is cross-referenced to PatternQuest rather than duplicated.

**Adjacent/prerequisite skills treated as bridge only, not tested:**
- **Formal transformation-geometry notation** (translation vectors, rotation matrices, coordinate-plane transformations) — Secondary 2/3 content; this module uses only informal language ("turn," "flip," "slide").
- **Quadratic general-term derivation** for non-linear growth — Secondary 3/4 content, same exclusion already flagged in PatternQuest's PRD; World 3 here treats non-linear growth qualitatively/visually only.
- **Tessellation theory** (which shapes tile a plane and why) — referenced only as flavour in the Story/Wonder framing, never formally tested.

**Domain conventions to encode as house style:**
- The **repeating vs. growing** dichotomy is the module's primary organising vocabulary, introduced explicitly in Story panel 2 and used consistently everywhere after.
- Informal transformation vocabulary is used throughout — "turn" (rotate), "flip" (reflect), "slide" (translate, referenced only lightly since this module's core focus is rotation/reflection, not translation) — paired with the formal term on first use per world, per research showing this scaffolding pairing is standard practice at this level.
- Rotation direction is always stated explicitly as **clockwise** or **anti-clockwise** (Singapore/British convention), never left ambiguous — direction confusion is a documented, common error source for this skill (§15, §10 TRD).
- A figure's symmetry claim is always justified by describing *where* the mirror line sits or *what point* the rotation is centred on — never accepted as "it looks balanced" (a documented misconception, §15).

## 4. Learning Objectives

By the end of this module, a student should be able to:
1. Identify the repeating unit (motif) in a cyclical visual pattern and extend it correctly.
2. Distinguish a repeating pattern from a growing pattern and justify the classification.
3. Represent a growing geometric pattern numerically by counting a relevant quantity per figure.
4. Compare, visually and conceptually, constant (linear-flavoured) growth against increasing (non-linear-flavoured) growth in a visual pattern, without deriving a formula.
5. Recognise and continue a pattern generated by rotating a motif by a fixed amount each step, stating the direction explicitly.
6. Recognise and continue a pattern generated by reflecting a motif across a line.
7. Identify line symmetry and rotational symmetry in a figure, correctly locating the mirror line or centre of rotation.
8. Predict and justify a specified far figure in a visual sequence using spatial reasoning, with a supporting count where relevant.

Ordering runs foundational → applied (spot/extend a repeating motif → classify repeating vs. growing → count a growing pattern → compare growth types → rotation → reflection → symmetry → applied far-figure prediction), and drives the world sequence in §9.

## 5. Inherited Standards *(Section A of the platform blueprint — copied verbatim, unchanged)*

- **Five-phase architecture:** Wonder → Story → Simulate → Play ("Practice" in-UI) → Reflect.
- **Gamification:** XP per question, 0–3 stars per world, streak tracking, 8 fixed badge triggers (relabelled §10), 10 Boss Battles (5Q/3 lives).
- **Practice modes:** Guided (5Q, hints, untimed), Independent (10Q, no hints), Timed Challenge (8Q, 60s), Boss Battle (5Q, 3 lives).
- **Audio pipeline:** ElevenLabs Alice voice only, 6 emotional presets, pre-generated + dynamic narration, no browser TTS fallback, strict 1:1 narration/on-screen-text parity.
- **Question bank shape:** 10 worlds × 10 questions = 100, procedurally generated, ≥300-run stress test, fixed schema, World 9 (last, 0-indexed) is the mixed-review grand finale.
- **Product standards:** React/Vite/Tailwind/Framer Motion, pixel-faithful `design-tokens.css` reuse, enlarged Simulate/Practice fonts and touch targets, zip delivery with placeholder story art + art-brief README.

## 6. Enhancement Requests / Special Instructions

None supplied. Defaults applied: 4-panel Story (justified §8.2), Singaporean-multicultural naming for the two characters (§7), and a **theme-specific mascot override with stated rationale** (§7) — the default owl has already been retained once (PatternQuest) and overridden once (EquationQuest's fox); this module's topic gives a strong, specific reason for its own override.

## 7. Module Identity

- **Module name:** **MosaicQuest**
- **Story theme:** a mosaic-and-textile design workshop — every world is a design commission, and the module's throughline is "read the pattern, then prove you can continue it" (rather than PatternQuest's "jump ahead without counting" throughline). Suits the Secondary 1 age band's tolerance for a project/studio-based setting.
- **Named characters** (Singaporean-multicultural convention, first names only, distinct from EquationQuest's Wei Jie/Deepa and PatternQuest's Farhan/Mei Lin):
  - **Nadia** — the apprentice with a strong eye for symmetry and detail, sometimes over-relies on "it looks right" instead of checking properly.
  - **Arjun** — methodical about direction and orientation (clockwise/anti-clockwise, which way a motif flips), catches Nadia's "looks balanced" shortcuts.
- **Mascot: Kaleido the Chameleon 🦎** *(override, with stated rationale)* — a chameleon's colour- and pattern-changing skin is a direct, literal embodiment of this module's subject matter (motifs that rotate, flip, and cycle), making it a stronger fit than the default owl for this specific topic, in the same way EquationQuest's detective theme justified a fox over the default.

## 8. Five-Phase Journey Detail

### 8.1 Wonder
Single hook screen: *"The workshop's oldest mosaic panel is missing three tiles — but the surrounding pattern gives you everything you need to know exactly what they should look like. Can you spot the rule and restore it?"*

### 8.2 Story — 4 panels (default, not exceeded)

| # | Title | Concept delivered | Narrative beat |
|---|---|---|---|
| 1 | The Broken Panel | Hook: a damaged pattern needs restoring | Nadia and Arjun are given their first restoration commission — a mosaic panel with missing tiles. |
| 2 | Repeating or Growing? | Vocabulary: the repeating-vs-growing dichotomy | Kaleido the Chameleon teaches the two big pattern families before any tile gets placed. |
| 3 | Turn, Flip, and Match | Formal toolkit: rotation, reflection, and how a supporting count connects a growing pattern back to numbers | Arjun demonstrates turning and flipping a tile correctly; Nadia's "it looks balanced" guess is checked and corrected. |
| 4 | Restoring the Panel | Worked application: the full restoration, including predicting and justifying the missing far tile | The pair completes the commission, justifies their answer to the workshop master, and the panel is restored. |

### 8.3 Simulate — 4 stations (archetype-mapped)
Summary (full technical spec in the companion TRD):

| Station | Archetype | Premise |
|---|---|---|
| The Kaleidoscope Wall | Concept Discovery Lab | An interactive tile grid where the student drags a motif and turns a dial (rotation angle) or toggles a flip, watching the pattern regenerate live — builds felt intuition for how a simple transformation rule produces a full visual pattern. |
| Match the Master's Pattern | Build-to-Target Challenge | Student adjusts controls (rotation angle, flip on/off, cycle length) to make a live-generated pattern strip match a shown target strip — a visual puzzle-matching challenge with a tolerance/exact-match check and a retry loop. |
| Design the Mosaic Panel | Multi-Step/Composite Construction | Student places a starting motif, chooses a transformation rule (rotate/reflect/grow), watches the resulting figure sequence render live, then is asked to place or describe a specified far figure — combines rule-selection, generation, and prediction (the module's most advanced learning objectives). |
| Spot the Broken Tile | Error-Detective | A fellow apprentice's attempted pattern-continuation contains one seeded, realistic mistake (rotated the wrong direction, a "reflection" that's actually just a shifted copy, a miscounted growth step, or a repeating pattern misclassified as growing); the student finds and fixes it. |

### 8.4 Play / Practice
Standard, unchanged mechanics (10 worlds × 10 questions, 4 modes). See world table in §9.

### 8.5 Reflect
3 new recap questions targeting the module's two most research-documented misconceptions: **mistaking a reflection for a simple shift/translation of the shape**, and **confusing reflection symmetry with rotational symmetry** (naming "line symmetry" when the pattern is actually generated by turning, or vice versa) — the same misconceptions the Error-Detective station and several worlds' distractors are built around. Followed by the standard scorecard and a reflection prompt ("Which tile in your panel was hardest to justify, and why?").

## 9. World & Question Bank Table

*Shape: `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`. World 9 (last) is the mixed-review grand finale per platform standard.*

| id | World | conceptFocus | Description | Boss | Reward |
|---|---|---|---|---|---|
| 0 | The First Motif | `identify-extend-repeating-pattern` | Spot and extend a repeating (cyclical) tile/shape pattern | The Motif Muddler 🎭 | Apprentice Badge |
| 1 | Growing or Repeating? | `growing-vs-repeating` | Classify a visual pattern as growing or repeating and justify it | The Category Critic 🖼️ | Classifier Badge |
| 2 | Counting the Tiles | `represent-growing-pattern-numerically` | Count a quantity per figure in a growing pattern | The Tile Counter 🔢 | Counter's Badge |
| 3 | Straight Growth or Curved Growth? | `compare-growth-types` | Visually compare constant vs. increasing growth | The Growth Curve Ghost 📈 | Curve-Spotter Badge |
| 4 | The Spinning Tile | `rotation-patterns` | Continue a pattern where a motif rotates each step | The Spin Master 🌀 | Rotation Badge |
| 5 | Mirror, Mirror | `reflection-patterns` | Continue a pattern involving reflected/flipped motifs | The Mirror Phantom 🪞 | Reflection Badge |
| 6 | Finding the Symmetry | `symmetry-recognition` | Identify line and rotational symmetry in a figure | The Symmetry Sentinel ⚖️ | Symmetry Badge |
| 7 | Design the Far Tile | `predict-far-figure` | Predict/describe a specified far figure via spatial reasoning | The Far Tile Rival 🔭 | Visionary Badge |
| 8 | The Mosaic Commission | `multi-step-applied-visual-reasoning` | Full applied multi-step design-and-justify scenario | The Commission Critic 🏛️ | Master Artisan Badge |
| 9 | The Grand Exhibition | `mixed-review` | Mixed review of every concept above; hardest boss | The Grand Curator 🖼️👑 | Gallery Champion Trophy |

**Sample questions (illustrative, not the full 100):**

- **World 0:** *"Continue the pattern: 🔺🔵🔺🔵🔺 ___"* → 🔵 ✓ (distractor: 🔺, reflecting a miscounted cycle length)
- **World 1:** *"Is this pattern repeating or growing?"* (shown: a 3-tile cycle that repeats unchanged) → "Repeating — the same 3 tiles cycle without getting bigger" ✓ (distractor: "Growing," a common misclassification when a cycle is shown across several repeats and looks like it's "getting longer")
- **World 2:** *"Count the tiles in each figure: Figure 1 has 4, Figure 2 has 7, Figure 3 has 10. How many in Figure 4?"* → `13` ✓ (this world stops at the count — it does **not** ask for or grade `3n + 1`, per the explicit scoping split in §3)
- **World 3:** *"Which pattern grows by the same amount every time — the border tiles around a square, or the tiles filling a square?"* → "The border tiles" ✓ (qualitative reasoning, no formula required)
- **World 4:** *"A tile rotates 90° clockwise each step. If it starts pointing up, which way does it point after 3 steps?"* → "Left" ✓ (distractor: "Right," reflecting an anti-clockwise direction mix-up)
- **World 5:** *"Which image correctly shows the motif reflected across the dashed line?"* → the correctly mirrored option ✓ (headline distractor: a shape that's simply been *slid* across the line without flipping — the most-documented reflection misconception)
- **World 6:** *"How many lines of symmetry does a regular pentagon have?"* → `5` ✓ (distractor `4`, reflecting the "same number of sides = same symmetry as a square" misconception)
- **World 7:** *"A motif rotates 90° anti-clockwise each step. Describe what Figure 6 looks like without drawing Figures 1–5."* → correct orientation description ✓
- **World 8:** *"Design a border for a square frame using a motif that must have both a repeating cycle and a line of symmetry at every step. Which of these four candidate motifs satisfies both conditions?"* → the correct motif ✓
- **World 9:** mixed-type item combining rotation direction (World 4) with a symmetry check (World 6).

## 10. Gamification — Badge Renames

| Fixed trigger | Badge name |
|---|---|
| First correct answer | First Tile Placed 🧩 |
| 5-answer streak | Steady Hands 🎨 |
| 10-answer streak | Master's Rhythm 🔥 |
| All 4 Simulate stations complete | Full Toolkit 🧰 |
| Any world scores 3 stars | Panel Perfected ⭐⭐⭐ |
| Any Boss Battle won | Critique Passed 🏅 |
| 20+ questions answered in Practice | Dedicated Apprentice 📐 |
| Full 5-phase journey complete | Master Mosaicist Badge 🏆 |

## 11. Audio & Narration Content Rules

Topic-specific terms that must always be spoken in full:
- "line of symmetry" and "rotational symmetry" always spoken in full, never abbreviated, and never used interchangeably with each other.
- Rotation direction always stated explicitly as "**clockwise**" or "**anti-clockwise**" — never left implicit.
- Fractions of a turn are read in plain language first, paired with the exact degree on first use per context (e.g. "a quarter turn — that's ninety degrees"), then degrees alone thereafter.
- "reflection" is always paired with "flip," and "rotation" with "turn," on first use per world, per the paired informal/formal scaffolding convention in §3 — never introduced as a bare formal term with no everyday anchor.
- "repeating pattern" and "growing pattern" are always named explicitly as the two categories, never conflated or abbreviated.
- "motif" is always spoken in full and consistently, as the module's standard term for "the repeating/transforming unit."

## 12. Accessibility

Standard enlarged fonts/touch targets in Simulate and Practice, calibrated toward the platform's more restrained Secondary-1 sizing (per EquationQuest/PatternQuest precedent). Rotation and reflection are never conveyed by colour alone — every transformation is also labelled with text (direction, angle, "reflected") so colour-blind or low-vision students aren't dependent on visually spotting a flip/turn unaided. Slider/dial interactions (Kaleidoscope Wall, Match the Master's Pattern) require explicit +/− keyboard-operable controls, not drag-only.

## 13. Assets Required

4 story images at the reference's standard placeholder dimensions, delivered as blank CSS-framed placeholders, with an art-brief README describing each panel:
1. The workshop's damaged mosaic panel, Nadia and Arjun receiving the restoration commission.
2. Kaleido the Chameleon explaining repeating vs. growing patterns at a design table.
3. Arjun demonstrating a correct rotate/flip while Nadia's "it looks balanced" guess is checked.
4. The completed, restored panel, the pair presenting it to the workshop master.

## 14. Success Metrics / Acceptance Criteria

Standard fixed criteria (question-bank stress test, audio parity, clean build, full-journey walkthrough) plus module-specific:
- All generated repeating/rotation/reflection patterns have a single, geometrically unambiguous correct answer (verified against actual rendered SVG geometry, not asserted by the template author).
- The repeating-vs-growing classification bank always has a clearly, unambiguously correct answer — never a pattern that's genuinely borderline between the two categories.
- Distractors are dominated by the two research-confirmed headline misconceptions (reflection mistaken for a slid/shifted copy; reflection symmetry confused with rotational symmetry) rather than arbitrary wrong answers.
- World 2's numeric-counting questions never ask for or accept an algebraic general term as the "correct" answer, per the explicit scoping split with PatternQuest (§3).
- All 4 Simulate stations are genuinely interactive, not static reveal-and-answer screens.

## 15. Assumptions & Open Questions

1. **Grade-range expansion (recurring flag, likely settled by now):** third consecutive Secondary 1 module — noted for completeness rather than re-opened as a fresh question.
2. **Scope boundary vs. PatternQuest:** the explicit split in §3 (MosaicQuest = shape/spatial reasoning, PatternQuest = numeric/algebraic general terms) is this PRD's proposed resolution to the overlap risk between "Number Patterns" and "Visual Patterns" as topic names — worth a quick confirm that this matches how the two are meant to be taught as distinct products, since "Visual Patterns" isn't a single MOE chapter with its own fixed name the way "Number Patterns" is (it draws on both the Number Patterns chapter's figure-based content and the Geometry strand's symmetry content).
3. **Character names and mascot** (Nadia, Arjun, Kaleido the Chameleon) are proposed defaults per convention, not yet stakeholder-approved.
4. **Transformation vocabulary depth:** this PRD deliberately keeps to informal language (turn/flip/slide) rather than formal Secondary 2/3 transformation-geometry terms — confirm this matches the intended difficulty ceiling, since some schools may introduce formal rotation/reflection notation earlier than the MOE-common sequencing assumed here.
5. **Concept Discovery Lab completion gate:** the same open tension flagged in both prior Grade 7 PRDs (light confirmation question vs. a previously stated preference for pure free-play) recurs here for the Kaleidoscope Wall station — still not resolved, now appearing in three modules' worth of Concept Discovery Lab stations, which strengthens the case for a single one-time decision rather than three independent judgment calls.
