import React from 'react';

import { NoteDef } from './types';
import Note from './Note';

import styles from './flat.module.scss';

type Props = {
  notes: NoteDef[];
  colorHighlight: string;
  colorNoteWhite: string;
  colorNoteBlack: string;
  displayKeyNames: boolean;
  displayDegrees: boolean;
  displayTonic: boolean;
};

const Board: React.FC<Props> = ({
  notes,
  colorNoteWhite,
  colorNoteBlack,
  colorHighlight,
  displayKeyNames,
  displayDegrees,
  displayTonic,
}) => (
  <g className={styles.board} transform="translate(0,0)">
    {notes.map(({ note, isBlack, offset }) => (
      <Note
        key={note.midi}
        name={note.name}
        chroma={note.chroma as number}
        midi={note.midi as number}
        offset={offset}
        color={isBlack ? colorNoteBlack : colorNoteWhite}
        colorHighlight={colorHighlight}
        displayKeyNames={displayKeyNames}
        displayDegrees={displayDegrees}
        displayTonic={displayTonic}
        isBlack={isBlack}
      />
    ))}
  </g>
);

export default Board;
