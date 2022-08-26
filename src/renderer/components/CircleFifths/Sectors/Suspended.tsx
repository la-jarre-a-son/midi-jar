import React, { useCallback } from 'react';
import classnames from 'classnames/bind';
import { Chord } from '@tonaljs/chord';

import { KeySignatureConfig } from 'renderer/helpers/note';

import {
  SIZE,
  CX,
  CY,
  SUSPENDED_OFFSET,
  FIFTHS_MAJOR,
  FIFTHS_MINOR,
  drawSector,
  isSusInScale,
  isPressed,
  Sector,
} from '../utils';

import { SectorSusLabel } from './SusLabel';

import styles from '../CircleFifths.module.scss';

const cx = classnames.bind(styles);

type SectorSuspendedProps = {
  value: number;
  current: number;
  sector: Sector;
  sectorType: 'major' | 'minor';
  quality: 'sus2' | 'sus4';
  onClick: (value: number) => void;
  chord?: Chord | null;
  keySignature?: KeySignatureConfig;
};

export const SectorSuspended: React.FC<SectorSuspendedProps> = ({
  value,
  current,
  chord,
  keySignature,
  onClick,
  sector,
  sectorType,
  quality,
}) => {
  const anchor = quality === 'sus2' ? 1 : -1;
  const label =
    sectorType === 'minor' ? FIFTHS_MINOR[value] : FIFTHS_MAJOR[value];

  const handleClick = useCallback(() => onClick(value), [value, onClick]);

  return (
    <g
      className={cx('key', 'key--suspended', {
        'key--selected': value === current,
        'key--isInScale': isSusInScale(current, value, quality, sectorType),
        'key--active': isPressed(label[0], quality, chord),
      })}
      onClick={handleClick}
    >
      <path
        className={cx('sector')}
        d={drawSector(
          CX,
          CY,
          sector.start * SIZE,
          sector.end * SIZE,
          (value + anchor * 0.5) / 12,
          (value + anchor * (0.5 - SUSPENDED_OFFSET)) / 12
        )}
        strokeWidth="0.5"
      />
      <SectorSusLabel
        value={value}
        radius={sector.middle * SIZE}
        fontSize={1.5}
        label={label}
        keySignature={keySignature}
        quality={quality}
      />
    </g>
  );
};

SectorSuspended.defaultProps = {
  chord: undefined,
  keySignature: undefined,
};
