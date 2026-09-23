// src/utils/narration.js
// Narration script builder for MosaicQuest (Grade 7 · Visual Patterns)
// Adheres strictly to PRD §11 content rules & 1:1 text parity

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

export function wonderNarration() {
  return [
    say("Welcome to MosaicQuest! Let's explore the geometry of visual patterns in the tileworks workshop!"),
    say("The workshop's oldest mosaic panel is missing three tiles — but the surrounding pattern gives you everything you need to know exactly what they should look like."),
    ask("Can you spot the transformation rule and restore the ancient masterpiece?"),
    cheer("Let's investigate how patterns rotate, reflect, and grow!"),
  ];
}

export function storyNarration(panel) {
  const scripts = [
    [
      say("In the heart of the Grand Tileworks Studio, Nadia and Arjun stood before their first major restoration commission: the workshop's oldest mosaic panel."),
      say("Three crucial tiles had shattered from the border! Look at the motifs around the gaps, Arjun pointed out methodically."),
      say("The surrounding pattern isn't random — it gives us every rule we need to know exactly how each tile should turn and align!"),
      think("Nadia inspected the tiles with a keen eye: Let's decode the secret geometry before we set a single stone!"),
    ],
    [
      say("Before picking up their trowels, Kaleido the Chameleon scampered onto their design bench, shifting from iridescent gold to deep cobalt."),
      say("Hold on, apprentices! Kaleido hissed playfully. Every visual pattern belongs to one of two great families!"),
      emphasize("Does the motif cycle through the same fixed states over and over without expanding? That is a repeating pattern!"),
      say("But if the figures add more tiles, dots, or rings at every step, that is a growing pattern! Spot which family you are working with first!"),
    ],
    [
      say("Arjun picked up an asymmetric L-tile to test the border."),
      say("Watch this: when we turn it — a quarter turn, that's ninety degrees clockwise — its corner pivots to the right. That is a rotation!"),
      say("But if we flip it across the mirror line, its left and right reverse. That is a reflection!"),
      say("Nadia leaned in: Wait, can't we just slide the tile across? It looks balanced to me!"),
      say("Arjun smiled: Looking balanced isn't enough in geometry! A slide is just a translation — it doesn't mirror the shape. True reflection requires an exact flip across the line of symmetry!"),
    ],
    [
      say("Armed with their spatial toolkit, Nadia and Arjun placed each missing tile with mathematical precision."),
      say("By tracking the four-step rotation cycle and vertical mirror lines, they predicted the exact orientation of the final corner tile without trial and error."),
      say("The workshop master inspected the restored panel and applauded: You didn't just guess — you justified every turn and flip!"),
      cheer("Welcome to the ranks of Master Mosaicists!"),
    ],
  ];

  return scripts[panel] || scripts[0];
}

export function simStationIntro(stationIdx) {
  const intros = [
    [
      instruct("Welcome to Station 1 — The Kaleidoscope Wall Lab!"),
      instruct("Select a motif, turn the rotation dial to explore ninety, one hundred eighty, and two hundred seventy degree turns, and toggle mirror flips live!"),
    ],
    [
      instruct("Welcome to Station 2 — Match the Master's Pattern!"),
      instruct("Adjust rotation angle, rotation direction, and cycle length to replicate the master artisan's target pattern strip!"),
    ],
    [
      instruct("Welcome to Station 3 — Design the Mosaic Panel!"),
      instruct("Select a transformation rule, watch the figures generate live, and use spatial reasoning to predict the far figure!"),
    ],
    [
      instruct("Welcome to Station 4 — Spot the Broken Tile!"),
      instruct("An apprentice's pattern has a seeded flaw! Tap the broken tile, identify the mistake, and supply the geometrically correct fix!"),
    ],
  ];

  return intros[stationIdx] || intros[0];
}

export function playQuestionNarration(questionText) {
  return [ask(questionText)];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) {
    return [cheer("Incredible streak! Master's Rhythm unlocked! 🔥")];
  }
  if (streak >= 3) {
    return [cheer("Awesome! Three in a row! ⭐")];
  }
  return [cheer("Spot on! That's correct! 🎉")];
}

export function playWrongNarration() {
  return [think("Not quite — check the hint, inspect the transformations carefully, and try again! 💡")];
}

export function playHint1Narration() {
  return [encourage("Here's your first clue: identify whether the motif is repeating or growing.")];
}

export function playHint2Narration() {
  return [encourage("Here's your second clue: trace the rotation direction clockwise or check the line of symmetry.")];
}

export function districtCompleteNarration() {
  return [cheer("World commission complete! Outstanding spatial reasoning! 🌟")];
}

export function bossStartNarration() {
  return [emphasize("The Master Critique begins! Answer the pattern questions to prove your mastery!")];
}

export function bossWinNarration() {
  return [cheer("Critique passed! You conquered the challenge and claimed the artisan badge! 🏆")];
}

export function reflectNarration() {
  return [say("Welcome to the reflection phase. Review the core spatial concepts before claiming your final rank!")];
}

export function reflectCompleteNarration() {
  return [cheer("Congratulations! You have completed MosaicQuest and earned the rank of Master Mosaicist! 🏆")];
}
