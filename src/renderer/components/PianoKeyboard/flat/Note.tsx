import React from 'react';
import classNames from 'classnames';

import { getContrastColor } from 'renderer/helpers/color';
import {
  NOTE_WIDTH,
  NOTE_HEIGHT,
  NOTE_TONIC_RADIUS,
  NOTE_TONIC_BOTTOM_OFFSET,
  NOTE_INTERVAL_BOTTOM_OFFSET,
  NOTE_NAME_BOTTOM_OFFSET,
} from './constants';

import styles from './flat.module.scss';

type NoteProps = {
  name: string;
  displayName: string;
  chroma: number;
  midi: number;
  offset: number;
  color: string;
  colorHighlight: string;
  displayKeyNames: boolean;
  displayDegrees: boolean;
  displayTonic: boolean;
  isBlack: boolean;
};

const WhiteNote: React.FC<NoteProps> = ({
  name,
  displayName,
  chroma,
  midi,
  offset,
  color,
  colorHighlight,
  displayKeyNames,
  displayDegrees,
  displayTonic,
  isBlack,
}) => (
  <g
    className={classNames([
      styles.note,
      isBlack ? styles.black : styles.white,
      `note-${name}`,
      `chroma-${chroma}`,
      `midi-${midi}`,
    ])}
    transform={`translate(${offset},0)`}
    style={{ color: colorHighlight }}
  >
    <rect
      className={styles.pianoKey}
      width={NOTE_WIDTH}
      height={NOTE_HEIGHT}
      style={{ fill: color }}
      x="0"
      y="0"
    />

    {displayTonic && (
      <circle
        className={styles.pianoTonic}
        cx={NOTE_WIDTH / 2}
        cy={NOTE_HEIGHT - NOTE_TONIC_BOTTOM_OFFSET - NOTE_TONIC_RADIUS}
        r={NOTE_TONIC_RADIUS}
        style={{ fill: getContrastColor(color) }}
      />
    )}
    {displayDegrees && (
      <text
        className={classNames([styles.pianoInterval, 'pianoInterval'])}
        x={NOTE_WIDTH / 2}
        y={NOTE_HEIGHT - NOTE_INTERVAL_BOTTOM_OFFSET}
        textAnchor="middle"
        style={{ fill: getContrastColor(color) }}
      />
    )}
    {displayKeyNames && (
      <text
        className={styles.pianoKeyName}
        x={NOTE_WIDTH / 2}
        y={NOTE_HEIGHT - NOTE_NAME_BOTTOM_OFFSET}
        textAnchor="middle"
        style={{ fill: getContrastColor(color) }}
      >
        {displayName}
      </text>
    )}
  </g>
);

export default WhiteNote;
