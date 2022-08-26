import React from 'react';
import classnames from 'classnames/bind';

import { formatSharpsFlats } from 'renderer/helpers/note';

import { CX, CY, drawArc, isKeySelected } from '../utils';

import styles from '../CircleFifths.module.scss';

const cx = classnames.bind(styles);

type SectorAlterationProps = {
  value: number;
  current: number;
  label: string | string[];
  radius: number;
  tonic: string | undefined;
};

export const SectorAlteration: React.FC<SectorAlterationProps> = ({
  value,
  current,
  label,
  radius,
  tonic,
}) => {
  const labels = Array.isArray(label) ? label : [label];

  const renderFollowPath = (
    <path
      id={`alteration_${value}_followpath`}
      d={drawArc(CX, CY, radius, (value - 0.5) / 12, (value + 0.5) / 12)}
    />
  );

  if (labels.length > 1) {
    return (
      <g
        className={cx('alterations', {
          'alterations--selected': value === current,
        })}
      >
        {renderFollowPath}
        <text
          className={cx({
            'alteration--selected': isKeySelected(value, 0, tonic),
          })}
          fontSize="3"
          textAnchor="middle"
        >
          <textPath href={`#alteration_${value}_followpath`} startOffset="33%">
            {formatSharpsFlats(labels[0])}
          </textPath>
        </text>
        <text
          className={cx({
            'alteration--selected': isKeySelected(value, 1, tonic),
          })}
          fontSize="3"
          textAnchor="middle"
        >
          <textPath href={`#alteration_${value}_followpath`} startOffset="66%">
            {formatSharpsFlats(labels[1])}
          </textPath>
        </text>
      </g>
    );
  }

  return (
    <g
      className={cx('alterations', {
        'alterations--selected': value === current,
      })}
    >
      {renderFollowPath}
      <text
        className={cx('alteration--selected')}
        fontSize="3"
        textAnchor="middle"
      >
        <textPath href={`#alteration_${value}_followpath`} startOffset="50%">
          {formatSharpsFlats(labels[0])}
        </textPath>
      </text>
    </g>
  );
};
