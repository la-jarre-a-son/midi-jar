import { Note, Chord, ChordType } from '@tonaljs/tonal';
import { Chord as TChord } from '@tonaljs/chord';
import { isEqual, isSubsetOf, isSupersetOf } from '@tonaljs/pcset';

import {
  randomPick,
  getKeySignature,
  getNoteInKeySignature,
  KeySignatureConfig,
  NOTE_NAMES,
  levenshtein,
  getChordDegrees,
} from 'renderer/helpers';

export enum STATUSES {
  none = -1,
  different = 0,
  subset = 1,
  equal = 2,
  superset = 3,
}

export type Game = {
  score: number;
  chords: TChord[];
  played: (TChord | null)[];
  succeeded: number;
};

export type GameState = {
  gameIndex: number;
  index: number;
  chord: TChord | null;
  status: STATUSES;
  score: number;
};

export type GameMode = 'random';
export const GAME_LENGTH = 16;

const SCORE_DIFFERENT = -1000;
const SCORE_COMPLEXITY = 500; // Bonus per evaluated complexity
const SCORE_INVERSION = 100; // Bonus for inversions and repetitions
const SCORE_SUBSET = -750; // Malus for chord missing intervals
const SCORE_SUPERSET = 250; // Bonus for chord additions
const SCORE_ROOT = -250; // Malus for not playing the tonic as the root note

const COMPLEXITY_MAX = 5;
const INTERVAL_COMPLEXITY = {
  '1P': 0,
  '3m': 0,
  '3M': 0,
  '4P': 1,
  '5P': 0,
  '5d': 2,
  '5A': 2,
  '6m': 1, // same as 5A
  '6M': 1,
  '7M': 1,
  '7m': 1,
  '9d': 2,
  '9m': 1,
  '9M': 2,
  '9A': 2,
  '10m': 1, // same as 9A
  '11P': 1,
  '11A': 2,
  '13m': 1,
  '13M': 2,
};

/**
 * Calculates a chord complexity, with a "level" associated to each interval.
 *
 * @param intervals - the intervals to evaluate
 * @returns {number}
 */
export function calculateComplexity(intervals: string[]) {
  return intervals.reduce((complexity, interval) => {
    return (
      complexity +
      (INTERVAL_COMPLEXITY[interval as keyof typeof INTERVAL_COMPLEXITY] ?? 1)
    );
  }, 0);
}

/**
 * Calculates a score depending on the detected play
 *
 * @param chordComplexity - an evaluated chord complexity
 * @param chordLev - +1 for inversions or additions of a chord
 * @param subsetLev - distance between played chord and target chord
 * @param supersetLev - distance between played chord and target chord
 * @param differentRoot - true if the root is not the tonic
 *
 * @returns number
 */
export function calculateScore(
  chordComplexity: number,
  chordLev: number,
  subsetLev: number,
  supersetLev: number,
  differentRoot: boolean
) {
  return (
    SCORE_COMPLEXITY * chordComplexity +
    SCORE_INVERSION * chordLev +
    SCORE_SUBSET * subsetLev +
    SCORE_SUPERSET * supersetLev +
    SCORE_ROOT * (differentRoot ? 1 : 0)
  );
}

/**
 * Get the current game state
 *
 * @param gameIndex - the played game index
 * @param index - the target chord index
 * @param target - the target chord
 * @param played - the played chord
 * @param pitchClasses - the notes played
 * @returns GameState
 */
export function getGameState(
  gameIndex: number,
  index: number,
  target: TChord,
  played: TChord | null,
  pitchClasses: string[]
): GameState {
  if (!played || !played.tonic || !target.tonic)
    return { gameIndex, index, status: STATUSES.none, chord: null, score: 0 };

  if (Note.chroma(played.tonic) === Note.chroma(target.tonic)) {
    const chordComplexity = calculateComplexity(target.intervals) + 1;
    const chordLev = levenshtein(
      played.intervals,
      getChordDegrees(played, pitchClasses)
    );

    const targetLev = levenshtein(target.intervals, played.intervals);

    if (isSupersetOf(target.chroma)(played.chroma)) {
      return {
        gameIndex,
        index,
        status: STATUSES.superset,
        chord: played,
        score: calculateScore(
          chordComplexity,
          chordLev,
          0,
          targetLev,
          !!played.root
        ),
      };
    }
    if (isEqual(target.chroma, played.chroma))
      return {
        gameIndex,
        index,
        status: STATUSES.equal,
        chord: played,
        score: calculateScore(chordComplexity, chordLev, 0, 0, !!played.root),
      };

    if (isSubsetOf(target.chroma)(played.chroma))
      return {
        gameIndex,
        index,
        status: STATUSES.subset,
        chord: played,
        score: calculateScore(
          chordComplexity,
          chordLev,
          targetLev,
          0,
          !!played.root
        ),
      };
  }

  return {
    gameIndex,
    index,
    status: STATUSES.different,
    chord: played,
    score: SCORE_DIFFERENT,
  };
}

/**
 * Picks a random key signature
 *
 * @returns KeySignatureConfig
 */
export function getRandomKeySignature() {
  const keySignature = getKeySignature(randomPick(NOTE_NAMES), false);

  return keySignature;
}

/**
 * Picks a random chord for a specified keySignature and complexity
 *
 * @param keySignature
 * @param chordComplexity
 * @returns
 */
export function getRandomChord(
  keySignature: KeySignatureConfig,
  chordComplexity: number
) {
  const chordTypes = ChordType.all().filter(
    (chord) =>
      chord.intervals.length > 2 &&
      Math.min(COMPLEXITY_MAX, calculateComplexity(chord.intervals)) <=
        chordComplexity
  );

  const type = randomPick(chordTypes);

  const tonic = getNoteInKeySignature(
    randomPick(NOTE_NAMES),
    keySignature.notes
  );

  return Chord.getChord(type.aliases[0], tonic);
}

/**
 * Generates a new game depending on game settings
 *
 * @param mode - the game mode
 * @returns
 */
export function generateGame(mode: GameMode) {
  if (mode === 'random') {
    const keySignature = getRandomKeySignature();
    const game = {
      chords: Array(GAME_LENGTH)
        .fill(null)
        .map(() => getRandomChord(keySignature, 1)),
      score: 0,
      played: [],
      succeeded: 0,
    };

    return game;
  }

  return null;
}
