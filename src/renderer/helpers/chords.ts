import { Note } from 'tonal';
import * as ChordType from '@tonaljs/chord-type';
import { Chord as TChord } from '@tonaljs/chord';

import chordsData from './chords-data';

export const CHORD_NAME_REGEX = /^(([A-G])([b]+|[#]+)?)(.*?)(\/([A-G]([b]+|[#]+)?))?$/;

export const CHORD_TYPE_SPECIALCASE_TOKEN = '6/9|6/11|6/13|no[0-9]{1,2}|quartal';
export const CHORD_TYPE_QUALITY_TOKEN =
  '(min|maj|Maj|m/maj?|M|m|-|\\+|aug|dim|dom|sus|o|Δ|^|°|ø|q)(6/9|6/11|6/13|[0-9]{1,2})?';

export const CHORD_TYPE_ALTERATIONS_TOKEN = '(add)?(b|#)?[0-9]{1,2}';

export const CHORD_TYPE_REGEX = new RegExp(
  `^(${CHORD_TYPE_SPECIALCASE_TOKEN}|${CHORD_TYPE_ALTERATIONS_TOKEN}|${CHORD_TYPE_QUALITY_TOKEN})`
);
export const tokenizeChord = (chordName: string): string[] => {
  const match = chordName.match(CHORD_NAME_REGEX);
  if (match) {
    const key = match[1];
    const type = match[4];
    const root = match[6];

    return [key, type, root];
  }

  throw new Error(`Chord parsing error: "${chordName}"`);
};

export const tokenizeChordType = (chordType: string): string[] => {
  let remains = chordType;
  const tokens = [];
  if (remains.startsWith('o') || remains.startsWith('ø') || remains.startsWith('add')) {
    // trick to put diminished as super
    tokens.push('');
  }
  while (remains.length) {
    const match: RegExpMatchArray | null = remains.match(CHORD_TYPE_REGEX);

    if (match && match[1].length) {
      tokens.push(match[1]);
      remains = remains.substring(match[1].length);
    } else {
      tokens.push(remains.substring(0, 1));
      remains = remains.substring(1);
    }
  }

  return tokens;
};

export function formatQuality(quality: string) {
  return quality ? quality.replace(/-/g, '−') : '';
}

/**
 * Maps a list of pitch classes to the note degrees of a chord.
 * @param chord - the chord
 * @param pitchClasses - the notes played
 * @returns string[]
 */
export function getChordDegrees(chord: TChord, pitchClasses: string[]) {
  return pitchClasses.map((pc: string) => {
    const i = chord.notes.findIndex((note) => Note.chroma(note) === Note.chroma(pc));
    if (i < 0) return '';

    return chord.intervals[i].replace('*', '');
  });
}
/**
 * Maps a list of pitch classes to the note name in a chord.
 * @param chord - the chord
 * @param pitchClasses - the notes played
 * @returns string[]
 */
export function getChordNotes(chord: TChord, pitchClasses: string[]) {
  return pitchClasses.map((pc: string) => {
    const i = chord.notes.findIndex((note) => Note.chroma(note) === Note.chroma(pc));
    if (i < 0) return '';

    return chord.notes[i];
  });
}

export function removeIntervalWildcards(intervals: string[]) {
  return intervals.map((interval) => interval.replace('*', ''));
}

export function overrideDictionary() {
  ChordType.removeAll();
  chordsData.forEach(([intervals, fullName, aliases]: string[]) =>
    ChordType.add(intervals.split(' '), aliases.split(' '), fullName)
  );
}

overrideDictionary();
