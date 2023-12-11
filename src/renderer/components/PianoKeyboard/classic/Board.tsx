import React from 'react';

import { KeyboardSettings } from 'main/types';
import { KeyboardKeys } from './types';
import WhiteNote from './WhiteNote';
import BlackNote from './BlackNote';

import styles from './classic.module.scss';
import { KeyboardSizes } from './constants';

type Props = {
  keys: KeyboardKeys;
  sizes: KeyboardSizes;
  keyboard: KeyboardSettings;
};

const Board: React.FC<Props> = ({ keys, keyboard, sizes }) => (
  <g
    className={styles.board}
    transform={`translate(0,${keyboard.label === 'none' ? 0 : sizes.LABEL_HEIGHT})`}
    mask="url(#boardMask)"
  >
    {keys.whites.map(({ displayName, note, offset }) => (
      <WhiteNote
        key={note.midi}
        name={note.name}
        displayName={displayName}
        chroma={note.chroma as number}
        midi={note.midi as number}
        offset={offset}
        keyName={keyboard.keyName}
        sizes={sizes}
      />
    ))}
    {keys.blacks.map(({ displayName, note, offset }) => (
      <BlackNote
        key={note.midi}
        name={note.name}
        displayName={displayName}
        chroma={note.chroma as number}
        midi={note.midi as number}
        offset={offset}
        keyName={keyboard.keyName}
        sizes={sizes}
      />
    ))}
  </g>
);

export default Board;
