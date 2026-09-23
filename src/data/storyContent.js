// src/data/storyContent.js
// 4 Widescreen Story Panels for MosaicQuest (Grade 7 · Visual Patterns)
// Accurately following PRD §8.2 narrative beats

export const STORY_PANELS = [
  {
    panel: 0,
    title: "The Broken Panel 🧩",
    text: "In the heart of the Grand Tileworks Studio, Nadia and Arjun stood before their first major restoration commission: the workshop's oldest mosaic panel. Three crucial tiles had shattered from the border! \"Look at the motifs around the gaps,\" Arjun pointed out methodically. \"The surrounding pattern isn't random—it gives us every rule we need to know exactly how each tile should turn and align!\" Nadia inspected the tiles with a keen eye: \"Let's decode the secret geometry before we set a single stone!\"",
    highlight: "🧩 Historic panel damaged · Missing 3 tiles · The surrounding pattern holds the mathematical rules!",
    character: "Nadia & Arjun",
    characterEmoji: "🧑🏽‍🎨",
    imageBg: "radial-gradient(circle, #c08497 0%, #4a2835 100%)",
    imageEmoji: "🏛️",
  },
  {
    panel: 1,
    title: "Repeating or Growing? 🦎",
    text: "Before picking up their trowels, Kaleido the Chameleon scampered onto their design bench, shifting from iridescent gold to deep cobalt. \"Hold on, apprentices!\" Kaleido hissed playfully. \"Every visual pattern belongs to one of two great families! Does the motif cycle through the same fixed states over and over without expanding? That is a REPEATING pattern! But if the figures add more tiles, dots, or rings at every step, that is a GROWING pattern! Spot which family you are working with first!\"",
    highlight: "🦎 REPEATING = Cycles fixed motif states without growing · GROWING = Adds tiles systematically each step!",
    character: "Kaleido the Chameleon",
    characterEmoji: "🦎",
    imageBg: "radial-gradient(circle, #6a4c93 0%, #24143a 100%)",
    imageEmoji: "⚖️",
  },
  {
    panel: 2,
    title: "Turn, Flip, and Match 🔄",
    text: "Arjun picked up an asymmetric L-tile to test the border. \"Watch this: when we TURN it 90 degrees clockwise, its corner pivots to the right—that is ROTATION. But if we FLIP it across the mirror line, its left and right reverse—that is REFLECTION!\" Nadia leaned in: \"Wait, can't we just slide the tile across? It looks balanced to me!\" Arjun smiled: \"Looking balanced isn't enough in geometry! A slide is just a translation—it doesn't mirror the shape. True reflection requires an exact flip across the mirror axis!\"",
    highlight: "🔄 ROTATION = Turning around a center point · REFLECTION = Flipping across a mirror line (NOT sliding!)",
    character: "Arjun & Nadia",
    characterEmoji: "📐",
    imageBg: "radial-gradient(circle, #1982c4 0%, #0d3854 100%)",
    imageEmoji: "🪞",
  },
  {
    panel: 3,
    title: "Restoring the Panel 🏆",
    text: "Armed with their spatial toolkit, Nadia and Arjun placed each missing tile with mathematical precision. By tracking the 4-step rotation cycle and vertical mirror lines, they predicted the exact orientation of the final corner tile without trial and error. The workshop master inspected the restored panel and applauded: \"You didn't just guess—you justified every turn and flip! Welcome to the ranks of Master Mosaicists!\"",
    highlight: "🏆 Panel fully restored · Every tile orientation mathematically justified · Master Mosaicist rank achieved!",
    character: "The Workshop Master",
    characterEmoji: "🌟",
    imageBg: "radial-gradient(circle, #52b788 0%, #174a32 100%)",
    imageEmoji: "🏆",
  },
];
