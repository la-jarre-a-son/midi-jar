import React from 'react';
import classNames from 'classnames';

import { getContrastColor } from 'renderer/helpers/color';
import {
  NOTE_WHITE_WIDTH,
  NOTE_WHITE_HEIGHT,
  NOTE_RADIUS,
  NOTE_TONIC_RADIUS,
  NOTE_WHITE_TONIC_BOTTOM_OFFSET,
  NOTE_WHITE_INTERVAL_BOTTOM_OFFSET,
  NOTE_WHITE_NAME_BOTTOM_OFFSET,
} from './constants';

import styles from './classic.module.scss';

type WhiteNoteProps = {
  name: string;
  chroma: number;
  midi: number;
  offset: number;
  color: string;
  colorHighlight: string;
  displayKeyNames: boolean;
  displayDegrees: boolean;
  displayTonic: boolean;
};

const WhiteNote: React.FC<WhiteNoteProps> = ({
  name,
  chroma,
  midi,
  offset,
  color,
  colorHighlight,
  displayKeyNames,
  displayDegrees,
  displayTonic,
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
    style={{ color: colorHighlight }}
  >
    <rect
      className={styles.pianoKeyBackground}
      width={NOTE_WHITE_WIDTH}
      height={NOTE_WHITE_HEIGHT + NOTE_RADIUS}
      x="0"
      y={-NOTE_RADIUS}
      rx={NOTE_RADIUS}
      ry={NOTE_RADIUS}
      style={{ fill: color, stroke: getContrastColor(color) }}
    />
    <rect
      className={styles.pianoKey}
      width={NOTE_WHITE_WIDTH}
      height={NOTE_WHITE_HEIGHT + NOTE_RADIUS}
      x="0"
      y={-NOTE_RADIUS}
      rx={NOTE_RADIUS}
      ry={NOTE_RADIUS}
    />

    {displayTonic && (
      <circle
        className={styles.pianoTonic}
        cx={NOTE_WHITE_WIDTH / 2}
        cy={
          NOTE_WHITE_HEIGHT - NOTE_WHITE_TONIC_BOTTOM_OFFSET - NOTE_TONIC_RADIUS
        }
        r={NOTE_TONIC_RADIUS}
        style={{ fill: getContrastColor(color) }}
      />
    )}
    {displayDegrees && (
      <text
        className={classNames([styles.pianoInterval, 'pianoInterval'])}
        x={NOTE_WHITE_WIDTH / 2}
        y={NOTE_WHITE_HEIGHT - NOTE_WHITE_INTERVAL_BOTTOM_OFFSET}
        textAnchor="middle"
        style={{ fill: getContrastColor(color) }}
      />
    )}
    {displayKeyNames && (
      <text
        className={styles.pianoKeyName}
        x={NOTE_WHITE_WIDTH / 2}
        y={NOTE_WHITE_HEIGHT - NOTE_WHITE_NAME_BOTTOM_OFFSET}
        textAnchor="middle"
        style={{ fill: getContrastColor(color) }}
      >
        {name}
      </text>
    )}
  </g>
);

export default WhiteNote;
