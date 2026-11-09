/* eslint-disable no-bitwise */
import { Key, Note, Range } from 'tonal';

export type NoteNamingPreference = 'auto' | 'sharp' | 'flat';

let noteNamingPreference: NoteNamingPreference = 'auto';
let noteNamingKey = 'C';

export const setNoteNamingPreference = (
  preference: NoteNamingPreference = 'auto',
  key = 'C'
) => {
  noteNamingPreference = preference;
  noteNamingKey = key;
};

export type KeySignatureConfig = {
  alteration: number;
  tonic: string;
  notes: string[];
  scale: string[];
};

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const REGEX_FLAT = /b/g;
const REGEX_SHARP = /#/g;

const FLAT = '♭';
const SHARP = '♯';

const SHARP_NOTE_NAMES: Record<number, string> = { 1: 'C#', 3: 'D#', 6: 'F#', 8: 'G#', 10: 'A#' };
const FLAT_NOTE_NAMES: Record<number, string> = { 1: 'Db', 3: 'Eb', 6: 'Gb', 8: 'Ab', 10: 'Bb' };
const NOTE_NAME_PREFIX = /^([A-Ga-g])([#b]?)(-?\d+)?/;

const getKeySignatureNotes = (scale: string[], useSharps = false) => {
  const scaleChromas = scale.map(Note.chroma);
  const range = Range.chromatic(['C4', 'B4'], {
    sharps: useSharps,
    pitchClass: true,
  }).map((note, chroma) => {
    const noteInScale = scaleChromas.indexOf(chroma);
    return noteInScale > -1 ? scale[noteInScale] : note;
  });

  return range;
};

export const getKeySignature = (note: string, useSharps = false): KeySignatureConfig => {
  let majorKey = Key.majorKey(note);
  if (!majorKey.tonic) {
    majorKey = Key.majorKey('C');
  }

  if (majorKey.alteration > 7) {
    majorKey = Key.majorKey(
      Note.transposeFifths(majorKey.tonic, ~~((majorKey.alteration + 12) / 12) * -12)
    );
  }
  if (majorKey.alteration < -7) {
    majorKey = Key.majorKey(
      Note.transposeFifths(majorKey.tonic, ~~((majorKey.alteration - 12) / 12) * -12)
    );
  }

  const sharps = majorKey.alteration === 0 ? useSharps : majorKey.alteration > 0;
  const scale = [...majorKey.scale];
  const notes = getKeySignatureNotes(scale, sharps);

  return {
    alteration: majorKey.alteration,
    tonic: majorKey.tonic,
    notes,
    scale,
  };
};

export const getNoteInKeySignature = (note: string, keySignatureNotes?: string[]) => {
  const chroma = Note.chroma(note);

  if (chroma !== undefined && keySignatureNotes && keySignatureNotes[chroma]) {
    return Note.enharmonic(note, keySignatureNotes[chroma]);
  }

  return note;
};

/**
 * Convert the leading note name to the user's preferred enharmonic spelling.
 * Any chord quality/extension text after the note is preserved.
 */
export const getPreferredNoteName = (str: string, preference = noteNamingPreference) => {
  if (!str) return str;

  // In Auto mode, follow the currently selected key signature. A neutral key
  // signature (C major / A minor) defaults to flats, as agreed for this app.
  let effectivePreference: 'sharp' | 'flat';
  if (preference === 'auto') {
    effectivePreference = getKeySignature(noteNamingKey).alteration > 0 ? 'sharp' : 'flat';
  } else {
    effectivePreference = preference;
  }

  const match = str.match(NOTE_NAME_PREFIX);
  if (!match) return str;

  const chroma = Note.chroma(`${match[1]}${match[2] || ''}`);
  if (chroma === undefined || chroma === null) return str;

  const names = effectivePreference === 'flat' ? FLAT_NOTE_NAMES : SHARP_NOTE_NAMES;
  const preferredPitchClass = names[chroma];
  if (!preferredPitchClass) return str;

  return `${preferredPitchClass}${match[3] || ''}${str.slice(match[0].length)}`;
};

export const formatAccidentalSymbols = (str: string) =>
  str ? str.replace(REGEX_FLAT, FLAT).replace(REGEX_SHARP, SHARP) : str;

export const formatSharpsFlats = (str: string) =>
  formatAccidentalSymbols(getPreferredNoteName(str));
