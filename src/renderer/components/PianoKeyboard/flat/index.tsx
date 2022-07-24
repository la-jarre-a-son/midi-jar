import React from 'react';
import { Note } from '@tonaljs/tonal';

import { range } from 'renderer/helpers';

import { NOTE_WIDTH, NOTE_HEIGHT } from './constants';
import { KeyboardNotes, NoteDef } from './types';
import Board from './Board';

import styles from './flat.module.scss';

type KeyboardProps = {
  from?: string;
  to?: string;
  accidentals?: 'flat' | 'sharp';
  colorHighlight?: string;
  colorNoteWhite?: string;
  colorNoteBlack?: string;
  displayKeyNames?: boolean;
  displayDegrees?: boolean;
  displayTonic?: boolean;
};

const defaultProps = {
  from: 'C2',
  to: 'C5',
  accidentals: 'flat' as const,
  colorHighlight: '#315bce',
  colorNoteWhite: '#ffffff',
  colorNoteBlack: '#000000',
  displayKeyNames: true,
  displayDegrees: true,
  displayTonic: true,
};

const Keyboard: React.FC<KeyboardProps> = ({
  from = defaultProps.from,
  to = defaultProps.to,
  accidentals = defaultProps.accidentals,
  colorNoteWhite,
  colorNoteBlack,
  colorHighlight,
  displayKeyNames,
  displayDegrees,
  displayTonic,
}) => {
  const fromProps = Note.get(Note.simplify(from) || defaultProps.from);
  const toProps = Note.get(Note.simplify(to) || defaultProps.to);

  const noteStart = fromProps.midi as number;
  const noteEnd = toProps.midi as number;

  const start = Math.min(noteStart, noteEnd);
  const end = Math.max(noteStart, noteEnd);
  const keyboard = range(start, end).reduce<KeyboardNotes>(
    (kb: KeyboardNotes, midi: number) => {
      const note =
        accidentals === 'sharp'
          ? Note.fromMidiSharps(midi)
          : Note.fromMidi(midi);
      const noteDef = Note.get(note);
      const def: NoteDef = {
        note: noteDef,
        offset: kb.width,
        isBlack: !!noteDef.alt,
      };

      return {
        width: kb.width + NOTE_WIDTH,
        height: kb.height,
        notes: [...kb.notes, def],
      };
    },
    {
      width: 0,
      height: NOTE_HEIGHT,
      notes: [],
    } as KeyboardNotes
  );

  return (
    <svg
      className={styles.keyboard}
      viewBox={`0 0 ${keyboard.width} ${keyboard.height}`}
    >
      <Board
        notes={keyboard.notes}
        colorNoteWhite={colorNoteWhite || defaultProps.colorNoteWhite}
        colorNoteBlack={colorNoteBlack || defaultProps.colorNoteBlack}
        colorHighlight={colorHighlight || defaultProps.colorHighlight}
        displayKeyNames={displayKeyNames ?? defaultProps.displayKeyNames}
        displayDegrees={displayDegrees ?? defaultProps.displayDegrees}
        displayTonic={displayTonic ?? defaultProps.displayTonic}
      />
    </svg>
  );
};

Keyboard.defaultProps = defaultProps;

export default React.memo(Keyboard);
