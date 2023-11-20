import React from 'react';
import classnames from 'classnames/bind';

import { Button, ButtonGroup, Stack, ToggleButton, Toolbar } from '@la-jarre-a-son/ui';

import { useWindowState } from 'renderer/contexts/WindowState';
import { NavButton, Icon } from 'renderer/components';

import AppBreadcrumb from './AppBreadcrumb';
import TrafficLightButtons from './TrafficLightButtons';

import styles from './Layout.module.scss';

const cx = classnames.bind(styles);

const TopBar: React.FC = () => {
  const { windowState, titleBarDoubleClick, setAlwaysOnTop } = useWindowState();

  const toggleAlwaysOnTop = () => {
    setAlwaysOnTop(!windowState.alwaysOnTop);
  };

  return (
    <Toolbar
      as={Stack}
      elevation={3}
      className={cx('topbar', { 'topbar--isMac': window.os?.isMac })}
    >
      <AppBreadcrumb />
      <div className={cx('titlebar')} onDoubleClick={titleBarDoubleClick} />
      <ButtonGroup>
        <NavButton to="/settings" aria-label="Settings" icon>
          <Icon name="settings" />
        </NavButton>
        <ToggleButton
          selectedIntent="warning"
          onClick={toggleAlwaysOnTop}
          selected={windowState.alwaysOnTop}
          aria-label="Always on Top"
          icon
        >
          <Icon name="pin" />
        </ToggleButton>
        <Button aria-label="Quit App" onClick={window.app.quit} intent="danger" icon hoverIntent>
          <Icon name="power" />
        </Button>
      </ButtonGroup>
      {window.os?.isWindows && <TrafficLightButtons className={cx('trafficLights')} />}
    </Toolbar>
  );
};

export default TopBar;
