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
export const FIFTHS_ALTERATIONS =
  '• # ## ### #### 5#/7b 6#/6b 7#/5b bbbb bbb bb b'
    .split(' ')
    .map((v) => v.split('/'));
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
  return (
    Note.chroma(tonic) === Note.chroma(chord.tonic) && quality === chord.quality
  );
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
  tonic: string | undefined,
  fifthsIndex: number,
  alternative = 0
) => {
  if (!tonic) return true;

  return FIFTHS_MAJOR[fifthsIndex][alternative] === tonic;
};
