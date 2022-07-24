/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import classnames from 'classnames/bind';

import useMidiLatency from 'renderer/hooks/useMidiLatency';

import styles from './LatencyMonitor.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

/**
 * Routing settings page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const Routing: React.FC<Props> = ({ className }) => {
  const [current, highest, resetHighest] = useMidiLatency();

  return (
    <div className={cx('base', className)}>
      <div
        className={cx('current')}
        title="average routing latency"
      >{`${current.toFixed(3)}ms`}</div>
      <button
        type="button"
        className={cx('highest')}
        onClick={resetHighest}
        title="highest routing latency"
      >
        {`${highest.toFixed(3)}ms`}
      </button>
    </div>
  );
};

Routing.defaultProps = defaultProps;

export default Routing;
