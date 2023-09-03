/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import classnames from 'classnames/bind';

import { useMidiRouting } from 'renderer/contexts/MidiRouting';
import { Box, Toolbar, Button, ButtonGroup } from '@la-jarre-a-son/ui';
import { Icon } from 'renderer/components';

import LatencyMonitor from './LatencyMonitor';
import Graph from './Graph';

import styles from './Routing.module.scss';

const cx = classnames.bind(styles);

const Routing: React.FC = () => {
  const { inputs, outputs, wires, refreshDevices, addRoute, deleteRoute, clearRoutes } =
    useMidiRouting();

  return (
    <div className={cx('base')}>
      <Toolbar elevation={2}>
        <div className={cx('latency')}>
          Latency:&nbsp;
          <LatencyMonitor />
        </div>
      </Toolbar>
      <Box pad="md" className={cx('container')}>
        <Graph
          inputs={inputs}
          outputs={outputs}
          wires={wires}
          onAddRoute={addRoute}
          onDeleteRoute={deleteRoute}
        />
      </Box>
      <Toolbar elevation={2} placement="bottom">
        <ButtonGroup>
          <Button onClick={refreshDevices} intent="neutral">
            <Icon name="loading" />
            Refresh devices
          </Button>
          <Button onClick={clearRoutes} intent="danger" hoverIntent>
            <Icon name="trash" />
            Clear all
          </Button>
        </ButtonGroup>
      </Toolbar>
    </div>
  );
};

export default Routing;
