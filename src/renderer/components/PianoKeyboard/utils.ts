import { Chord } from '@tonaljs/chord';
import { KeyboardSettings } from 'main/types';
import {
  KeySignatureConfig,
  formatSharpsFlats,
  getChordDegrees,
  getNoteInKeySignature,
} from 'renderer/helpers';
import { Note } from 'tonal';

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
  display: 'none' | 'pitchClass' | 'note' | 'interval',
  midi?: number[],
  chord?: Chord
) => {
  if (!midi) return;

  if (display === 'interval') {
    if (chord) {
      const intervals = getChordDegrees(
        chord,
        midi.map((midiNote) => Note.pitchClass(Note.fromMidi(midiNote)))
      );

      for (let i = 0; i < midi.length; i += 1) {
        highlightLabel(containerEl, midi[i], intervals[i]);
      }
    }
  } else {
    for (let i = 0; i < midi.length; i += 1) {
      const note = Note.get(Note.fromMidi(midi[i]));

      if (display === 'note') {
        const displayName = formatSharpsFlats(getNoteInKeySignature(note.name, keySignature.notes));

        highlightLabel(containerEl, midi[i], displayName);
      } else if (display === 'pitchClass') {
        const displayName = formatSharpsFlats(
          getNoteInKeySignature(Note.pitchClass(note), keySignature.notes)
        );

        highlightLabel(containerEl, midi[i], displayName);
      }
    }
  }
};

export const fadeLabels = (containerEl: HTMLDivElement) => {
  fade(containerEl, 'labelled');
};
