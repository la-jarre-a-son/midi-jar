import React from 'react';
import classNames from 'classnames';

import { KeyboardKeys } from './types';
import { KeyboardSizes } from './constants';

import styles from './flat.module.scss';

type Props = {
  keys: KeyboardKeys;
  sizes: KeyboardSizes;
};

const Board: React.FC<Props> = ({ keys, sizes }) => (
  <g className={styles.labels} transform="translate(0,0)">
    {keys.notes.map(({ note, labelOffset }) => (
      <text
        key={note.midi}
        className={classNames([styles.pianoLabel, `label-${note.midi}`])}
        x={labelOffset}
        y={sizes.LABEL_HEIGHT - sizes.LABEL_OFFSET}
        textAnchor="middle"
      />
    ))}
  </g>
);

export default Board;
