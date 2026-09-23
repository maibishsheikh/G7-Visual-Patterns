// scripts/clean_audio.js
// Scans public/assets/audio/ and removes any .mp3 files not referenced in audioMap.js

import fs from 'fs';
import path from 'path';
import { audioMap } from '../src/utils/audioMap.js';

const audioDir = path.resolve('public/assets/audio');
if (!fs.existsSync(audioDir)) {
  console.log("No audio directory found. Nothing to clean.");
  process.exit(0);
}

const validFiles = new Set(Object.values(audioMap).map((p) => path.basename(p)));
const diskFiles = fs.readdirSync(audioDir);

let deletedCount = 0;
diskFiles.forEach((file) => {
  if (file.endsWith('.mp3') && !validFiles.has(file)) {
    fs.unlinkSync(path.join(audioDir, file));
    deletedCount++;
    console.log(`Deleted orphaned audio: ${file}`);
  }
});

console.log(`🧹 Audio cleanup complete. ${deletedCount} orphaned files removed.`);
