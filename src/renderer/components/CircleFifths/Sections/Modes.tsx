import React, { memo } from 'react';
import classnames from 'classnames/bind';

import {
  CX,
  CY,
  DEGREE_COLORS,
  MODE_OFFSETS,
  MODE_NAMES,
  Section,
  drawArc,
  drawLineSeparator,
  CircleOfFifthsConfig,
} from '../utils';

import styles from '../CircleFifths.module.scss';

const cx = classnames.bind(styles);

type ModesProps = {
  section: Section;
  config: CircleOfFifthsConfig;
};

const Modes: React.FC<ModesProps> = ({ section, config }) => {
  let scale = 'major';

  if (config?.scale === 'major' && config?.displayMajor) {
    scale = 'major';
  }

  if (
    (config?.scale === 'minor' && config?.displayMinor) ||
    (config?.scale === 'major' && !config.displayMajor)
  ) {
    scale = 'minor';
  }

  const scaleOffset = scale === 'minor' ? -3 : 0;

  return (
    <g className={cx('modes')}>
      {MODE_OFFSETS.map((offset, index) => {
        return (
          <g className={cx('mode')} key={index}>
            <path
              id={`mode_${index}_followpath`}
              className={cx('followPath')}
              d={drawArc(
                CX,
                CY,
                section.middle,
                (offset + scaleOffset - 0.5) / 12,
                (offset + scaleOffset + 0.5) / 12
              )}
            />
            <path
              className={cx('modeSeparator')}
              d={drawLineSeparator(
                CX,
                CY,
                section.start,
                section.end,
                (offset + scaleOffset - 0.5) / 12
              )}
              fill={DEGREE_COLORS[index]}
            />
            <text fontSize="1.6" textAnchor="start">
              <textPath href={`#mode_${index}_followpath`} startOffset="2%">
                {MODE_NAMES[index]}
              </textPath>
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default memo(Modes);
