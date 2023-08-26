import React, { memo } from 'react';
import classNames from 'classnames/bind';

import { formatSharpsFlats } from 'renderer/helpers/note';

import { Section } from '../types';
import { CX, CY, SUSPENDED_OFFSET, polar } from '../utils';

import styles from '../CircleFifths.module.scss';

const cx = classNames.bind(styles);

type DegreeLabelProps = {
  offset: number;
  section: Section;
  label: string;
  anchor?: 'left' | 'right';
  displaySuspended?: boolean;
};

const DegreeLabel: React.FC<DegreeLabelProps> = ({
  offset,
  section,
  anchor,
  label,
  displaySuspended,
}) => {
  const value = offset < 0 ? 12 + offset : offset;
  const suspendedOffset = displaySuspended ? SUSPENDED_OFFSET : 0;
  const ANGLE_OFFSET = anchor === 'left' ? -0.46 + suspendedOffset : 0.46 - suspendedOffset;
  const fontSize = (section.start - section.end) / 7;

  const WHEEL_OFFSET = -1.2 * fontSize;
  const COORDS = polar(CX, CY, section.start + WHEEL_OFFSET, (value + ANGLE_OFFSET) / 12);

  return (
    <text
      className={cx('degreeLabel')}
      x={COORDS[0]}
      y={COORDS[1]}
      textAnchor={anchor === 'left' ? 'start' : 'end'}
      fontSize={fontSize}
      transform={`rotate(${(value + ANGLE_OFFSET) * 30}, ${COORDS[0]}, ${COORDS[1]})`}
    >
      {formatSharpsFlats(label)}
    </text>
  );
};

DegreeLabel.defaultProps = {
  anchor: 'left',
  displaySuspended: false,
};

export default memo(DegreeLabel);
