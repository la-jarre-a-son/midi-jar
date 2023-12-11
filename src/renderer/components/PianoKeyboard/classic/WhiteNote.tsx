import React from 'react';
import classNames from 'classnames';

import { KeyboardSizes } from './constants';

import styles from './classic.module.scss';

type WhiteNoteProps = {
  name: string;
  displayName: string;
  chroma: number;
  midi: number;
  offset: number;
  keyName: 'none' | 'octave' | 'pitchClass' | 'note';
  sizes: KeyboardSizes;
};

const WhiteNote: React.FC<WhiteNoteProps> = ({
  name,
  displayName,
  chroma,
  midi,
  offset,
  keyName,
  sizes,
}) => (
  <g
    className={classNames([
      styles.note,
      styles.white,
      `note-${name}`,
      `chroma-${chroma}`,
      `midi-${midi}`,
    ])}
    transform={`translate(${offset},0)`}
  >
    <rect
      className={styles.pianoKeyBackground}
      width={sizes.WHITE_WIDTH}
      height={sizes.WHITE_HEIGHT + sizes.RADIUS}
      x="0"
      y={-sizes.RADIUS}
      rx={sizes.RADIUS}
      ry={sizes.RADIUS}
    />
    <rect
      className={styles.pianoKey}
      width={sizes.WHITE_WIDTH}
      height={sizes.WHITE_HEIGHT + sizes.RADIUS}
      x="0"
      y={-sizes.RADIUS}
      rx={sizes.RADIUS}
      ry={sizes.RADIUS}
    />
    <circle
      className={styles.pianoTonic}
      cx={sizes.WHITE_WIDTH / 2}
      cy={sizes.WHITE_HEIGHT - sizes.WHITE_INFO_OFFSET}
      r={sizes.TONIC_RADIUS}
    />
    <text
      className={classNames([styles.pianoInfo, 'pianoInfo'])}
      x={sizes.WHITE_WIDTH / 2}
      y={sizes.WHITE_HEIGHT - sizes.WHITE_INFO_OFFSET}
      textAnchor="middle"
      alignmentBaseline="mathematical"
    />
    {keyName !== 'none' && (
      <text
        className={styles.pianoKeyName}
        x={sizes.WHITE_WIDTH / 2}
        y={sizes.WHITE_HEIGHT - sizes.WHITE_NAME_OFFSET}
        textAnchor="middle"
        alignmentBaseline="baseline"
      >
        {displayName}
      </text>
    )}
  </g>
);

export default WhiteNote;
