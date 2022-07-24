import React from 'react';
import { Note } from '@tonaljs/tonal';

import { range } from 'renderer/helpers';

import { NOTE_WHITE_WIDTH, NOTE_WHITE_HEIGHT } from './constants';
import { KeyboardNotes, NoteDef } from './types';
import Board from './Board';
import SVGDefs from './SVGDefs';

import styles from './classic.module.scss';

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

  const noteStart = fromProps.alt
    ? (fromProps.midi as number) - 1
    : (fromProps.midi as number);

  const noteEnd = toProps.alt
    ? (toProps.midi as number) + 1
    : (toProps.midi as number);

  const start = Math.min(noteStart, noteEnd);
  const end = Math.max(noteStart, noteEnd);
  const keyboard = range(start, end).reduce<KeyboardNotes>(
    (kb: KeyboardNotes, midi: number) => {
      const note =
        accidentals === 'sharp'
          ? Note.fromMidiSharps(midi)
          : Note.fromMidi(midi);
      const def: NoteDef = {
        note: Note.get(note),
        offset: kb.width,
      };

      if (def.note.alt) {
        return {
          width: kb.width,
          height: kb.height,
          whites: kb.whites,
          blacks: [...kb.blacks, def],
        };
      }

      return {
        width: kb.width + NOTE_WHITE_WIDTH,
        height: kb.height,
        whites: [...kb.whites, def],
        blacks: kb.blacks,
      };
    },
    {
      width: 0,
      height: NOTE_WHITE_HEIGHT,
      whites: [],
      blacks: [],
    } as KeyboardNotes
  );

  return (
    <svg
      className={styles.keyboard}
      viewBox={`0 0 ${keyboard.width} ${keyboard.height}`}
    >
      <SVGDefs
        colorNoteWhite={colorNoteWhite || defaultProps.colorNoteWhite}
        colorNoteBlack={colorNoteBlack || defaultProps.colorNoteBlack}
      />
      <Board
        keyboard={keyboard}
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
