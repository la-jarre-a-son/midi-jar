import React from 'react';
import classnames from 'classnames/bind';

import {
  formatSharpsFlats,
  KeySignatureConfig,
  getNoteInKeySignature,
} from 'renderer/helpers/note';

import { CX, CY, SUSPENDED_OFFSET, polar, cPolar } from '../utils';

import styles from '../CircleFifths.module.scss';

const cx = classnames.bind(styles);

type SectorSusLabelProps = {
  value: number;
  label: string | string[];
  radius: number;
  fontSize: number;
  keySignature?: KeySignatureConfig;
  quality: string;
};

export const SectorSusLabel: React.FC<SectorSusLabelProps> = ({
  value,
  label,
  radius,
  fontSize,
  keySignature,
  quality,
}) => {
  const labels = Array.isArray(label) ? label : [label];
  const angle =
    quality === 'sus4'
      ? (value - (0.5 - SUSPENDED_OFFSET / 2)) / 12
      : (value + (0.5 - SUSPENDED_OFFSET / 2)) / 12;

  return (
    <text
      className={cx('name', 'name--sus')}
      x={polar(CX, CY, radius, angle)[0]}
      y={polar(CX, CY, radius, angle)[1]}
      textAnchor="middle"
      fontSize={fontSize}
      dy={0.33 * fontSize}
      transform={`rotate(${
        angle * 360 + (quality === 'sus4' ? -90 : +90)
      }, ${cPolar(CX, CY, radius, angle)})`}
    >
      {formatSharpsFlats(
        getNoteInKeySignature(labels[0], keySignature?.notes)
      ) + quality}
    </text>
  );
};

SectorSusLabel.defaultProps = {
  keySignature: undefined,
};
