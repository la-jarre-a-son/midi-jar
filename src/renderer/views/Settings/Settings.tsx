import React from 'react';
import classnames from 'classnames/bind';
import { Outlet } from 'react-router-dom';

import { SidebarContainer, TabList, Toolbar } from '@la-jarre-a-son/ui';
import { NavTab, Icon } from 'renderer/components';

import styles from './Settings.module.scss';

const cx = classnames.bind(styles);

const Settings: React.FC = () => (
  <SidebarContainer
    className={cx('base')}
    sidebar={
      <>
        <TabList
          className={cx('navigation')}
          aria-label="Settings Navigation"
          direction="vertical"
          variant="ghost"
        >
          <NavTab
            className={cx('tab')}
            to="/settings/general"
            title="General"
            left={<Icon name="window" />}
          >
            <span className={cx('label')}>General</span>
          </NavTab>
          <NavTab
            className={cx('tab')}
            to="/settings/routing"
            title="Routing"
            left={<Icon name="routing" />}
          >
            <span className={cx('label')}>Routing</span>
          </NavTab>
          <NavTab
            className={cx('tab')}
            to="/settings/notation"
            title="Music Notation"
            left={<Icon name="music" />}
          >
            <span className={cx('label')}>Music Notation</span>
          </NavTab>
          <NavTab
            className={cx('tab')}
            to="/settings/chords"
            title="Chord Display"
            left={<Icon name="piano" />}
          >
            <span className={cx('label')}>Chord Display</span>
          </NavTab>
          <NavTab
            className={cx('tab')}
            to="/settings/circle-of-fifths"
            title="Circle of 5th"
            left={<Icon name="circle-of-fifths" />}
          >
            <span className={cx('label')}>Circle of 5th</span>
          </NavTab>
          <NavTab
            className={cx('tab')}
            to="/settings/quiz"
            title="Chord Quiz"
            left={<Icon name="quiz" />}
          >
            <span className={cx('label')}>Chord Quiz</span>
          </NavTab>
          <NavTab
            className={cx('tab')}
            to="/settings/debug"
            title="Debugger"
            left={<Icon name="bug" />}
          >
            <span className={cx('label')}>Debugger</span>
          </NavTab>
          <NavTab
            className={cx('tab')}
            to="/settings/licenses"
            title="Licenses"
            left={<Icon name="copyright" />}
          >
            <span className={cx('label')}>Licenses</span>
          </NavTab>
          <NavTab
            className={cx('tab')}
            to="/settings/about"
            title="About"
            left={<Icon name="info" />}
          >
            <span className={cx('label')}>About</span>
          </NavTab>
        </TabList>
        <Toolbar className={cx('footer')} elevation={2} placement="bottom">
          v{process.env.APP_VERSION}
        </Toolbar>
      </>
    }
    size="sm"
    sidebarProps={{ className: cx('sidebar') }}
    contentProps={{ className: cx('content') }}
    open
    inset
  >
    <Outlet />
  </SidebarContainer>
);

export default Settings;
