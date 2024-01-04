import { Note, Chord, Interval } from 'tonal';
import { Chord as TChord } from '@tonaljs/chord';
import * as ChordType from '@tonaljs/chord-type';

import {
  KeySignatureConfig,
  getChordsInKey,
  getNoteInKeySignature,
  tokenizeChord,
} from 'renderer/helpers';
import { detect } from 'renderer/helpers/chord-detect';

export function getChordInversion(chord?: TChord, inversion = 0, octave = 3) {
  if (!chord) return [];

  const midi: number[] = [];
  const octaveMidi = Note.midi(`C${octave}`) as number;

  const notes = chord.notes
    .slice(inversion % chord.notes.length)
    .concat(chord.notes.slice(0, inversion % chord.notes.length));

  for (let n = 0; n < notes.length; n += 1) {
    let newMidi = Note.midi(`${notes[n]}${octave}`);
    if (newMidi) {
      while (newMidi < (midi.length ? midi[midi.length - 1] : octaveMidi)) {
        newMidi += 12;
      }

      midi.push(newMidi);
    }
  }

  return midi;
}

const getChordInfo = (chord: string, keySignatureNotes?: string[]): TChord | null => {
  const [tonic, type, root] = tokenizeChord(chord);
  if (tonic) {
    const tonicInKey = getNoteInKeySignature(tonic, keySignatureNotes);
    const rootInKey = getNoteInKeySignature(root, keySignatureNotes);
    const c = Chord.getChord(type, tonicInKey);
    const rootInterval = Interval.distance(tonicInKey, rootInKey);
    const rootDegree = c.intervals.indexOf(rootInterval) + 1;
    return { ...c, symbol: chord, root, rootDegree };
  }

  return null;
};

export function getAlternativeChords(
  chord?: TChord,
  keySignature?: KeySignatureConfig,
  disabled: string[] = [],
  hideDisabled = false
): TChord[] {
  if (!chord) return [];

  const chords = detect(chord.notes, {
    allowOmissions: true,
    disabledChords: hideDisabled ? disabled : [],
  })
    .map((c) => getChordInfo(c, keySignature?.notes))
    .filter((c) => c && c.symbol !== chord.symbol) as TChord[];

  return chords;
}

export function getSubsetChords(
  chord?: TChord,
  disabled: string[] = [],
  hideDisabled = false
): TChord[] {
  if (!chord || !chord.tonic) return [];
  const subset = ChordType.all()
    .filter((chordType) => {
      if (hideDisabled && disabled.includes(chordType.aliases[0])) return false;

      return (
        // eslint-disable-next-line no-bitwise
        chord.setNum !== chordType.setNum && (chord.setNum & chordType.setNum) === chordType.setNum
      );
    })
    .map((chordType) => Chord.getChord(chordType.aliases[0], chord.tonic as string));

  return subset;
}

export function getSupersetChords(
  chord: TChord,
  keySignature: KeySignatureConfig,
  filterChordsInKey: boolean,
  disabled: string[] = [],
  hideDisabled = false
): TChord[] {
  if (!chord || !chord.tonic) return [];

  const superset = (
    filterChordsInKey
      ? getChordsInKey(keySignature, Note.chroma(chord.tonic) ?? null)
      : ChordType.all()
  )
    .filter((chordType) => {
      if (hideDisabled && disabled.includes(chordType.aliases[0])) return false;

      return (
        // eslint-disable-next-line no-bitwise
        chord.setNum !== chordType.setNum && (chord.setNum & chordType.setNum) === chord.setNum
      );
    })
    .map((chordType) => Chord.getChord(chordType.aliases[0], chord.tonic as string));

  return superset;
}
