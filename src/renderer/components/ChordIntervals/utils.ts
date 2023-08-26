import { Interval } from '@tonaljs/tonal';

export const INTERVALS = {
  BASE: '1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M'.split(' '),
  BASE_DIMAUG: '2d 1A 3d 2A 3d 3A 5d 4A 6d 5A 7d 6A 8d 7A'.split(' '),
  OCTAVE: '8P 9m 9M 10m 10M 11P 12d 12P 13m 13M 14m 14M 15P'.split(' '),
  OCTAVE_DIMAUG: '9d 8A 10d 9A 11d 10A 11A 13d 12A 14d 13A 15d 14A'.split(' '),
};

/**
 * Returns an interval in the list that is the same as to the passed interval,
 * or null if the interval is not in the list.
 *
 * @param interval - The interval to check
 * @param intervals - A list of intervals
 * @returns {string}
 */
export function isIncludedAs(interval: string, intervals: string[]) {
  const simplified = intervals.map((i) => Interval.semitones(Interval.simplify(i)));

  const index = simplified.indexOf(Interval.semitones(Interval.simplify(interval)));

  if (index < 0) return null;

  return intervals[index];
}

/**
 * Get an array of 12 elements corresponding to semitones interval starting from 0,
 * where each element is the count of repeated intervals passed as pitchClasses.
 *
 * @param tonic - the tonic reference note to calculate intervals from
 * @param pitchClasses - the list of notes played
 * @returns number[12]
 */
export function getPlayedIntervals(tonic: string | null | undefined, pitchClasses: string[]) {
  return pitchClasses.reduce((acc, pc) => {
    const semitones = tonic
      ? Interval.semitones(Interval.simplify(Interval.distance(tonic, pc)))
      : undefined;
    if (semitones !== undefined) {
      acc[semitones] += 1;
    }
    return acc;
  }, Array(12).fill(0));
}
