import React, { memo, useCallback } from 'react';
import classnames from 'classnames/bind';
import { Chord } from '@tonaljs/chord';

import { KeySignatureConfig } from 'renderer/helpers/note';

import { Section, CircleOfFifthsConfig } from '../types';
import { CX, CY, polar, drawSection, isChordPressed, isNotePressed } from '../utils';

import styles from '../CircleFifths.module.scss';

import SectionLabel from './Label';

const cx = classnames.bind(styles);

type SectionDiminishedProps = {
  label: string[];
  value: number;
  current: number;
  rotation: number;
  section: Section;
  onClick: (value: number) => void;
  chord?: Chord | null;
  notes?: string[];
  keySignature?: KeySignatureConfig;
  config: CircleOfFifthsConfig;
};

const SectionDiminished: React.FC<SectionDiminishedProps> = ({
  label,
  value,
  current,
  rotation,
  chord,
  notes,
  keySignature,
  onClick,
  section,
  config,
}) => {
  const handleClick = useCallback(() => onClick(value), [value, onClick]);

  return (
    <g
      key={`dim_${value}`}
      className={cx('key', 'key--diminished', {
        'key--selected': value === current,
        'key--active':
          config.highlightSector === 'notes'
            ? isNotePressed(label[0], notes)
            : isChordPressed(label[0], 'dim', chord, config),
        'key--multiple': label.length > 1,
      })}
      onClick={handleClick}
    >
      <path
        className={cx('sector')}
        d={drawSection(CX, CY, section.start, section.end, (value - 0.5) / 12, (value + 0.5) / 12)}
        strokeWidth="0.5"
      />
      <circle
        className={cx('badge')}
        cx={polar(CX, CY, section.middle, value / 12)[0]}
        cy={polar(CX, CY, section.middle, value / 12)[1]}
        r="3"
      />
      <SectionLabel
        rotation={rotation}
        radius={section.middle}
        value={value}
        fontSize={3}
        label={label}
        tonic={keySignature?.tonic}
        quality="dim"
      />
    </g>
  );
};

SectionDiminished.defaultProps = {
  chord: undefined,
  notes: undefined,
  keySignature: undefined,
};

export default memo(SectionDiminished);
