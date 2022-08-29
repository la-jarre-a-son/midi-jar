import React, { memo, useCallback } from 'react';
import classnames from 'classnames/bind';
import { Chord } from '@tonaljs/chord';

import { KeySignatureConfig } from 'renderer/helpers/note';

import {
  CX,
  CY,
  SUSPENDED_OFFSET,
  FIFTHS_MAJOR,
  FIFTHS_MINOR,
  drawSection,
  isSusInScale,
  isChordPressed,
  Section,
  CircleOfFifthsConfig,
} from '../utils';

import SectionSusLabel from './SusLabel';

import styles from '../CircleFifths.module.scss';

const cx = classnames.bind(styles);

type SectionSuspendedProps = {
  value: number;
  current: number;
  section: Section;
  sectionType: 'major' | 'minor';
  quality: 'sus2' | 'sus4';
  onClick: (value: number) => void;
  chord?: Chord | null;
  keySignature?: KeySignatureConfig;
  config: CircleOfFifthsConfig;
};

const SectionSuspended: React.FC<SectionSuspendedProps> = ({
  value,
  current,
  chord,
  keySignature,
  onClick,
  section,
  sectionType,
  quality,
  config,
}) => {
  const anchor = quality === 'sus2' ? 1 : -1;
  const label =
    sectionType === 'minor' ? FIFTHS_MINOR[value] : FIFTHS_MAJOR[value];

  const handleClick = useCallback(() => onClick(value), [value, onClick]);

  return (
    <g
      className={cx('key', 'key--suspended', {
        'key--selected': value === current,
        'key--isInScale': isSusInScale(current, value, quality, sectionType),
        'key--active': isChordPressed(label[0], quality, chord, config),
      })}
      onClick={handleClick}
    >
      <path
        className={cx('sector')}
        d={drawSection(
          CX,
          CY,
          section.start,
          section.end,
          (value + anchor * 0.5) / 12,
          (value + anchor * (0.5 - SUSPENDED_OFFSET)) / 12
        )}
        strokeWidth="0.5"
      />
      <SectionSusLabel
        value={value}
        section={section}
        fontSize={1.5}
        label={label}
        keySignature={keySignature}
        quality={quality}
      />
    </g>
  );
};

SectionSuspended.defaultProps = {
  chord: undefined,
  keySignature: undefined,
};

export default memo(SectionSuspended);
