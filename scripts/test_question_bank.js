// scripts/test_question_bank.js
// QA and Stress Test Suite for MosaicQuest questionBank.js

import { generateQuestionBank, DISTRICTS } from '../src/data/questionBank.js';
import { WORLDS } from '../src/config/worlds.config.js';

console.log('🧪 Starting MosaicQuest Question Bank QA & Stress Test...');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    passedTests++;
  }
}

// 1. Structure Verification
assert(DISTRICTS.length === 10, 'DISTRICTS must have 10 entries matching 10 worlds');
assert(WORLDS.length === 10, 'WORLDS must have 10 entries');

// 2. Stress Test: Run 300 generations
console.log('🔄 Running 300 generation cycles (30,000 question evaluations)...');

for (let run = 1; run <= 300; run++) {
  const bank = generateQuestionBank();
  assert(bank.length === 100, `Run ${run}: Question bank must have exactly 100 questions (got ${bank.length})`);

  const districtCounts = Array(10).fill(0);

  bank.forEach((q, idx) => {
    assert(q.id === idx + 1, `Question index ${idx}: expected id ${idx + 1}, got ${q.id}`);
    assert(q.districtId >= 0 && q.districtId < 10, `Question ${q.id}: invalid districtId ${q.districtId}`);
    districtCounts[q.districtId]++;

    assert(typeof q.questionText === 'string' && q.questionText.length > 5, `Question ${q.id}: missing questionText`);
    assert(Array.isArray(q.options) && q.options.length === 4, `Question ${q.id}: options must be array of 4 items`);

    // No duplicate options
    const uniqueOptions = new Set(q.options.map((o) => String(o).trim()));
    assert(uniqueOptions.size === 4, `Question ${q.id} has duplicate options: ${JSON.stringify(q.options)}`);

    // Correct answer is strictly present in options
    const correctInOpts = q.options.some((o) => String(o).trim() === String(q.correctAnswer).trim());
    assert(correctInOpts, `Question ${q.id}: correctAnswer "${q.correctAnswer}" not found in options: ${JSON.stringify(q.options)}`);

    // Non-empty hints and explanation
    assert(typeof q.explanation === 'string' && q.explanation.length > 5, `Question ${q.id}: missing explanation`);
    assert(typeof q.hint1 === 'string' && q.hint1.length > 3, `Question ${q.id}: missing hint1`);
    assert(typeof q.hint2 === 'string' && q.hint2.length > 3, `Question ${q.id}: missing hint2`);

    // Visual data check
    assert(typeof q.visual === 'string' && q.visual.length > 0, `Question ${q.id}: missing visual type`);
    assert(typeof q.visualData === 'object' && q.visualData !== null, `Question ${q.id}: missing visualData`);

    // No NaN or undefined in any string
    const stringified = JSON.stringify(q);
    assert(!stringified.includes('NaN'), `Question ${q.id} contains NaN`);
    assert(!stringified.includes('undefined'), `Question ${q.id} contains undefined`);
  });

  districtCounts.forEach((count, dIdx) => {
    assert(count === 10, `Run ${run}: District ${dIdx} must have exactly 10 questions, got ${count}`);
  });
}

console.log(`✅ ALL 300 RUNS PASSED! Total assertions verified: ${totalTests}`);
console.log('🎉 Question Bank QA & Geometry Integrity: 100% SUCCESS');
