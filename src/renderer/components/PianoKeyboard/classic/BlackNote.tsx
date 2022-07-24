import React from 'react';
import classNames from 'classnames';

import { getContrastColor } from 'renderer/helpers/color';
import {
  NOTE_BLACK_WIDTH,
  NOTE_BLACK_HEIGHT,
  NOTE_BLACK_OFFSET,
  NOTE_RADIUS,
  NOTE_TONIC_RADIUS,
  NOTE_BLACK_TONIC_BOTTOM_OFFSET,
  NOTE_BLACK_INTERVAL_BOTTOM_OFFSET,
  NOTE_BLACK_NAME_BOTTOM_OFFSET,
} from './constants';

import styles from './classic.module.scss';

type BlackNoteProps = {
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

const getChromaNoteOffset = (chroma: number) => {
  if (chroma === 1) return -0.5;
  if (chroma === 3) return 0.5;
  if (chroma === 6) return -1;
  if (chroma === 10) return 1;
  return 0;
};

const BlackNote: React.FC<BlackNoteProps> = ({
  name,
  chroma,
  midi,
  color,
  colorHighlight,
  offset,
  displayKeyNames,
  displayDegrees,
  displayTonic,
}) => {
  const offsetX = getChromaNoteOffset(chroma) * NOTE_BLACK_OFFSET;

  return (
    <g
      className={classNames([
        styles.note,
        styles.black,
        `note-${name}`,
        `chroma-${chroma}`,
        `midi-${midi}`,
      ])}
      transform={`translate(${offset - NOTE_BLACK_WIDTH / 2 + offsetX},0)`}
      style={{ color: colorHighlight }}
    >
      <rect
        className={styles.pianoKeyBackground}
        width={NOTE_BLACK_WIDTH}
        height={NOTE_BLACK_HEIGHT + NOTE_RADIUS}
        x="0"
        y={-NOTE_RADIUS}
        rx={NOTE_RADIUS}
        ry={NOTE_RADIUS}
        style={{ fill: color, stroke: getContrastColor(color) }}
      />
      <rect
        className={styles.pianoKey}
        width={NOTE_BLACK_WIDTH}
        height={NOTE_BLACK_HEIGHT + NOTE_RADIUS}
        x="0"
        y={-NOTE_RADIUS}
        rx={NOTE_RADIUS}
        ry={NOTE_RADIUS}
      />
      {displayTonic && (
        <circle
          className={styles.pianoTonic}
          cx={NOTE_BLACK_WIDTH / 2}
          cy={
            NOTE_BLACK_HEIGHT -
            NOTE_BLACK_TONIC_BOTTOM_OFFSET -
            NOTE_TONIC_RADIUS
          }
          r={NOTE_TONIC_RADIUS}
          style={{ fill: getContrastColor(color) }}
        />
      )}
      {displayDegrees && (
        <text
          className={classNames([styles.pianoInterval, 'pianoInterval'])}
          x={NOTE_BLACK_WIDTH / 2}
          y={NOTE_BLACK_HEIGHT - NOTE_BLACK_INTERVAL_BOTTOM_OFFSET}
          textAnchor="middle"
          style={{ fill: getContrastColor(color) }}
        />
      )}
      {displayKeyNames && (
        <text
          className={styles.pianoKeyName}
          x={NOTE_BLACK_WIDTH / 2}
          y={NOTE_BLACK_HEIGHT - NOTE_BLACK_NAME_BOTTOM_OFFSET}
          textAnchor="middle"
          style={{ fill: getContrastColor(color) }}
        >
          {name}
        </text>
      )}
    </g>
  );
};

export default BlackNote;
