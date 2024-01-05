import React from 'react';
import classnames from 'classnames/bind';

import useMidiLatency from 'renderer/hooks/useMidiLatency';

import styles from './LatencyMonitor.module.scss';

const cx = classnames.bind(styles);

const Routing: React.FC = () => {
  const [current, highest, resetHighest] = useMidiLatency();

  return (
    <div className={cx('base')}>
      <div className={cx('current')} title="average routing latency">{`${current.toFixed(
        3
      )}ms`}</div>
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

export default Routing;
