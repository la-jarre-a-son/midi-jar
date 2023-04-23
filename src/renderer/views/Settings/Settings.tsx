import React from 'react';
import classnames from 'classnames/bind';
import { Outlet } from 'react-router-dom';

import ButtonGroup from 'renderer/components/ButtonGroup';
import Button from 'renderer/components/Button';
import Icon from 'renderer/components/Icon';

import styles from './Settings.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

/**
 *  Settings page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const Settings: React.FC<Props> = ({ className }) => (
  <div className={cx('base', className)}>
    <div className={cx('navigation')}>
      <ButtonGroup className={cx('tabs')} fullWidth>
        <Button
          className={cx('tab')}
          intent="transparent"
          to="/settings/general"
          title="General"
        >
          <Icon name="window" />
          <span className={cx('label')}>General</span>
        </Button>
        <Button
          className={cx('tab')}
          intent="transparent"
          to="/settings/routing"
          title="Routing"
        >
          <Icon name="routing" />
          <span className={cx('label')}>Routing</span>
        </Button>
        <Button
          className={cx('tab')}
          intent="transparent"
          to="/settings/notation"
          title="Music Notation"
        >
          <Icon name="music" />
          <span className={cx('label')}>Music Notation</span>
        </Button>
        <Button
          className={cx('tab')}
          intent="transparent"
          to="/settings/chords"
          title="Chord Display"
        >
          <Icon name="piano" />
          <span className={cx('label')}>Chord Display</span>
        </Button>
        <Button
          className={cx('tab')}
          intent="transparent"
          to="/settings/circle-of-fifths"
          title="Circle of 5th"
        >
          <Icon name="circle-of-fifths" />
          <span className={cx('label')}>Circle of 5th</span>
        </Button>
        <Button
          className={cx('tab')}
          intent="transparent"
          to="/settings/quiz"
          title="Chord Quiz"
        >
          <Icon name="quiz" />
          <span className={cx('label')}>Chord Quiz</span>
        </Button>
        <Button
          className={cx('tab')}
          intent="transparent"
          to="/settings/server"
          title="Server"
        >
          <Icon name="server" />
          <span className={cx('label')}>Server</span>
        </Button>
        <Button
          className={cx('tab')}
          intent="transparent"
          to="/settings/debug"
          title="Debugger"
        >
          <Icon name="bug" />
          <span className={cx('label')}>Debugger</span>
        </Button>
        <Button
          className={cx('tab')}
          intent="transparent"
          to="/settings/credits"
          title="Credits"
        >
          <Icon name="heart" />
          <span className={cx('label')}>Credits</span>
        </Button>
        <Button
          className={cx('tab')}
          intent="transparent"
          to="/settings/licenses"
          title="Licenses"
        >
          <Icon name="info" />
          <span className={cx('label')}>Licenses</span>
        </Button>
      </ButtonGroup>
      <div className={cx('version')}>v{process.env.APP_VERSION}</div>
    </div>
    <div className={cx('content')}>
      <Outlet />
    </div>
  </div>
);

Settings.defaultProps = defaultProps;

export default Settings;
