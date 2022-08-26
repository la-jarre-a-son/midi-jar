import React, { useCallback } from 'react';
import classnames from 'classnames/bind';
import { Chord } from '@tonaljs/chord';

import { KeySignatureConfig } from 'renderer/helpers/note';

import {
  SIZE,
  CX,
  CY,
  SUSPENDED_OFFSET,
  polar,
  drawSector,
  isInScale,
  isPressed,
  Sector,
} from '../utils';

import styles from '../CircleFifths.module.scss';

import { SectorLabel } from './Label';

const cx = classnames.bind(styles);

type SectorMajorProps = {
  label: string[];
  value: number;
  current: number;
  rotation: number;
  sector: Sector;
  onClick: (value: number) => void;
  chord?: Chord | null;
  keySignature?: KeySignatureConfig;
  displaySuspended: boolean;
};

export const SectorMajor: React.FC<SectorMajorProps> = ({
  label,
  value,
  current,
  rotation,
  chord,
  keySignature,
  onClick,
  sector,
  displaySuspended,
}) => {
  const suspendedOffset = displaySuspended ? SUSPENDED_OFFSET : 0;

  const handleClick = useCallback(() => onClick(value), [value, onClick]);

  return (
    <g
      className={cx('key', 'key--major', {
        'key--selected': value === current,
        'key--isInScale': isInScale(current, value),
        'key--active': isPressed(label[0], 'Major', chord),
        'key--multiple': label.length > 1,
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
          (value - (0.5 - suspendedOffset)) / 12,
          (value + (0.5 - suspendedOffset)) / 12
        )}
        strokeWidth="0.5"
      />
      <circle
        className={cx('badge')}
        cx={polar(CX, CY, sector.middle * SIZE, value / 12)[0]}
        cy={polar(CX, CY, sector.middle * SIZE, value / 12)[1]}
        r="3.6"
      />
      <SectorLabel
        value={value}
        rotation={rotation}
        radius={sector.middle * SIZE}
        fontSize={4}
        label={label}
        tonic={keySignature?.tonic}
        quality=""
      />
    </g>
  );
};

SectorMajor.defaultProps = {
  chord: undefined,
  keySignature: undefined,
};
