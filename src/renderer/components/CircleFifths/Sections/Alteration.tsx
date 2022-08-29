import React, { memo } from 'react';
import classnames from 'classnames/bind';

import { formatSharpsFlats } from 'renderer/helpers/note';

import { CX, CY, drawArc, isKeySelected, Section } from '../utils';

import styles from '../CircleFifths.module.scss';

const cx = classnames.bind(styles);

type SectionAlterationProps = {
  value: number;
  current: number;
  label: string | string[];
  section: Section;
  tonic: string | undefined;
};

const SectionAlteration: React.FC<SectionAlterationProps> = ({
  value,
  current,
  label,
  section,
  tonic,
}) => {
  const labels = Array.isArray(label) ? label : [label];

  const renderFollowPath = (
    <path
      id={`alteration_${value}_followpath`}
      className={cx('followPath')}
      d={drawArc(
        CX,
        CY,
        section.middle,
        (value - 0.5) / 12,
        (value + 0.5) / 12
      )}
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

export default memo(SectionAlteration);
