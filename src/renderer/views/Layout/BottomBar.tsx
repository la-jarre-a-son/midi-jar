import React from 'react';
import classnames from 'classnames/bind';

import { Stack, StackSeparator, Toolbar } from '@la-jarre-a-son/ui';

import styles from './Layout.module.scss';
import LatencyMonitor from './LatencyMonitor';
import { QuickChangeKeyToolbar } from '../Settings/NotationSettings';

const cx = classnames.bind(styles);

const BottomBar: React.FC = () => {
  return (
    <Toolbar as={Stack} elevation={3} placement="bottom" className={cx('bottombar')}>
      <QuickChangeKeyToolbar />
      <StackSeparator />
      <LatencyMonitor />
    </Toolbar>
  );
};

export default BottomBar;
