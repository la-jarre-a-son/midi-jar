import React from 'react';
import classnames from 'classnames/bind';
import { Chord } from '@tonaljs/chord';

import {
  formatSharpsFlats,
  getNoteInKeySignature,
  KeySignatureConfig,
} from 'renderer/helpers/note';

import { CX, CY, drawArc, isSameDominant } from '../utils';

import styles from '../CircleFifths.module.scss';

const cx = classnames.bind(styles);

type SectorDominantsProps = {
  value: number;
  current: number;
  label: string | string[];
  radius: number;
  chord?: Chord | null;
  keySignature?: KeySignatureConfig;
};

export const SectorDominants: React.FC<SectorDominantsProps> = ({
  value,
  current,
  label,
  radius,
  chord,
  keySignature,
}) => {
  const labels = Array.isArray(label) ? label : [label];

  return (
    <g
      className={cx('dominants', {
        'dominants--selected': current === value,
      })}
    >
      <path
        id={`dominants_${value}_followpath`}
        d={drawArc(CX, CY, radius, (value - 0.5) / 12, (value + 0.5) / 12)}
      />
      {labels.map((l: string, index: number) => (
        <text
          key={l}
          className={cx({ 'dominant--active': isSameDominant(l, chord) })}
          fontSize="2"
          textAnchor="middle"
        >
          <textPath
            href={`#dominants_${value}_followpath`}
            startOffset={`${(index + 1) * (120 / (labels.length + 1)) - 10}%`}
          >
            {`${formatSharpsFlats(
              keySignature ? getNoteInKeySignature(l, keySignature.notes) : l
            )}7`}
          </textPath>
        </text>
      ))}
    </g>
  );
};

SectorDominants.defaultProps = {
  chord: undefined,
  keySignature: undefined,
};
