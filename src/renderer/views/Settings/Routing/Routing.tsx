/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import classnames from 'classnames/bind';

import { useMidiRouting } from 'renderer/contexts/MidiRouting';

import Toolbar from 'renderer/components/Toolbar';
import Button from 'renderer/components/Button';
import Icon from 'renderer/components/Icon';

import LatencyMonitor from './LatencyMonitor';
import Graph from './Graph';

import styles from './Routing.module.scss';

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
  const {
    inputs,
    outputs,
    wires,
    refreshDevices,
    addRoute,
    deleteRoute,
    clearRoutes,
  } = useMidiRouting();

  return (
    <div className={cx('base', className)}>
      <Toolbar className={cx('header')}>
        <div className={cx('latency')}>
          Latency:&nbsp;
          <LatencyMonitor />
        </div>
      </Toolbar>
      <div className={cx('container')}>
        <Graph
          inputs={inputs}
          outputs={outputs}
          wires={wires}
          onAddRoute={addRoute}
          onDeleteRoute={deleteRoute}
        />
      </div>
      <Toolbar bottom>
        <Button onClick={refreshDevices}>
          <Icon name="loading" />
          Refresh devices
        </Button>
        <Button onClick={clearRoutes} intent="danger" hoverVariant>
          <Icon name="trash" />
          Clear all
        </Button>
      </Toolbar>
    </div>
  );
};

Routing.defaultProps = defaultProps;

export default Routing;
