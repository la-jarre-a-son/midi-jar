import React from 'react';

import { KeyboardSettings } from 'main/types';

import { NoteDef } from './types';
import Note from './Note';

import styles from './flat.module.scss';
import { KeyboardSizes } from './constants';

type Props = {
  keyboard: KeyboardSettings;
  notes: NoteDef[];
  sizes: KeyboardSizes;
};

const Board: React.FC<Props> = ({ keyboard, notes, sizes }) => (
  <g
    className={styles.board}
    transform={`translate(0,${keyboard.label === 'none' ? 0 : sizes.LABEL_HEIGHT})`}
  >
    {notes.map(({ displayName, note, isBlack, offset }) => (
      <Note
        key={note.midi}
        sizes={sizes}
        name={note.name}
        displayName={displayName}
        chroma={note.chroma as number}
        midi={note.midi as number}
        offset={offset}
        keyName={keyboard.keyName}
        isBlack={isBlack}
      />
    ))}
  </g>
);

export default Board;
