// scripts/generate_audio.js
// Offline pre-generation script for ElevenLabs narration audio files.
// Strictly follows audio_generation_pipeline (5).md specifications for MosaicQuest.

import fs from 'fs';
import path from 'path';

function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [key, ...rest] = trimmed.split('=');
          const val = rest.join('=').replace(/^["']|["']$/g, '').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const apiKey = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.log("ℹ️ Note: VITE_ELEVENLABS_API_KEY is not defined in .env.local.");
  console.log("Audio pipeline is ready. To pre-generate audio MP3s, set VITE_ELEVENLABS_API_KEY=your_key in .env.local and rerun.");
}

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const VOICE_MODEL = 'eleven_multilingual_v2';

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30, use_speaker_boost: true },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50, use_speaker_boost: true },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60, use_speaker_boost: true },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20, use_speaker_boost: true },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40, use_speaker_boost: true },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80, use_speaker_boost: true },
};

export const phrases = [
  // ─── INTRO ────────────────────────────────────────────────────────────────
  { text: "Welcome to MosaicQuest! Let's explore the geometry of visual patterns in the tileworks workshop!", style: 'celebration' },

  // ─── WONDER PHASE ────────────────────────────────────────────────────────
  { text: "The workshop's oldest mosaic panel is missing three tiles — but the surrounding pattern gives you everything you need to know exactly what they should look like.", style: 'statement' },
  { text: "Can you spot the transformation rule and restore the ancient masterpiece?", style: 'question' },
  { text: "Let's investigate how patterns rotate, reflect, and grow!", style: 'celebration' },

  // ─── STORY PHASE: PANEL 1 ────────────────────────────────────────────────
  { text: "In the heart of the Grand Tileworks Studio, Nadia and Arjun stood before their first major restoration commission: the workshop's oldest mosaic panel.", style: 'statement' },
  { text: "Three crucial tiles had shattered from the border! Look at the motifs around the gaps, Arjun pointed out methodically.", style: 'statement' },
  { text: "The surrounding pattern isn't random — it gives us every rule we need to know exactly how each tile should turn and align!", style: 'statement' },
  { text: "Nadia inspected the tiles with a keen eye: Let's decode the secret geometry before we set a single stone!", style: 'thinking' },

  // ─── STORY PHASE: PANEL 2 ────────────────────────────────────────────────
  { text: "Before picking up their trowels, Kaleido the Chameleon scampered onto their design bench, shifting from iridescent gold to deep cobalt.", style: 'statement' },
  { text: "Hold on, apprentices! Kaleido hissed playfully. Every visual pattern belongs to one of two great families!", style: 'statement' },
  { text: "Does the motif cycle through the same fixed states over and over without expanding? That is a repeating pattern!", style: 'emphasis' },
  { text: "But if the figures add more tiles, dots, or rings at every step, that is a growing pattern! Spot which family you are working with first!", style: 'statement' },

  // ─── STORY PHASE: PANEL 3 ────────────────────────────────────────────────
  { text: "Arjun picked up an asymmetric L-tile to test the border.", style: 'statement' },
  { text: "Watch this: when we turn it — a quarter turn, that's ninety degrees clockwise — its corner pivots to the right. That is a rotation!", style: 'statement' },
  { text: "But if we flip it across the mirror line, its left and right reverse. That is a reflection!", style: 'statement' },
  { text: "Nadia leaned in: Wait, can't we just slide the tile across? It looks balanced to me!", style: 'statement' },
  { text: "Arjun smiled: Looking balanced isn't enough in geometry! A slide is just a translation — it doesn't mirror the shape. True reflection requires an exact flip across the line of symmetry!", style: 'statement' },

  // ─── STORY PHASE: PANEL 4 ────────────────────────────────────────────────
  { text: "Armed with their spatial toolkit, Nadia and Arjun placed each missing tile with mathematical precision.", style: 'statement' },
  { text: "By tracking the four-step rotation cycle and vertical mirror lines, they predicted the exact orientation of the final corner tile without trial and error.", style: 'statement' },
  { text: "The workshop master inspected the restored panel and applauded: You didn't just guess — you justified every turn and flip!", style: 'statement' },
  { text: "Welcome to the ranks of Master Mosaicists!", style: 'celebration' },

  // ─── SIMULATE STATION INTROS ─────────────────────────────────────────────
  { text: "Welcome to Station 1 — The Kaleidoscope Wall Lab!", style: 'instruction' },
  { text: "Select a motif, turn the rotation dial to explore ninety, one hundred eighty, and two hundred seventy degree turns, and toggle mirror flips live!", style: 'instruction' },
  { text: "Welcome to Station 2 — Match the Master's Pattern!", style: 'instruction' },
  { text: "Adjust rotation angle, rotation direction, and cycle length to replicate the master artisan's target pattern strip!", style: 'instruction' },
  { text: "Welcome to Station 3 — Design the Mosaic Panel!", style: 'instruction' },
  { text: "Select a transformation rule, watch the figures generate live, and use spatial reasoning to predict the far figure!", style: 'instruction' },
  { text: "Welcome to Station 4 — Spot the Broken Tile!", style: 'instruction' },
  { text: "An apprentice's pattern has a seeded flaw! Tap the broken tile, identify the mistake, and supply the geometrically correct fix!", style: 'instruction' },

  // ─── FEEDBACK & HINTS ────────────────────────────────────────────────────
  { text: "Spot on! That's correct! 🎉", style: 'celebration' },
  { text: "Awesome! Three in a row! ⭐", style: 'celebration' },
  { text: "Incredible streak! Master's Rhythm unlocked! 🔥", style: 'celebration' },
  { text: "Not quite — check the hint, inspect the transformations carefully, and try again! 💡", style: 'thinking' },
  { text: "Here's your first clue: identify whether the motif is repeating or growing.", style: 'encouragement' },
  { text: "Here's your second clue: trace the rotation direction clockwise or check the line of symmetry.", style: 'encouragement' },
  { text: "World commission complete! Outstanding spatial reasoning! 🌟", style: 'celebration' },
  { text: "The Master Critique begins! Answer the pattern questions to prove your mastery!", style: 'emphasis' },
  { text: "Critique passed! You conquered the challenge and claimed the artisan badge! 🏆", style: 'celebration' },
  { text: "Welcome to the reflection phase. Review the core spatial concepts before claiming your final rank!", style: 'statement' },
  { text: "Congratulations! You have completed MosaicQuest and earned the rank of Master Mosaicist! 🏆", style: 'celebration' },
];

async function generateAll() {
  if (!apiKey) {
    console.log("Skipping ElevenLabs API requests (no API key). Writing fallback audioMap.js.");
    writeFallbackAudioMap();
    return;
  }

  const outputDir = path.resolve('public/assets/audio');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const mapping = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const slug = text.slice(0, 30).toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const filename = `audio_${slug}_${i}.mp3`;
    const filepath = path.join(outputDir, filename);

    console.log(`[${i + 1}/${phrases.length}] Generating: "${text.slice(0, 40)}..."`);

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: VOICE_MODEL,
          voice_settings: VOICE_SETTINGS[style] || VOICE_SETTINGS.statement,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to generate: ${response.statusText}`);
        continue;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(filepath, buffer);
      mapping[text] = `/assets/audio/${filename}`;
    } catch (err) {
      console.error(`Error generating audio: ${err.message}`);
    }
  }

  const mapFileContent = `// Auto-generated by generate_audio.js\nexport const audioMap = ${JSON.stringify(mapping, null, 2)};\nexport default audioMap;\n`;
  fs.writeFileSync(path.resolve('src/utils/audioMap.js'), mapFileContent, 'utf-8');
  console.log("✅ Audio generation complete! Updated src/utils/audioMap.js");
}

function writeFallbackAudioMap() {
  const mapping = {};
  phrases.forEach((p, i) => {
    const slug = p.text.slice(0, 30).toLowerCase().replace(/[^a-z0-9]+/g, '_');
    mapping[p.text] = `/assets/audio/audio_${slug}_${i}.mp3`;
  });

  const mapFileContent = `// Auto-generated by generate_audio.js\n// Static asset mapping for narration phrases in MosaicQuest\nexport const audioMap = ${JSON.stringify(mapping, null, 2)};\nexport default audioMap;\n`;
  fs.writeFileSync(path.resolve('src/utils/audioMap.js'), mapFileContent, 'utf-8');
}

generateAll();
