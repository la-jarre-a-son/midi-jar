import { Voice, StaveNote } from 'vexflow';
import { Note } from '@tonaljs/tonal';

const NOTE_REGEX = /([a-g])(b|#)?(\d+)/i;
const NOTE_C4_MIDI = Note.midi('C4') as number;

type VexNote = {
  key: string;
  accidental: string | null;
  clef: 'treble' | 'bass';
};

export const noteToVex = (note: string): VexNote | null => {
  const match = note.match(NOTE_REGEX);
  const midi = Note.midi(note);

  if (match && midi) {
    return {
      key: `${match[1]}${match[2] || ''}/${match[3]}`.toLowerCase(),
      accidental: match[2] || null,
      clef: midi >= NOTE_C4_MIDI ? 'treble' : 'bass',
    };
  }
  return null;
};

export const getVoice = (notes: string[], clef: 'treble' | 'bass') => {
  const voice = new Voice();

  const voiceNotes = notes
    .map(noteToVex)
    .filter((vn) => vn && vn.clef === clef) as VexNote[];

  if (voiceNotes.length) {
    const staveNote = new StaveNote({
      keys: voiceNotes.map((vn) => vn.key),
      duration: '1',
      clef,
    });

    voice.addTickables([staveNote]);

    return voice;
  }

  return null;
};
