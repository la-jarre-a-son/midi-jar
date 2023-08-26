import React, { memo } from 'react';
import classnames from 'classnames/bind';

import { Section } from '../types';
import {
  CX,
  CY,
  DEGREE_COLORS,
  DEGREES_MINOR,
  DEGREE_NAMES,
  DEGREES_MAJOR,
  DEGREE_OFFSETS_MAJOR,
  DEGREE_OFFSETS_MINOR,
  drawSection,
  drawArc,
} from '../utils';

import styles from '../CircleFifths.module.scss';

const cx = classnames.bind(styles);

type DegreesProps = {
  scale: 'major' | 'minor';
  section: Section;
};

const Degrees: React.FC<DegreesProps> = ({ scale, section }) => {
  const offsets = scale === 'minor' ? DEGREE_OFFSETS_MINOR : DEGREE_OFFSETS_MAJOR;
  const degrees = scale === 'minor' ? DEGREES_MINOR : DEGREES_MAJOR;

  const titleOffset = scale === 'minor' ? 2.5 : 5.5;

  return (
    <g className={cx('degrees')}>
      <g className={cx('degreeTitle')}>
        <path
          id={`degree_${scale}_title_followpath`}
          className={cx('followPath')}
          d={drawArc(CX, CY, section.middle, titleOffset / 12, (titleOffset + 5) / 12)}
        />
        <path
          className={cx('degreeSection')}
          d={drawSection(
            CX,
            CY,
            section.start - 0.25,
            section.end + 0.25,
            titleOffset / 12,
            (titleOffset + 5) / 12
          )}
        />
        <text fontSize="1.5" textAnchor="middle">
          <textPath href={`#degree_${scale}_title_followpath`} startOffset="50%">
            {scale === 'minor' ? 'MINOR SCALE - AEOLIAN MODE' : 'MAJOR SCALE - IONIAN MODE'}
          </textPath>
        </text>
      </g>
      {offsets.map((offset, index) => {
        return (
          <g className={cx('degree')} key={index}>
            <path
              id={`degree_${scale}_${index}_followpath`}
              className={cx('followPath')}
              d={drawArc(CX, CY, section.middle, (offset - 0.5) / 12, (offset + 0.5) / 12)}
            />
            <path
              className={cx('degreeSection')}
              d={drawSection(
                CX,
                CY,
                section.start - 0.25,
                section.end + 0.25,
                (offset - 0.5) / 12,
                (offset + 0.5) / 12
              )}
              fill={DEGREE_COLORS[index]}
            />
            <text fontSize="1.5" textAnchor="middle">
              <textPath href={`#degree_${scale}_${index}_followpath`} startOffset="50%">
                {`${degrees[index]} - ${DEGREE_NAMES[index]}`}
              </textPath>
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default memo(Degrees);
