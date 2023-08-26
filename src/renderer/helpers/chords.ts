import { Note } from '@tonaljs/tonal';
import { Chord as TChord } from '@tonaljs/chord';

export const CHORD_NAME_REGEX = /^(([A-G])([b]+|[#]+)?)(.*?)(\/([A-G]([b]+|[#]+)?))?$/;
export const CHORD_TYPE_REGEX =
  /^([\d]{1,2}(\/[\d]{1,2})?|(m|M|min|maj|mMaj|m\/ma)[\d]{1,2}|(b|#)[\d]{1,2}|\+|add(b|#)?[\d]{1,2}|maj|m|alt7|aug|dim|sus24|sus2|sus4|oM7|o7|o|no[\d]{1,2})/;

const CHORD_PART_ALIASES = {
  M: [''],
  M6: ['maj', '6'],
  M7: ['maj', '7'],
  maj7: ['maj', '7'],
  M9: ['maj', '9'],
  maj9: ['maj', '9'],
  M11: ['maj', '11'],
  maj11: ['maj', '11'],
  M13: ['maj', '13'],
  maj13: ['maj', '13'],
  'm/ma7': ['m', 'M7'], // strange notation...
  mMaj7: ['m', 'M7'],
  mMaj9: ['m', 'M9'],
  69: ['', '69'],
  m6: ['m', '6'],
  m7: ['m', '7'],
  m9: ['m', '9'],
  m11: ['m', '11'],
  m13: ['m', '13'],
  m69: ['m', '69'],
  '+': ['aug'],
  o: ['', 'o'],
  o7: ['', 'o7'],
  oM7: ['', 'oM7'],
};

const aliasChordPart = (part: string) => {
  return CHORD_PART_ALIASES[part as keyof typeof CHORD_PART_ALIASES] ?? [part];
};

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
  while (remains.length) {
    const match = remains.match(CHORD_TYPE_REGEX);
    if (match) {
      tokens.push(match[1]);
      remains = remains.substring(match[1].length);
    } else {
      tokens.push(remains.substring(0, 1));
      remains = remains.substring(1);
    }
  }
  const [first, ...rest] = tokens;
  return [...aliasChordPart(first), ...rest];
};

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

    return chord.intervals[i];
  });
}
