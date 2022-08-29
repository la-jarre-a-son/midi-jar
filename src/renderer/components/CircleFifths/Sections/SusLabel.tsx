import React, { memo } from 'react';
import classnames from 'classnames/bind';

import {
  KeySignatureConfig,
  getNoteInKeySignature,
} from 'renderer/helpers/note';

import {
  CX,
  CY,
  SUSPENDED_OFFSET,
  polar,
  cPolar,
  Section,
  formatLabel,
} from '../utils';

import styles from '../CircleFifths.module.scss';

const cx = classnames.bind(styles);

type SectionSusLabelProps = {
  value: number;
  label: string | string[];
  section: Section;
  fontSize: number;
  keySignature?: KeySignatureConfig;
  quality: string;
};

const SectionSusLabel: React.FC<SectionSusLabelProps> = ({
  value,
  label,
  section,
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
      x={polar(CX, CY, section.middle, angle)[0]}
      y={polar(CX, CY, section.middle, angle)[1]}
      textAnchor="middle"
      fontSize={fontSize}
      dy={0.33 * fontSize}
      transform={`rotate(${
        angle * 360 + (quality === 'sus4' ? -90 : +90)
      }, ${cPolar(CX, CY, section.middle, angle)})`}
    >
      {formatLabel(
        getNoteInKeySignature(labels[0], keySignature?.notes),
        quality
      )}
    </text>
  );
};

SectionSusLabel.defaultProps = {
  keySignature: undefined,
};

export default memo(SectionSusLabel);
