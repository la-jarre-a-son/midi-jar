import { Note, Chord, Interval } from 'tonal';
import { Chord as TChord } from '@tonaljs/chord';
import * as ChordType from '@tonaljs/chord-type';

import { KeySignatureConfig, getNoteInKeySignature, tokenizeChord } from 'renderer/helpers';
import { detect } from 'renderer/helpers/chord-detect';

const midiC4 = Note.midi('C4') as number;

export function getChordInversion(chord?: TChord, inversion = 0) {
  if (!chord) return [];

  const midi: number[] = [];

  const notes = chord.notes
    .slice(inversion % chord.notes.length)
    .concat(chord.notes.slice(0, inversion % chord.notes.length));

  for (let n = 0; n < notes.length; n += 1) {
    let newMidi = Note.midi(`${notes[n]}4`);
    if (newMidi) {
      while (newMidi < (midi.length ? midi[midi.length - 1] : midiC4)) {
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

export function getAlternativeChords(chord?: TChord, keySignature?: KeySignatureConfig): TChord[] {
  if (!chord) return [];

  const chords = detect(chord.notes, { allowOmissions: false })
    .map((c) => getChordInfo(c, keySignature?.notes))
    .filter((c) => c && c.symbol !== chord.symbol) as TChord[];

  return chords;
}

export function getSubsetChords(chord?: TChord): TChord[] {
  if (!chord || !chord.tonic) return [];
  const subset = ChordType.all()
    .filter((chordType) => {
      return (
        // eslint-disable-next-line no-bitwise
        chord.setNum !== chordType.setNum && (chord.setNum & chordType.setNum) === chordType.setNum
      );
    })
    .map((chordType) => Chord.getChord(chordType.aliases[0], chord.tonic as string));

  return subset;
}

export function getSupersetChords(chord?: TChord): TChord[] {
  if (!chord || !chord.tonic) return [];

  const superset = ChordType.all()
    .filter((chordType) => {
      return (
        // eslint-disable-next-line no-bitwise
        chord.setNum !== chordType.setNum && (chord.setNum & chordType.setNum) === chord.setNum
      );
    })
    .map((chordType) => Chord.getChord(chordType.aliases[0], chord.tonic as string));

  return superset;
}
