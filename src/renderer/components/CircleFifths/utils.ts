import { Note } from '@tonaljs/tonal';
import { Chord } from '@tonaljs/chord';

import { range } from 'renderer/helpers';

// Constants
export const FIFTHS_INDEXES = range(0, 11);
export const FIFTHS_MAJOR = 'C G D A E B/Cb F#/Gb C#/Db Ab Eb Bb F'
  .split(' ')
  .map((v) => v.split('/'));
export const FIFTHS_MINOR = 'A E B F# C# G#/Ab D#/Eb A#/Bb F C G D'
  .split(' ')
  .map((v) => v.split('/'));
export const FIFTHS_DIMINISHED = 'B F# C# G# D# A#/Bb E#/F B#/C G D A E'
  .split(' ')
  .map((v) => v.split('/'));
export const FIFTHS_DOMINANTS =
  'G/Bb/Db/E D/F/Ab/B A/C/Eb/F# E/G/Bb/C# B/D/F/G# F#/A/C/D# C#/E/G/A# Ab/Cb/D/F Eb/Gb/A/C Bb/Db/E/G F/Ab/Cb/D C/Eb/Gb/A'
    .split(' ')
    .map((v) => v.split('/'));
export const FIFTHS_ALTERATIONS =
  '• # ## ### #### 5#/7b 6#/6b 7#/5b bbbb bbb bb b'
    .split(' ')
    .map((v) => v.split('/'));

const SECTORS_TOTAL = 0.37;

const SECTORS = {
  alt: {
    size: 0.05,
    enabled: true,
    start: 0.5,
    end: 0.45,
    middle: 0.46,
    align: 0.2,
  },
  major: {
    size: 0.1,
    enabled: true,
    start: 0.45,
    end: 0.35,
    middle: 0.4,
    align: 0.5,
  },
  dom: {
    size: 0.02,
    enabled: true,
    start: 0.35,
    end: 0.33,
    middle: 0.3325,
    align: 0.15,
  },
  minor: {
    size: 0.1,
    enabled: true,
    start: 0.33,
    end: 0.23,
    middle: 0.28,
    align: 0.5,
  },
  dim: {
    size: 0.1,
    enabled: true,
    start: 0.23,
    end: 0.13,
    middle: 0.18,
    align: 0.5,
  },
};

/**
 * Get the sectors radius ranges
 * @returns
 */
export const getSectors = ({
  displayDominants = true,
  displayMajor = true,
  displayMinor = true,
  displayDiminished = true,
  displayAlt = true,
} = {}) => {
  const sectorsObj = (Object.keys(SECTORS) as (keyof typeof SECTORS)[]).reduce(
    (obj, type: keyof typeof SECTORS) => {
      const { size } = SECTORS[type];

      let enabled = true;
      if (type === 'alt' && !displayAlt) enabled = false;
      if (type === 'major' && !displayMajor) enabled = false;
      if (type === 'dom' && !displayDominants) enabled = false;
      if (type === 'minor' && !displayMinor) enabled = false;
      if (type === 'dim' && !displayDiminished) enabled = false;

      obj.sectors[type].enabled = enabled;
      obj.total += enabled ? size : 0;

      return obj;
    },
    { total: 0, sectors: { ...SECTORS } }
  );

  const newTotal = (SECTORS_TOTAL + sectorsObj.total) / 2;
  let start = 0.5;
  (Object.keys(SECTORS) as (keyof typeof SECTORS)[]).forEach((type) => {
    const { size, enabled } = sectorsObj.sectors[type];

    if (enabled) {
      const end = start - (size / sectorsObj.total) * newTotal;
      const newSize = start - end;
      sectorsObj.sectors[type].start = start;
      sectorsObj.sectors[type].end = end;
      sectorsObj.sectors[type].middle =
        sectorsObj.sectors[type].end + newSize * sectorsObj.sectors[type].align;

      start = end;
    }
  });

  return sectorsObj.sectors;
};

/**
 * Transform polar coordinates to cartesian
 *
 * @param ox - origin x
 * @param oy - origin y
 * @param r - radius
 * @param a - angle
 * @returns [x, y]
 */
export const polar = (
  ox: number,
  oy: number,
  r: number,
  a: number
): [number, number] => {
  const rad = (a - 0.25) * 2 * Math.PI;
  const x = ox + r * Math.cos(rad);
  const y = oy + r * Math.sin(rad);
  return [x, y];
};

/**
 * Returns polar coordinates from cartesian, as string "x,y"
 */
export const cPolar = (ox: number, oy: number, r: number, a: number): string =>
  polar(ox, oy, r, a).join(',');

/**
 * Returns the svg path for an arc of the circle
 *
 * @param ox - origin X of the center
 * @param oy - origin Y of the center
 * @param d -  distance of the arc
 * @param a1 - start angle of the arc
 * @param a2 - end angle of the arc
 * @returns {string} - the svg path of the arc
 */
export const arc = (
  ox: number,
  oy: number,
  d: number,
  a1: number,
  a2: number
) => `
  M ${cPolar(ox, oy, d, a1)}
  A ${d},${d} 0 ${a2 - a1 <= 0.5 ? 0 : 1} 1 ${cPolar(ox, oy, d, a2)}
`;

/**
 * Returns the svg path for a sector of the circle
 *
 * @param ox - origin X of the center
 * @param oy - origin Y of the center
 * @param d1 - close distance of the sector
 * @param d2 - far distance of the sector
 * @param a1 - start angle of the sector
 * @param a2 - end angle of the sector
 * @returns {string} - the svg path of the sector
 */
export const sector = (
  ox: number, // origin X
  oy: number, // origin Y
  d1: number, // distance 1
  d2: number, // distance 2
  a1: number, // angle 1
  a2: number // angle 2
) => `
  M ${cPolar(ox, oy, d2, a1)}
  A ${d2},${d2} 0 ${a2 - a1 <= 0.5 ? 0 : 1} 1 ${cPolar(ox, oy, d2, a2)}
  L ${cPolar(ox, oy, d1, a2)}
  A ${d1},${d1} 0 ${a2 - a1 <= 0.5 ? 0 : 1} 0 ${cPolar(ox, oy, d1, a1)}
  Z
`;

/**
 * Returns true if the current sector is in the corresponding scale of the circle of fifths
 *
 * @param current - the current key index in the circle of fifths
 * @param value - the sector index in the circle of fifths
 * @returns {boolean}
 */
export const isInScale = (current: number, value: number) => {
  if (
    value === current + 1 ||
    value === current - 1 ||
    value === current + 11 ||
    value === current - 11
  )
    return true;

  return false;
};

export const isSusInScale = (
  current: number,
  value: number,
  suspended: 'sus2' | 'sus4',
  scale: 'major' | 'minor'
) => {
  if (
    scale === 'major' &&
    suspended === 'sus4' &&
    (value === current + 1 || value === current - 11)
  )
    return true;

  if (
    scale === 'minor' &&
    suspended === 'sus2' &&
    (value === current - 1 || value === current + 11)
  )
    return true;

  if (
    (scale === 'major' && suspended === 'sus2') ||
    (scale === 'minor' && suspended === 'sus4')
  )
    return isInScale(current, value);

  return false;
};

export const isSameNote = (a: string, b: string) =>
  Note.chroma(a) === Note.chroma(b);

const SUS4_CHORDS = ['sus4', 'sus24', '7sus4', 'M7sus4', 'M9sus4'];
const SUS2_CHORDS = ['sus2', 'sus24'];

/**
 * Returns true if the chord corresponds to the circle of fifths sector
 *
 * @param tonic - the tonic of the sector
 * @param quality - the quality of the correspondig chords
 * @param chord - the currently detected chord
 * @returns
 */
export const isPressed = (
  tonic: string,
  quality: string,
  chord?: Chord | null
) => {
  if (!chord || !chord.tonic) return false;

  if (
    quality === 'Diminished' &&
    chord.aliases[0] === 'dim7' &&
    (isSameNote(tonic, chord.notes[0]) ||
      isSameNote(tonic, chord.notes[1]) ||
      isSameNote(tonic, chord.notes[2]) ||
      isSameNote(tonic, chord.notes[3]))
  )
    return true;

  if (
    quality === 'Sus4' &&
    isSameNote(tonic, chord.tonic) &&
    SUS4_CHORDS.includes(chord.aliases[0])
  )
    return true;
  if (
    quality === 'Sus2' &&
    isSameNote(tonic, chord.tonic) &&
    SUS2_CHORDS.includes(chord.aliases[0])
  )
    return true;

  return isSameNote(tonic, chord.tonic) && quality === chord.quality;
};

/**
 * Get the key index in the circle of fifths, depending on the key signature alterations
 *
 * @param alteration - a number of flats (<0) or sharps (>0)
 * @returns {number} - the key index
 */
export const getCurrentKey = (alteration: number) =>
  alteration < 0 ? alteration + 12 : alteration;

/**
 * Returns true if the sector key name is currently selected
 *
 * @param tonic - the current key signature tonic
 * @param fifthsIndex - this index of the fifths (sector)
 * @param alternative - the alternative to compare - defaults to 0
 * @returns
 */
export const isKeySelected = (
  fifthsIndex: number,
  alternative = 0,
  tonic?: string
) => {
  if (!tonic) return true;

  return FIFTHS_MAJOR[fifthsIndex][alternative] === tonic;
};

const DOMINANT_CHORDS = ['7', '7no5', '9', '9no5', '7b9'];

export const isSameDominant = (note: string, chord?: Chord | null) => {
  if (!note || !chord || !chord.tonic) return false;

  return (
    isSameNote(note, chord.tonic) && DOMINANT_CHORDS.includes(chord.aliases[0])
  );
};
