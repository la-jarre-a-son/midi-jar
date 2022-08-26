import React from 'react';
import classnames from 'classnames/bind';

import {
  DEGREES_OFFSETS,
  DEGREES_MINOR,
  DEGREES_MAJOR,
  Sectors,
  isSectorDisplayed,
  CircleOfFifthsDisplayConfig,
} from '../utils';

import { DegreeLabel } from './DegreeLabel';

import styles from '../CircleFifths.module.scss';

const cx = classnames.bind(styles);

type DegreesProps = {
  scale: 'major' | 'minor';
  sectors: Sectors;
  displayConfig?: CircleOfFifthsDisplayConfig;
};

export const Degrees: React.FC<DegreesProps> = ({
  scale,
  sectors,
  displayConfig,
}) => {
  const DEGREES = scale === 'minor' ? DEGREES_MINOR : DEGREES_MAJOR;
  return (
    <g className={cx('degrees')}>
      {DEGREES_OFFSETS.map(([sectorType, offset], index) => {
        const displayed = isSectorDisplayed(sectorType, displayConfig);
        const sector = sectors[sectorType];

        return (
          <DegreeLabel
            key={DEGREES[index]}
            anchor={scale === 'minor' ? 'right' : 'left'}
            offset={offset}
            sector={sector}
            label={DEGREES[index]}
            displaySuspended={
              (sectorType === 'major' || sectorType === 'minor') &&
              displayConfig?.displaySuspended
            }
            displayed={displayed}
          />
        );
      })}
    </g>
  );
};

Degrees.defaultProps = {
  displayConfig: {},
};
