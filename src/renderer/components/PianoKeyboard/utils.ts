import { Chord } from '@tonaljs/chord';
import { KeyboardSettings } from 'main/types';
import {
  KeySignatureConfig,
  formatSharpsFlats,
  getChordDegrees,
  getChordNotes,
  getNoteInKeySignature,
} from 'renderer/helpers';
import { Note } from 'tonal';

function wrapMidiNotes(from: string, to: string, midiNotes: number[]): (number | null)[] {
  const start = Note.midi(Note.simplify(from)) ?? 0;
  const end = Note.midi(Note.simplify(to)) ?? 127;

  return midiNotes.map((midi) => {
    if (midi < start) {
      const diff = 12 - ((start - midi) % 12);
      return diff === 12 ? start : start + diff;
    }

    if (midi > end) {
      const diff = 12 - ((midi - end) % 12);
      return diff === 12 ? end : end - diff;
    }

    return null;
  });
}

export const highlight = (
  containerEl: HTMLDivElement,
  type: 'midi' | 'chroma' | 'name',
  value: number | string,
  className: string
) => {
  const elements = containerEl.querySelectorAll(`.${type}-${value}`);
  if (elements && elements.length) {
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].classList.add(className);
    }
  }
};

export const fade = (containerEl: HTMLDivElement, className: string) => {
  const elements = containerEl.querySelectorAll(`.${className}`);

  if (elements && elements.length) {
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].classList.remove(className);
    }
  }
};

export const highlightNotes = (
  containerEl: HTMLDivElement,
  midi: number[],
  className = 'active'
) => {
  for (let i = 0; i < midi.length; i += 1) {
    highlight(containerEl, 'midi', midi[i], className);
  }
};

export const highlightWrapNotes = (
  containerEl: HTMLDivElement,
  from: string,
  to: string,
  midi: number[],
  className = 'wrapped'
) => {
  const wrappedMidiNotes = wrapMidiNotes(from, to, midi);

  for (let i = 0; i < wrappedMidiNotes.length; i += 1) {
    const wrappedMidi = wrappedMidiNotes[i];
    if (wrappedMidi !== null) {
      highlight(containerEl, 'midi', wrappedMidi, className);
    }
  }
};

export const fadeNotes = (containerEl: HTMLDivElement, className = 'active') => {
  fade(containerEl, className);
};

export const highlightInfo = (
  containerEl: HTMLDivElement,
  keyInfo: KeyboardSettings['keyInfo'],
  chord?: Chord
) => {
  if (keyInfo === 'none') return;

  if (!chord) return;

  for (let n = 0; n < chord.notes.length; n += 1) {
    const chroma = Note.chroma(chord.notes[n]);
    const interval = chord.intervals[n];

    const elements = containerEl.querySelectorAll(`.chroma-${chroma}`);
    if (elements && elements.length) {
      for (let i = 0; i < elements.length; i += 1) {
        if (interval === '1P' && (keyInfo === 'tonic' || keyInfo === 'tonicAndInterval')) {
          elements[i].classList.add('tonic');
        } else if (keyInfo === 'interval' || keyInfo === 'tonicAndInterval') {
          elements[i].classList.add('info');
          const intervalEl = elements[i].querySelector('.pianoInfo');
          if (intervalEl) {
            intervalEl.innerHTML = interval;
          }
        }
      }
    }
  }
};

export const fadeInfo = (containerEl: HTMLDivElement) => {
  fade(containerEl, 'tonic');
  const elements = containerEl.querySelectorAll(`.info`);

  if (elements && elements.length) {
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].classList.remove('info');

      const intervalEl = elements[i].querySelector('.pianoInfo');
      if (intervalEl) {
        intervalEl.innerHTML = '';
      }
    }
  }
};

const highlightLabel = (containerEl: HTMLDivElement, midi: number, text: string) => {
  const elements = containerEl.querySelectorAll(`.label-${midi}`);

  if (elements && elements.length) {
    for (let i = 0; i < elements.length; i += 1) {
      elements[i].classList.add('labelled');

      elements[i].innerHTML = text;
    }
  }
};

export const highlightLabels = (
  containerEl: HTMLDivElement,
  keySignature: KeySignatureConfig,
  keyboard: KeyboardSettings,
  midi?: number[],
  chord?: Chord
) => {
  if (!midi) return;

  if (keyboard.label === 'interval') {
    if (chord) {
      const intervals = getChordDegrees(
        chord,
        midi.map((midiNote) => Note.pitchClass(Note.fromMidi(midiNote)))
      );

      for (let i = 0; i < midi.length; i += 1) {
        highlightLabel(containerEl, midi[i], intervals[i]);
      }
    }
  } else if (keyboard.label === 'chordNote') {
    if (chord) {
      const notes = getChordNotes(
        chord,
        midi.map((midiNote) => Note.pitchClass(Note.fromMidi(midiNote)))
      );

      for (let i = 0; i < midi.length; i += 1) {
        highlightLabel(containerEl, midi[i], formatSharpsFlats(notes[i]));
      }
    }
  } else {
    for (let i = 0; i < midi.length; i += 1) {
      const note = Note.get(Note.fromMidi(midi[i]));

      if (keyboard.label === 'note') {
        const displayName = formatSharpsFlats(getNoteInKeySignature(note.name, keySignature.notes));

        highlightLabel(containerEl, midi[i], displayName);
      } else if (keyboard.label === 'pitchClass') {
        const displayName = formatSharpsFlats(
          getNoteInKeySignature(Note.pitchClass(note), keySignature.notes)
        );

        highlightLabel(containerEl, midi[i], displayName);
      }
    }
  }
};

export const highlightWrapLabels = (
  containerEl: HTMLDivElement,
  keySignature: KeySignatureConfig,
  keyboard: KeyboardSettings,
  midi?: number[],
  chord?: Chord
) => {
  if (!midi) return;

  const wrappedMidiNotes = wrapMidiNotes(keyboard.from, keyboard.to, midi);

  if (keyboard.label === 'interval') {
    if (chord) {
      const intervals = getChordDegrees(
        chord,
        wrappedMidiNotes.map((midiNote) =>
          midiNote ? Note.pitchClass(Note.fromMidi(midiNote)) : ''
        )
      );

      for (let i = 0; i < midi.length; i += 1) {
        const wrappedMidiNote = wrappedMidiNotes[i];
        if (wrappedMidiNote !== null) {
          highlightLabel(containerEl, wrappedMidiNote, intervals[i]);
        }
      }
    }
  } else {
    for (let i = 0; i < midi.length; i += 1) {
      const wrappedMidiNote = wrappedMidiNotes[i];
      if (wrappedMidiNote !== null) {
        const note = Note.get(Note.fromMidi(midi[i]));

        if (keyboard.label === 'note') {
          const displayName = formatSharpsFlats(
            getNoteInKeySignature(note.name, keySignature.notes)
          );

          highlightLabel(containerEl, wrappedMidiNote, displayName);
        } else if (keyboard.label === 'pitchClass') {
          const displayName = formatSharpsFlats(
            getNoteInKeySignature(Note.pitchClass(note), keySignature.notes)
          );

          highlightLabel(containerEl, wrappedMidiNote, displayName);
        }
      }
    }
  }
};

export const fadeLabels = (containerEl: HTMLDivElement) => {
  fade(containerEl, 'labelled');
};
