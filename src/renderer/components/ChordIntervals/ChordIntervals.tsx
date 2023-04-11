import React, { useMemo } from 'react';
import classnames from 'classnames/bind';

import styles from './ChordIntervals.module.scss';

import { INTERVALS, getPlayedIntervals, isIncludedAs } from './utils';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
  intervals?: string[];
  targets?: string[];
  pitchClasses?: string[];
  tonic?: string | null;
};

const defaultProps = {
  className: undefined,
  intervals: [],
  targets: [],
  pitchClasses: [],
  tonic: null,
};

const ChordIntervals: React.FC<Props> = ({
  className,
  intervals,
  targets,
  pitchClasses,
  tonic,
}) => {
  const played = useMemo(
    () => getPlayedIntervals(tonic, pitchClasses || []),
    [tonic, pitchClasses]
  );

  return (
    <div
      className={cx(
        'base',
        { 'base--withTargets': targets && targets.length },
        className
      )}
    >
      {INTERVALS.BASE.map((i, index) => {
        const activeAs = intervals && isIncludedAs(i, intervals);
        const targetAs = targets && isIncludedAs(i, targets);

        return (
          <div
            className={cx(
              'interval',
              {
                'interval--active': activeAs,
                'interval--target': targetAs,
                'interval--played': played[index],
              },
              `interval--played-${Math.min(4, played[index])}`
            )}
            key={i}
          >
            {activeAs || targetAs ? (
              <span>{activeAs || targetAs}</span>
            ) : (
              [
                <span key="0">{i}</span>,
                <span key="1">{INTERVALS.OCTAVE[index]}</span>,
              ]
            )}
          </div>
        );
      })}
    </div>
  );
};

ChordIntervals.defaultProps = defaultProps;

export default ChordIntervals;
