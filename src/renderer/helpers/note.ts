/* eslint-disable no-bitwise */
import { Key, Note, Range } from '@tonaljs/tonal';

export type KeySignatureConfig = {
  alteration: number;
  tonic: string;
  notes: string[];
  scale: string[];
};

const REGEX_FLAT = new RegExp(/b/, 'g');
const REGEX_SHARP = new RegExp(/#/, 'g');

const FLAT = '♭';
const SHARP = '♯';

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

export const getKeySignature = (
  note: string,
  useSharps = false
): KeySignatureConfig => {
  let majorKey = Key.majorKey(note);
  if (!majorKey.tonic) {
    majorKey = Key.majorKey('C');
  }

  if (majorKey.alteration > 7) {
    majorKey = Key.majorKey(
      Note.transposeFifths(
        majorKey.tonic,
        ~~((majorKey.alteration + 12) / 12) * -12
      )
    );
  }
  if (majorKey.alteration < -7) {
    majorKey = Key.majorKey(
      Note.transposeFifths(
        majorKey.tonic,
        ~~((majorKey.alteration - 12) / 12) * -12
      )
    );
  }

  const sharps =
    majorKey.alteration === 0 ? useSharps : majorKey.alteration > 0;
  const scale = [...majorKey.scale];
  const notes = getKeySignatureNotes(scale, sharps);

  return {
    alteration: majorKey.alteration,
    tonic: majorKey.tonic,
    notes,
    scale,
  };
};

export const getNoteInKeySignature = (
  note: string,
  keySignatureNotes?: string[]
) => {
  const chroma = Note.chroma(note);

  if (chroma !== undefined && keySignatureNotes && keySignatureNotes[chroma]) {
    return Note.enharmonic(note, keySignatureNotes[chroma]);
  }

  return note;
};

export const formatSharpsFlats = (str: string) =>
  str ? str.replace(REGEX_FLAT, FLAT).replace(REGEX_SHARP, SHARP) : str;
