import React from 'react';

import { KeyboardNotes } from './types';
import WhiteNote from './WhiteNote';
import BlackNote from './BlackNote';

import styles from './classic.module.scss';

type Props = {
  keyboard: KeyboardNotes;
  colorHighlight: string;
  colorNoteWhite: string;
  colorNoteBlack: string;
  displayKeyNames: boolean;
  displayDegrees: boolean;
  displayTonic: boolean;
};

const Board: React.FC<Props> = ({
  keyboard,
  colorNoteWhite,
  colorNoteBlack,
  colorHighlight,
  displayKeyNames,
  displayDegrees,
  displayTonic,
}) => (
  <g className={styles.board} transform="translate(0,0)">
    {keyboard.whites.map(({ note, offset }) => (
      <WhiteNote
        key={note.midi}
        name={note.name}
        chroma={note.chroma as number}
        midi={note.midi as number}
        offset={offset}
        color={colorNoteWhite}
        colorHighlight={colorHighlight}
        displayKeyNames={displayKeyNames}
        displayDegrees={displayDegrees}
        displayTonic={displayTonic}
      />
    ))}
    {keyboard.blacks.map(({ note, offset }) => (
      <BlackNote
        key={note.midi}
        name={note.name}
        chroma={note.chroma as number}
        midi={note.midi as number}
        offset={offset}
        color={colorNoteBlack}
        colorHighlight={colorHighlight}
        displayKeyNames={displayKeyNames}
        displayDegrees={displayDegrees}
        displayTonic={displayTonic}
      />
    ))}
  </g>
);

export default Board;
