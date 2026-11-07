import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTeamScore,
  checkWordScramble,
  shuffleWord,
  calculateMysteryPoints,
  determineWinner,
  formatTimer
} from './rules';

test('calculateTeamScore handles score additions and prevent negatives by default', () => {
  assert.equal(calculateTeamScore(10, 20), 30);
  assert.equal(calculateTeamScore(50, -20), 30);
  assert.equal(calculateTeamScore(10, -50), 0); // clamped to 0
  assert.equal(calculateTeamScore(10, -50, true), -40); // allowNegative
  assert.equal(calculateTeamScore(NaN, 20), 20);
});

test('checkWordScramble accurately validates target words case-insensitively', () => {
  assert.equal(checkWordScramble(['C', 'A', 'T'], 'CAT'), true);
  assert.equal(checkWordScramble(['c', 'a', 't'], 'CAT'), true);
  assert.equal(checkWordScramble(['A', 'C', 'T'], 'CAT'), false);
  assert.equal(checkWordScramble(['C', 'A'], 'CAT'), false);
  assert.equal(checkWordScramble(['C', 'A', 'T', 'S'], 'CAT'), false);
});

test('shuffleWord returns all characters and scrambles the word', () => {
  const original = 'ENGLISH';
  const shuffled = shuffleWord(original, 123);
  assert.equal(shuffled.length, original.length);
  assert.equal(shuffled.slice().sort().join(''), original.split('').sort().join(''));
  assert.notEqual(shuffled.join(''), original);
});

test('calculateMysteryPoints awards higher score for fewer revealed tiles', () => {
  const pointsWith0Revealed = calculateMysteryPoints(16, 0, 50, 10);
  const pointsWith8Revealed = calculateMysteryPoints(16, 8, 50, 10);
  const pointsWith16Revealed = calculateMysteryPoints(16, 16, 50, 10);

  assert.equal(pointsWith0Revealed, 50);
  assert.ok(pointsWith8Revealed < pointsWith0Revealed);
  assert.ok(pointsWith8Revealed > pointsWith16Revealed);
  assert.equal(pointsWith16Revealed, 10);
});

test('determineWinner correctly picks higher score or tie', () => {
  assert.equal(determineWinner(100, 50), 'teamA');
  assert.equal(determineWinner(60, 90), 'teamB');
  assert.equal(determineWinner(80, 80), 'tie');
});

test('formatTimer formats mm:ss correctly', () => {
  assert.equal(formatTimer(0), '00:00');
  assert.equal(formatTimer(9), '00:09');
  assert.equal(formatTimer(65), '01:05');
  assert.equal(formatTimer(300), '05:00');
});
