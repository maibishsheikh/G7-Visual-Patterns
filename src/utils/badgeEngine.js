// src/utils/badgeEngine.js
// Badge definitions and unlock triggers for MosaicQuest (Grade 7 · Visual Patterns)
// Relabelled from PRD §10

export const BADGES = [
  {
    id: 'first_tile',
    icon: '🧩',
    label: 'First Tile Placed',
    description: 'Answered your very first visual pattern question correctly!',
  },
  {
    id: 'steady_hands',
    icon: '🎨',
    label: 'Steady Hands',
    description: 'Achieved a streak of 5 correct answers!',
  },
  {
    id: 'masters_rhythm',
    icon: '🔥',
    label: "Master's Rhythm",
    description: 'Achieved a 10-question winning streak!',
  },
  {
    id: 'full_toolkit',
    icon: '🧰',
    label: 'Full Toolkit',
    description: 'Completed all 4 interactive simulation stations!',
  },
  {
    id: 'panel_perfected',
    icon: '⭐',
    label: 'Panel Perfected',
    description: 'Scored 3 stars in a Practice World!',
  },
  {
    id: 'critique_passed',
    icon: '🏅',
    label: 'Critique Passed',
    description: 'Defeated a World Boss in master critique battle!',
  },
  {
    id: 'dedicated_apprentice',
    icon: '📐',
    label: 'Dedicated Apprentice',
    description: 'Answered over 20 questions in Practice!',
  },
  {
    id: 'master_mosaicist',
    icon: '🏆',
    label: 'Master Mosaicist Badge',
    description: 'Completed the full 5-phase MosaicQuest journey!',
  },
];

export function checkBadges(state) {
  const unlocked = [];

  // First correct answer
  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_tile');

  // Streak checks
  if (state.maxStreak >= 5) unlocked.push('steady_hands');
  if (state.maxStreak >= 10) unlocked.push('masters_rhythm');

  // Simulation completion (all 4 stations)
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) {
    unlocked.push('full_toolkit');
  }

  // 3-star district check
  if (state.districtScores && state.districtScores.some((score) => score !== null && score >= 9)) {
    unlocked.push('panel_perfected');
  }

  // Dedicated apprentice (20+ questions answered)
  if (state.currentQuestion >= 20 || totalCorrect >= 20) {
    unlocked.push('dedicated_apprentice');
  }

  // Boss battle won
  if (state.bossDefeated) {
    unlocked.push('critique_passed');
  }

  // Full journey complete
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) {
    unlocked.push('master_mosaicist');
  }

  return unlocked;
}
