# MosaicQuest — Module TRD
**Grade 7 · Visual Patterns**
*(Technical companion to `MosaicQuest_Grade7_PRD.md`, produced from `Intellia_Module_Blueprint_TRD.md`. Repo: `mosaic-quest-main`. Default clone source: `G2-Money-Money-main`, unless a more recent sibling — e.g. `equation-quest-main` or `pattern-quest-main` — is designated as the actual clone source at build time.)*

---

## 1. Reference Analysis Notes — Gotcha Check

Check each fresh against whichever repo is actually cloned from, per platform blueprint §1:

1. **Dead/duplicate `src/features/*` folder.** Confirm `App.jsx`'s actual imports before copying anything.
2. **Hardcoded story-panel count.** This module uses the default **4 panels** — likely a no-op, same as the two prior Grade 7 modules, but confirm against the actual clone source rather than assuming.
3. **Static vs. procedural question bank.** Build `data/questionBank.js` procedurally. This module is **geometry-rendering-heavy** rather than purely numeric — every question in Worlds 0, 1, 4, 5, 6, 7 needs a rendered SVG figure (or pair of figures) as part of the question itself, not just a supporting illustration, which is a meaningfully different rendering load than either EquationQuest or PatternQuest.
4. **Viewport-clipping bug.** Proactively apply the `100dvh` + `ResizeObserver` header-height fix.
5. **Leftover branding strings.** Check `index.html`'s `<title>` and `README.md` for stale references from whichever module was actually cloned — **specifically watch for leftover mascot references** if cloned from `pattern-quest-main` (which kept the default owl) or `equation-quest-main` (which used a fox); this module needs Kaleido the Chameleon fully swapped in.

**Module-specific risk to add:** unlike the two prior modules, **most of this module's "correctness" lives in rendered SVG geometry, not in a numeric answer key.** A rotation-pattern or reflection-pattern question's correct answer is only correct if the rendered option genuinely matches the intended transformation — a subtle bug in the SVG-generation helper could produce a "correct" answer that's actually a translation dressed up as a reflection, silently teaching the exact misconception this module exists to prevent (see §10 QA and §11 Risks).

## 2. Tech Stack

Unchanged from platform blueprint §2.1 — reuse verbatim (same dependency versions as the prior two Grade 7 TRDs). `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `vercel.json` — reuse as-is.

## 3. Folder Structure

```
mosaic-quest-main/
├── public/assets/{audio/, story/}
├── scripts/
│   ├── generate_audio.js         # MODIFY: new `phrases` array (§8)
│   └── clean_audio.js            # reuse as-is
├── src/
│   ├── assets/story/             # story_1.png ... story_4.png
│   ├── components/
│   │   ├── IntroScreen.jsx/.css  # MODIFY: title/copy only
│   │   ├── ProgressMap.jsx/.css  # reuse as-is
│   │   ├── shared/
│   │   │   ├── Mascot.jsx/.css              # reuse as-is (props swap to Kaleido the Chameleon)
│   │   │   ├── FeedbackOverlay.jsx/.css     # reuse as-is
│   │   │   ├── FloatingNumbers.jsx/.css     # reuse as-is
│   │   │   └── PatternVisual.jsx            # NEW — §5.1 (note: shares a name with PatternQuest's component but is a distinct, module-local file — see §11 risk)
│   │   ├── gamification/
│   │   │   ├── KingdomMap.jsx/.css  # reuse as-is
│   │   │   └── StarRating.jsx       # reuse as-is
│   │   ├── quiz/
│   │   │   ├── QuestionRenderer.jsx/.css  # MODIFY: import PatternVisual
│   │   │   └── BossBattleModal.jsx/.css   # reuse as-is
│   │   ├── phases/
│   │   │   ├── WonderPhase.jsx/.css    # MODIFY: content only
│   │   │   ├── StoryPhase.jsx/.css     # MODIFY: content only
│   │   │   ├── SimulatePhase.jsx/.css  # MODIFY: 4 new station imports/labels
│   │   │   ├── PlayPhase.jsx/.css      # reuse as-is
│   │   │   └── ReflectPhase.jsx/.css   # MODIFY: 3 new recap questions (§6.3)
│   │   └── simulations/
│   │       ├── KaleidoscopeWallLab.jsx    # NEW — Concept Discovery Lab — §6
│   │       ├── MatchTheMastersPattern.jsx # NEW — Build-to-Target Challenge — §6
│   │       ├── DesignTheMosaicPanel.jsx   # NEW — Multi-Step/Composite Construction — §6
│   │       ├── SpotTheBrokenTile.jsx      # NEW — Error-Detective — §6
│   │       └── Stations.css               # MODIFY: extend with tile-grid, rotation-dial, and mirror-line visual classes
│   ├── config/
│   │   ├── worlds.config.js       # MODIFY: 10 topic-themed worlds — §4.1
│   │   ├── characters.config.js   # MODIFY: Nadia / Arjun / Kaleido — §4.2
│   │   └── audio.config.js        # reuse as-is
│   ├── core/hooks/useViewport.js  # reuse as-is
│   ├── hooks/useAudio.js          # reuse as-is
│   ├── data/
│   │   ├── storyContent.js        # MODIFY: 4 story panels — §4.3
│   │   └── questionBank.js        # MODIFY: procedurally generated 100 Qs — §4.4
│   ├── utils/
│   │   ├── audio.js               # reuse as-is
│   │   ├── audioMap.js            # auto-generated — do not hand-edit
│   │   ├── narration.js           # MODIFY: topic-specific phase scripts — §8
│   │   ├── badgeEngine.js         # MODIFY: relabelled BADGES array only — §7
│   │   ├── scoring.js             # reuse as-is
│   │   ├── shuffle.js             # reuse as-is
│   │   └── visualPatternMath.js   # NEW — §4.4
│   ├── styles/
│   │   ├── design-tokens.css      # MODIFY: 10 new --world-N accent colors — §9
│   │   └── globals.css            # reuse as-is (apply viewport fix from §1.4 proactively)
│   ├── App.jsx                    # MODIFY only if the clone source's panel-count logic differs from 4 (§1.2)
│   ├── App.css / main.jsx / index.css   # reuse as-is
├── index.html / package.json / vite.config.js / tailwind.config.js / postcss.config.js / vercel.json / .oxlintrc.json / .gitignore
└── README.md                      # MODIFY: module-specific + art-brief (PRD §13)
```

## 4. Data Layer

### 4.1 `config/worlds.config.js`
Ten entries in the fixed shape, populated from PRD §9:

```js
export const WORLDS = [
  { id: 0, name: "The First Motif", emoji: "🎭", accent: "var(--world-0)",
    description: "Spot and extend a repeating (cyclical) tile/shape pattern",
    conceptFocus: "identify-extend-repeating-pattern",
    boss: { name: "The Motif Muddler", emoji: "🎭", reward: "Apprentice Badge" } },
  { id: 1, name: "Growing or Repeating?", emoji: "🖼️", accent: "var(--world-1)",
    description: "Classify a visual pattern as growing or repeating and justify it",
    conceptFocus: "growing-vs-repeating",
    boss: { name: "The Category Critic", emoji: "🖼️", reward: "Classifier Badge" } },
  { id: 2, name: "Counting the Tiles", emoji: "🔢", accent: "var(--world-2)",
    description: "Count a quantity per figure in a growing pattern",
    conceptFocus: "represent-growing-pattern-numerically",
    boss: { name: "The Tile Counter", emoji: "🔢", reward: "Counter's Badge" } },
  { id: 3, name: "Straight Growth or Curved Growth?", emoji: "📈", accent: "var(--world-3)",
    description: "Visually compare constant vs. increasing growth",
    conceptFocus: "compare-growth-types",
    boss: { name: "The Growth Curve Ghost", emoji: "📈", reward: "Curve-Spotter Badge" } },
  { id: 4, name: "The Spinning Tile", emoji: "🌀", accent: "var(--world-4)",
    description: "Continue a pattern where a motif rotates each step",
    conceptFocus: "rotation-patterns",
    boss: { name: "The Spin Master", emoji: "🌀", reward: "Rotation Badge" } },
  { id: 5, name: "Mirror, Mirror", emoji: "🪞", accent: "var(--world-5)",
    description: "Continue a pattern involving reflected/flipped motifs",
    conceptFocus: "reflection-patterns",
    boss: { name: "The Mirror Phantom", emoji: "🪞", reward: "Reflection Badge" } },
  { id: 6, name: "Finding the Symmetry", emoji: "⚖️", accent: "var(--world-6)",
    description: "Identify line and rotational symmetry in a figure",
    conceptFocus: "symmetry-recognition",
    boss: { name: "The Symmetry Sentinel", emoji: "⚖️", reward: "Symmetry Badge" } },
  { id: 7, name: "Design the Far Tile", emoji: "🔭", accent: "var(--world-7)",
    description: "Predict/describe a specified far figure via spatial reasoning",
    conceptFocus: "predict-far-figure",
    boss: { name: "The Far Tile Rival", emoji: "🔭", reward: "Visionary Badge" } },
  { id: 8, name: "The Mosaic Commission", emoji: "🏛️", accent: "var(--world-8)",
    description: "Full applied multi-step design-and-justify scenario",
    conceptFocus: "multi-step-applied-visual-reasoning",
    boss: { name: "The Commission Critic", emoji: "🏛️", reward: "Master Artisan Badge" } },
  { id: 9, name: "The Grand Exhibition", emoji: "🖼️", accent: "var(--world-9)",
    description: "Mixed review of every concept above",
    conceptFocus: "mixed-review",
    boss: { name: "The Grand Curator", emoji: "🖼️", reward: "Gallery Champion Trophy" } },
];
```

### 4.2 `config/characters.config.js`
```js
export const CHARACTERS = {
  nadia: { name: "Nadia", role: "The detail-eyed apprentice", emoji: "👧🏽", colour: "var(--char-1)", mascotEmoji: "🦎" },
  arjun: { name: "Arjun", role: "The direction-precise apprentice", emoji: "🧑🏽", colour: "var(--char-2)", mascotEmoji: "🦎" },
  kaleido: { name: "Kaleido the Chameleon", role: "Mascot & mentor", emoji: "🦎", colour: "var(--mascot)", mascotEmoji: "🦎" },
};
export const MASCOT = { name: "Kaleido the Chameleon", emoji: "🦎" };
```

### 4.3 `data/storyContent.js`
`STORY_PANELS` array, length 4, per PRD §8.2, fixed shape `{ panel, title, text, highlight, character, characterEmoji, imageBg, imageEmoji }`. Titles: "The Broken Panel," "Repeating or Growing?," "Turn, Flip, and Match," "Restoring the Panel."

### 4.4 Question Bank — Procedural Generation

**`utils/visualPatternMath.js`** — pure helper functions shared by the question generator and the Simulate stations. Unlike EquationQuest's/PatternQuest's math-helper files, most of these functions return **geometry descriptors** (for `PatternVisual.jsx` to render as SVG) rather than bare numbers:

| Function | Purpose |
|---|---|
| `pickCleanRotationAngle()` | Draws from the curated set `{90, 180, 270}` degrees only — never an arbitrary angle. |
| `pickCleanCycleLength()` | Draws a repeating-pattern cycle length from `{2, 3, 4}`. |
| `generateRepeatingPattern(motifs, cycleLength, visibleLength)` | Produces a repeating sequence of motif descriptors for a given cycle. |
| `generateGrowingFigure(kind, stage)` | Produces a growing figure's tile/dot geometry for a curated set of archetypes (e.g. `"border-square"` for constant/linear growth, `"filled-square"` for increasing/non-linear growth) — the same archetype pair referenced in PRD §3's growth-type comparison, never an invented or ambiguous growth type. |
| `applyRotation(motifDescriptor, angle, direction)` | Returns the geometry descriptor for a motif rotated by `angle` in `direction ∈ {"clockwise","anticlockwise"}` — the **single source of truth** for what counts as a correctly rotated option; both the correct answer and any rotation-based distractor are generated by calling this with different (deliberately wrong) direction/angle arguments, never by hand-authoring a "looks about right" wrong image. |
| `applyReflection(motifDescriptor, mirrorLine)` | Returns the true mirror-image geometry descriptor for a motif across `mirrorLine`. The **headline-misconception distractor** for this function is generated by calling `applyTranslation` (a plain shift) instead and presenting that as the wrong option — never by manually drawing an "almost-reflected" shape, which risks accidentally being geometrically correct. |
| `applyTranslation(motifDescriptor, offset)` | A plain positional shift with no reflection — used only to generate the reflection-vs-translation distractor above, never as a correct answer in this module (translation-as-a-taught-skill is out of scope per PRD §3). |
| `countGrowingFigureUnits(kind, stage)` | Returns the exact tile/dot count for a given growing-figure archetype and stage — feeds World 2's numeric-counting questions. Deliberately does **not** return or expose an algebraic general term (PRD §3's scoping split is enforced here, in code, not just in question-writing discipline). |
| `hasLineSymmetry(figureDescriptor, candidateLine)` | Returns a boolean by checking actual geometric mirror-equality of the rendered figure against `candidateLine` — never a template-author-asserted true/false. |
| `hasRotationalSymmetry(figureDescriptor, angle)` | Returns a boolean by checking actual geometric rotational self-mapping at `angle` (excluding the trivial 0°/360° case per the documented misconception in §10) — same geometry-verified guarantee as `hasLineSymmetry`. |
| `classifyGrowthType(kind)` | Returns `"constant"` or `"increasing"` for a given growing-figure archetype, used by World 3's generator — drawn only from the curated archetype pool, never inferred. |

**"Clean number"/"clean geometry" constraints (hard requirements, not inline magic numbers):**
- Rotation angles limited to `{90°, 180°, 270°}` only.
- Repeating-pattern cycle lengths limited to `{2, 3, 4}` motifs.
- Growing-figure tile/dot counts capped so the largest directly-rendered stage stays within a renderable range (≤ ~20 shapes), matching the constraint already established in PatternQuest's `patternMath.js` for consistency across the two sibling modules.
- Every rotation, reflection, and symmetry question's correct answer **and every distractor** must be produced by calling the actual geometry functions above with different (including deliberately incorrect) parameters — hand-authored "looks plausible" wrong images are explicitly disallowed, because this is the one place in the module where an ungrounded distractor risks teaching a real geometric falsehood rather than just being an easy-to-eliminate wrong choice.
- Growth-type comparison items (World 3) draw only from the two curated archetypes (`"border-square"` = constant growth, `"filled-square"` = increasing growth) — never a fabricated third "type."

**`data/questionBank.js` generation:**
One or more template functions per `conceptFocus` (10 concept slugs from §4.1), each of which:
1. Draws motifs/figures via the curated helpers above.
2. Produces exactly 4 options: 1 correct + 3 distractors reflecting the researched misconceptions for this topic (§10 below) — above all, **reflection mistaken for a plain translation/shift**, and **reflection symmetry confused with rotational symmetry**, plus rotation-direction mix-ups (clockwise vs. anti-clockwise) and the "same number of sides ⇒ same number of symmetry lines" over-generalisation.
3. Fills `explanation`, `hint1`, `hint2`, and `visualData` (the geometry descriptor(s) `PatternVisual.jsx` needs — see §5.1).

Fixed output schema (unchanged):
```js
{
  id: Number, districtId: Number, category: String, visual: String,
  questionText: String, options: [String], correctAnswer: String,
  explanation: String, hint1: String, hint2: String, visualData: Object,
}
```
Also export `DISTRICTS` (derived from `WORLDS`) so `PlayPhase.jsx`'s existing import is unmodified.

## 5. Component Specs

### 5.1 `PatternVisual.jsx`
Replaces the reference's domain visual component. Takes `{ type, data, compact }`. Supported `type` values, matching the question bank's `visual` field:
- `"motif-strip"` — renders a horizontal strip of repeating/growing motifs, used for Worlds 0–1.
- `"figure-grid"` — renders a growing tile/dot figure for a given stage and archetype (border-square / filled-square), used for Worlds 2–3, with the same rendering cap as PatternQuest's equivalent.
- `"rotation-diagram"` — renders a motif alongside its rotated result, with an angle/direction indicator label (never colour-only), used for World 4.
- `"reflection-diagram"` — renders a motif, a mirror line, and the candidate reflected result(s), used for World 5.
- `"symmetry-overlay"` — renders a figure with candidate symmetry line(s)/rotation centre marked, used for World 6.

`compact` prop shrinks rendering for inline use inside `QuestionRenderer.jsx`. Also reused inside the Simulate stations (Kaleidoscope Wall Lab reuses `rotation-diagram`/`reflection-diagram` as its live interactive surface).

## 6. Simulate Station Specs

All 4 follow the fixed per-station contract: `<StationComponent onComplete={fn} audioEnabled={bool} />`, self-contained internal state, live SVG visuals themed with `design-tokens.css` variables, a `station-success` panel with a "Complete Station ✓" CTA, and keyboard-operable +/− controls alongside any slider/drag interaction.

| Component | Archetype | Student manipulates | Live feedback | Completion gate |
|---|---|---|---|---|
| `KaleidoscopeWallLab.jsx` | Concept Discovery Lab | Drags a motif onto a tile grid; turns a rotation dial (stepped to 90°/180°/270°) and toggles a flip switch | The full pattern regenerates live across the grid as the dial/toggle changes, calling `applyRotation`/`applyReflection` directly rather than a simplified preview | Free exploration across both rotation and reflection, **plus one confirmation question**, per the platform archetype — carries the same open tension flagged in both prior modules' PRDs (§15.5 there), not resolved here either |
| `MatchTheMastersPattern.jsx` | Build-to-Target Challenge | Adjusts rotation angle, flip on/off, and cycle-length controls, each with keyboard +/− steppers | A live-generated pattern strip renders next to a fixed target strip; a match/no-match indicator (with a text label, not colour-only) shows progress | Producing an exact geometric match to the target; a "try another round" loop offers a fresh target before the station is markable complete |
| `DesignTheMosaicPanel.jsx` | Multi-Step/Composite Construction | Places a starting motif, selects a transformation rule (rotate/reflect/grow) from a small menu, watches the resulting sequence render live, then places/describes a specified far figure | The full figure sequence renders live as the rule is chosen and stepped forward | Correctly selecting/applying the transformation rule **and** correctly placing the specified far figure — targets PRD LOs 7–8 |
| `SpotTheBrokenTile.jsx` | Error-Detective | Taps the tile/step in a multi-step attempted pattern-continuation that contains the seeded mistake, then supplies the correction | The tapped tile highlights; mistake pool is dominated by the reflection-as-translation and rotation-direction misconceptions (§10), generated the same geometry-function-driven way as the question bank's distractors (§4.4) | Correctly identifying the erroneous tile/step and supplying the fix |

Wire all 4 into `SimulatePhase.jsx`'s `STATIONS` array and station-index render switch; tab bar, footer navigation, progress dots, and `COMPLETE_SIM_STATION`/`ADVANCE_SIM_STATION` gating logic are reused verbatim from the reference.

### 6.3 `ReflectPhase.jsx` Recap Questions
Replace the 3 hard-coded recap questions with 3 targeting the reflection-vs-translation and reflection-vs-rotation-symmetry misconceptions (PRD §8.5), matching the Error-Detective station's focus.

## 7. Gamification

`utils/scoring.js` (`calcXP`, `calcStars`) — reuse formulas as-is. `utils/badgeEngine.js` — reuse `checkBadges(state)` trigger logic as-is; only the `BADGES` array's display strings change, per PRD §10's rename table (First Tile Placed, Steady Hands, Master's Rhythm, Full Toolkit, Panel Perfected, Critique Passed, Dedicated Apprentice, Master Mosaicist Badge).

## 8. Audio Pipeline

`config/audio.config.js`, `utils/audio.js`, `hooks/useAudio.js`, `utils/audioMap.js` — reuse mechanics as-is.

Rewrite `utils/narration.js` function *bodies* (signatures unchanged, same list as the prior two modules' TRDs) and `scripts/generate_audio.js`'s `phrases` array using PRD §11's rules — "line of symmetry"/"rotational symmetry" always spoken in full and never conflated, rotation direction always stated as "clockwise"/"anti-clockwise," turns paired with degrees on first use, "reflection"/"flip" and "rotation"/"turn" paired on first use per world, "repeating pattern"/"growing pattern" always named explicitly, "motif" used consistently. After content lock: `npm run generate-audio` then `npm run clean-audio`.

## 9. Design Tokens

`styles/design-tokens.css` — reuse core palette/type/radii/shadows/transitions as-is. Regenerate only the `--world-0` through `--world-9` accent block, using a mosaic/studio palette distinct from both EquationQuest's noir palette and PatternQuest's earthy palette:

| World | Accent (indicative) |
|---|---|
| 0 — The First Motif | `#C08497` (dusty rose tile) |
| 1 — Growing or Repeating? | `#6A4C93` (violet) |
| 2 — Counting the Tiles | `#1982C4` (cobalt) |
| 3 — Straight Growth or Curved Growth? | `#8AC926` (lime) |
| 4 — The Spinning Tile | `#FFCA3A` (kiln gold) |
| 5 — Mirror, Mirror | `#52B788` (glaze green) |
| 6 — Finding the Symmetry | `#F15BB5` (rose pink) |
| 7 — Design the Far Tile | `#4D908E` (teal slate) |
| 8 — The Mosaic Commission | `#B56576` (terracotta) |
| 9 — The Grand Exhibition | `#9B2226` (gallery crimson — most dramatic, for the finale) |

## 10. Build, QA, and Delivery

1. **Question bank stress test** — ≥300 randomized generations (30,000 questions) across all 10 concept categories; assert no duplicate options, no rotation angle outside `{90,180,270}`, no cycle length outside `{2,3,4}`, no unrenderable figure sizes, no malformed/`NaN`/`undefined` fields.
2. **Geometry-correctness audit (module-specific, higher priority than in the prior two modules)** — for every rotation/reflection/symmetry question, programmatically verify the labelled "correct" option is the actual output of `applyRotation`/`applyReflection`/`hasLineSymmetry`/`hasRotationalSymmetry` with the stated parameters, and that every distractor is *not* geometrically equal to the correct answer under any of the curated clean angles/cycle lengths — this catches the exact class of bug flagged in §1 and §11 (a "correct" answer that's secretly a mislabelled translation).
3. **Misconception audit** — spot-check that distractors are dominated by the two research-confirmed headline misconceptions (reflection-as-translation; reflection-symmetry-vs-rotational-symmetry confusion), with a secondary share of rotation-direction mix-ups and the same-sides/same-symmetry over-generalisation, rather than arbitrary wrong answers.
4. **Audio parity check** — every string passed to a narration helper has an exact match in `audioMap.js`, or is intentionally dynamic.
5. **Full user-journey walkthrough** — Wonder → Story (all 4 panels) → Simulate (all 4 stations completable, tab-gating correct) → Practice (World Map, all 4 modes reachable, all 10 Boss Battles winnable, badges unlock) → Reflect (new recap renders, scorecard accurate) — zero console/page errors.
6. **Production build check** — `npm install && npm run build` succeeds from a clean extract.
7. **Accessibility spot-check** — Simulate/Play fonts and touch targets present at Secondary-appropriate sizing; every rotation/reflection/symmetry cue has a text label, never colour-only (per PRD §12); slider/dial interactions have keyboard equivalents.
8. **Delivery checklist** — zip excludes `node_modules/`/`dist/`; 4 story image placeholders at the reference's exact dimensions with an art-brief README; `README.md` updated and checked for leftover branding from whichever module was cloned; `.env.local.example` documents `VITE_ELEVENLABS_API_KEY` with no real key committed.

## 11. Risks

- **Geometry-correctness is a stricter QA bar than either prior module's "clean number" checks.** Both EquationQuest and PatternQuest can validate correctness by re-computing a number and comparing. This module must validate correctness by re-computing *geometry* — a materially different (and, per the research behind PRD §3/§15, higher-stakes) QA task, since a geometry bug here doesn't just produce an ugly number, it can silently teach a real misconception as fact. §10.2's geometry-correctness audit should not be treated as optional or reducible to the standard stress test.
- **Filename collision risk.** `PatternVisual.jsx` is used as the visual-component name in **both** this module and PatternQuest, per each module's own §5.1 — they are separate files in separate repos, but anyone comparing the two module codebases side-by-side (or copy-pasting between them) should not assume the two are interchangeable; their `type` prop values and rendering logic are entirely different. Consider flagging this naming collision to whoever maintains the platform's shared-component conventions, since a differently-named component (e.g. `VisualPatternVisual.jsx`) would remove the ambiguity at negligible cost.
- **Scope-boundary drift risk with PatternQuest.** World 2's numeric-counting questions are the most likely place for scope to quietly drift into PatternQuest's territory (i.e. a future content pass adding "and now find the formula" almost by habit, since that's what the sibling module's figure-pattern worlds do). `countGrowingFigureUnits()` deliberately not exposing a general term (§4.4) is the code-level guardrail against this; keep it that way even if it looks like an easy extension point.
- **Third consecutive Grade 7 build, same audience-calibration caveat** as the two prior modules — budget review time on the first playable build for tone/difficulty fit.
- **Concept Discovery Lab design tension** — unresolved, now appearing in a third module (see §6 table note); resolving it once would let all three modules' Concept Discovery Lab stations follow a single consistent decision.
