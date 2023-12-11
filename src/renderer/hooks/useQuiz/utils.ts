import { Note, Chord, ChordType } from 'tonal';
import { Chord as TChord } from '@tonaljs/chord';
import { isEqual, isSubsetOf, isSupersetOf } from '@tonaljs/pcset';

import { ChordQuizSettings, NotationSettings } from 'main/types';

import {
  randomPick,
  getKeySignature,
  getNoteInKeySignature,
  KeySignatureConfig,
  NOTE_NAMES,
  levenshtein,
  getChordDegrees,
  stringRotate,
  removeIntervalWildcards,
} from 'renderer/helpers';

export enum STATUSES {
  none = -1,
  different = 0,
  subset = 1,
  equal = 2,
  superset = 3,
}

export type Parameters = Pick<NotationSettings, 'key' | 'accidentals'> & ChordQuizSettings;

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

// RandomInKey chroma masks - allows borrowings from other scales
// const IN_KEY_SCALE_CHROMA = '101011010101'; // Major only
// const IN_KEY_SCALE_CHROMA = '101011011101'; // Major + Harmonic
const IN_KEY_SCALE_CHROMA = '101011111101'; // Major + Melodic + Harmonic

const SCORE_DIFFERENT = -1000;
const SCORE_COMPLEXITY = 500; // Bonus per evaluated complexity
const SCORE_INVERSION = 100; // Bonus for inversions and repetitions
const SCORE_SUBSET = -750; // Malus for chord missing intervals
const SCORE_SUPERSET = 250; // Bonus for chord additions
const SCORE_ROOT = -250; // Malus for not playing the tonic as the root note

const COMPLEXITY_MAX = 5;
const INTERVAL_COMPLEXITY = {
  '1P': 0,
  '2m': 2,
  '2M': 1,
  '3m': 0,
  '3M': 0,
  '4P': 1,
  '4A': 2,
  '5d': 2,
  '5P': 0,
  '5A': 2,
  '6m': 2, // same as 5A
  '6M': 1,
  '7d': 0, // consider dim7 chords easier
  '7M': 1,
  '7m': 1,
  '9d': 2,
  '9m': 1,
  '9M': 1,
  '9A': 2,
  '10m': 2, // same as 9A
  '11d': 2,
  '11P': 1,
  '11A': 2,
  '13m': 2,
  '13M': 1,
};

/**
 * Calculates a chord complexity, with a "level" associated to each interval.
 *
 * @param intervals - the intervals to evaluate
 * @returns {number}
 */
export function calculateComplexity(intervals: string[]) {
  return intervals.reduce((complexity, interval) => {
    if (interval.endsWith('*')) return complexity;
    return complexity + (INTERVAL_COMPLEXITY[interval as keyof typeof INTERVAL_COMPLEXITY] ?? 1);
  }, 0);
}

/**
 * Returns all chords from dictionary, grouped by their calculated complexity;
 *
 * @returns {Object}
 */
export function getDictionaryChordsByComplexity() {
  return ChordType.all()
    .filter((chord) => chord.intervals.length > 2)
    .map((c) => ({
      ...c,
      complexity: calculateComplexity(c.intervals),
    }))
    .reduce(
      (acc, c) => {
        const complexity = Math.min(COMPLEXITY_MAX, c.complexity);
        acc[complexity] = acc[complexity] ?? [];
        acc[complexity].push(c.aliases[0] || 'maj');
        return acc;
      },
      {} as Record<number, string[]>
    );
}

// (function consoleLogChordDifficulty() {
//   const dict = getDictionaryChordsByComplexity();

//   console.log(
//     [
//       `- \`Very Easy\`: ${dict[0].join(', ')}`,
//       `- \`Easy\`: ${dict[1].join(', ')}`,
//       `- \`Medium\`: ${dict[2].join(', ')}`,
//       `- \`Hard\`: ${dict[3].join(', ')}`,
//       `- \`Very Hard\`: ${dict[4].join(', ')}`,
//     ].join('\n')
//   );
// })();

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
    const targetIntervals = removeIntervalWildcards(target.intervals);
    const playedIntervals = removeIntervalWildcards(played.intervals);
    const chordComplexity = calculateComplexity(targetIntervals) + 1;
    const chordLev = levenshtein(playedIntervals, getChordDegrees(played, pitchClasses));

    const targetLev = levenshtein(targetIntervals, playedIntervals);

    if (isSupersetOf(target.chroma)(played.chroma)) {
      return {
        gameIndex,
        index,
        status: STATUSES.superset,
        chord: played,
        score: calculateScore(chordComplexity, chordLev, 0, targetLev, !!played.root),
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
        score: calculateScore(chordComplexity, chordLev, targetLev, 0, !!played.root),
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
export function getRandomChord(keySignature: KeySignatureConfig, chordComplexity: number) {
  const chordTypes = ChordType.all().filter(
    (chord) =>
      chord.intervals.length > 2 &&
      Math.min(COMPLEXITY_MAX, calculateComplexity(chord.intervals)) <= chordComplexity
  );

  const type = randomPick(chordTypes);

  const tonic = getNoteInKeySignature(randomPick(NOTE_NAMES), keySignature.notes);

  return Chord.getChord(type.aliases[0], tonic);
}

/**
 * Picks a random chord in a key signature, with given complexity
 *
 * @param keySignature
 * @param chordComplexity
 * @returns
 */
export function getRandomChordInKey(keySignature: KeySignatureConfig, chordComplexity: number) {
  const keyChroma = Note.chroma(keySignature.tonic) ?? 0;
  let chordTypes: ReturnType<typeof ChordType.all> = [];
  let tonic;

  while (!chordTypes.length) {
    tonic = randomPick(keySignature.scale);
    const chroma = Note.chroma(tonic) ?? 0;
    const scaleChroma = stringRotate(IN_KEY_SCALE_CHROMA, chroma - keyChroma);

    const isInKey = isSubsetOf(scaleChroma);

    chordTypes = ChordType.all().filter(
      (chord) =>
        chord.intervals.length > 2 &&
        Math.min(COMPLEXITY_MAX, calculateComplexity(chord.intervals)) <= chordComplexity &&
        isInKey(chord.chroma)
    );
  }

  const type = randomPick(chordTypes);

  return Chord.getChord(type.aliases[0], tonic);
}

/**
 * Generates {count} chords with a generator, but avoiding twice the same chord.
 *
 * @param count - number of chords to generate
 * @param generator - the generator function, having index and previous chords as arguments
 * @returns a chord array
 */
export function generateChords(
  count: number,
  generator: (index: number, previous: TChord[]) => TChord
) {
  return Array(count)
    .fill(null)
    .reduce<TChord[]>((acc, _, index) => {
      let newChord;
      const previous = acc.length ? acc[acc.length - 1] : null;
      do {
        newChord = generator(index, acc);
      } while (previous && previous.symbol === newChord.symbol);

      acc.push(newChord);
      return acc;
    }, []);
}

/**
 * Generates a new game depending on game settings
 *
 * @param mode - the game mode
 * @returns
 */
export function generateGame(parameters: Parameters) {
  if (parameters.mode === 'random') {
    const keySignature = getRandomKeySignature();
    const game = {
      chords: generateChords(parameters.gameLength, () =>
        getRandomChord(keySignature, parameters.difficulty)
      ),
      score: 0,
      played: [],
      succeeded: 0,
    };

    return game;
  }
  if (parameters.mode === 'randomInKey') {
    const keySignature = getKeySignature(parameters.key, parameters.accidentals === 'sharp');
    const game = {
      chords: generateChords(parameters.gameLength, () =>
        getRandomChordInKey(keySignature, parameters.difficulty)
      ),
      score: 0,
      played: [],
      succeeded: 0,
    };
    return game;
  }

  return null;
}
