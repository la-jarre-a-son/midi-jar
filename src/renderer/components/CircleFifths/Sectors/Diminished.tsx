import React, { useCallback } from 'react';
import classnames from 'classnames/bind';
import { Chord } from '@tonaljs/chord';

import { KeySignatureConfig } from 'renderer/helpers/note';

import { SIZE, CX, CY, polar, drawSector, isPressed, Sector } from '../utils';

import styles from '../CircleFifths.module.scss';

import { SectorLabel } from './Label';

const cx = classnames.bind(styles);

type SectorDiminishedProps = {
  label: string[];
  value: number;
  current: number;
  rotation: number;
  sector: Sector;
  onClick: (value: number) => void;
  chord?: Chord | null;
  keySignature?: KeySignatureConfig;
};

export const SectorDiminished: React.FC<SectorDiminishedProps> = ({
  label,
  value,
  current,
  rotation,
  chord,
  keySignature,
  onClick,
  sector,
}) => {
  const handleClick = useCallback(() => onClick(value), [value, onClick]);

  return (
    <g
      key={`dim_${value}`}
      className={cx('key', 'key--diminished', {
        'key--selected': value === current,
        'key--active': isPressed(label[0], 'Diminished', chord),
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
          (value - 0.5) / 12,
          (value + 0.5) / 12
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
        rotation={rotation}
        radius={sector.middle * SIZE}
        value={value}
        fontSize={2.5}
        label={label}
        tonic={keySignature?.tonic}
        quality="dim"
      />
    </g>
  );
};

SectorDiminished.defaultProps = {
  chord: undefined,
  keySignature: undefined,
};
