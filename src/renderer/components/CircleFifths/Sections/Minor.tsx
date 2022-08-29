import React, { memo, useCallback } from 'react';
import classnames from 'classnames/bind';
import { Chord } from '@tonaljs/chord';

import { KeySignatureConfig } from 'renderer/helpers/note';

import {
  CX,
  CY,
  SUSPENDED_OFFSET,
  polar,
  drawSection,
  isInScale,
  isChordPressed,
  Section,
  CircleOfFifthsConfig,
  isNotePressed,
  isMainSection,
} from '../utils';

import styles from '../CircleFifths.module.scss';

import SectionLabel from './Label';

const cx = classnames.bind(styles);

type SectionMinorProps = {
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

const SectionMinor: React.FC<SectionMinorProps> = ({
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
  const suspendedOffset = config.displaySuspended ? SUSPENDED_OFFSET : 0;

  const handleClick = useCallback(() => onClick(value), [value, onClick]);

  return (
    <g
      className={cx('key', 'key--minor', {
        'key--isMainSection': isMainSection('minor', config),
        'key--selected': value === current,
        'key--isInScale': config?.highlightInScale && isInScale(current, value),
        'key--active':
          config.highlightSector === 'notes'
            ? isNotePressed(label[0], notes)
            : isChordPressed(label[0], 'minor', chord, config),
        'key--multiple': label.length > 1,
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
          (value - (0.5 - suspendedOffset)) / 12,
          (value + (0.5 - suspendedOffset)) / 12
        )}
        strokeWidth="0.5"
      />
      <circle
        className={cx('badge')}
        cx={polar(CX, CY, section.middle, value / 12)[0]}
        cy={polar(CX, CY, section.middle, value / 12)[1]}
        r="3.6"
      />
      <SectionLabel
        rotation={rotation}
        radius={section.middle}
        value={value}
        fontSize={4}
        label={label}
        tonic={keySignature?.tonic}
        quality="minor"
      />
    </g>
  );
};

SectionMinor.defaultProps = {
  chord: undefined,
  notes: undefined,
  keySignature: undefined,
};

export default memo(SectionMinor);
