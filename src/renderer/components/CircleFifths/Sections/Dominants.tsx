import React, { memo } from 'react';
import classnames from 'classnames/bind';
import { Chord } from '@tonaljs/chord';

import { getNoteInKeySignature, KeySignatureConfig } from 'renderer/helpers/note';

import { Section, CircleOfFifthsConfig } from '../types';
import { CX, CY, drawArc, drawSection, isChordPressed, formatLabel } from '../utils';

import styles from '../CircleFifths.module.scss';

const cx = classnames.bind(styles);

type SectionDominantsProps = {
  value: number;
  current: number;
  label: string | string[];
  section: Section;
  chord?: Chord | null;
  keySignature?: KeySignatureConfig;
  config: CircleOfFifthsConfig;
};

const SectionDominants: React.FC<SectionDominantsProps> = ({
  value,
  current,
  label,
  section,
  chord,
  keySignature,
  config,
}) => {
  const labels = Array.isArray(label) ? label : [label];

  return (
    <g
      className={cx('dominants', {
        'dominants--selected': current === value,
      })}
    >
      {labels.map((l: string, index: number) => {
        const angleStart = (value - 0.5 + index / labels.length) / 12;
        const angleEnd = (value - 0.5 + (index + 1) / labels.length) / 12;
        return (
          <g
            key={l}
            className={cx('dominant', {
              'dominant--active': isChordPressed(l, 'dom', chord, config),
              'dominant--isInScale': config?.highlightInScale && index === 0 && current === value,
            })}
          >
            <path
              id={`dominants_${value}_${index}_followpath`}
              className={cx('followPath')}
              d={drawArc(CX, CY, section.middle, angleStart, angleEnd)}
            />
            <path
              className={cx('sector')}
              d={drawSection(CX, CY, section.start, section.end, angleStart, angleEnd)}
              strokeWidth="0.5"
            />
            <text fontSize="2" textAnchor="middle">
              <textPath href={`#dominants_${value}_${index}_followpath`} startOffset="50%">
                {formatLabel(
                  keySignature ? getNoteInKeySignature(l, keySignature.notes) : l,
                  'dom'
                )}
              </textPath>
            </text>
          </g>
        );
      })}
    </g>
  );
};

SectionDominants.defaultProps = {
  chord: undefined,
  keySignature: undefined,
};

export default memo(SectionDominants);
