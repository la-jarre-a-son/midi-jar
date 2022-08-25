import React from 'react';
import classnames from 'classnames/bind';

import ButtonGroup from 'renderer/components/ButtonGroup';
import Button from 'renderer/components/Button';
import Icon from 'renderer/components/Icon';
import CustomLink from 'renderer/components/CustomLink';
import TrafficLightButtons from 'renderer/components/TrafficLightButtons';
import { useWindowState } from 'renderer/contexts/WindowState';
import icon from '../../../../../assets/icon.svg';

import styles from './Menu.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
};

/**
 * Main Application Menu
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const Menu: React.FC<Props> = ({ className }: Props) => {
  const { titleBarDoubleClick, isAlwaysOnTop, setAlwaysOnTop } =
    useWindowState();

  const toggleAlwaysOnTop = () => {
    setAlwaysOnTop(!isAlwaysOnTop);
  };

  return (
    <ButtonGroup
      className={cx('base', { 'base--isMac': window.os?.isMac }, className)}
      fullWidth
    >
      <div className={cx('title')} onDoubleClick={titleBarDoubleClick}>
        <CustomLink className={cx('homeButton')} to="/">
          <img className={cx('logo')} src={icon} alt="" />
        </CustomLink>
        <h1 className={cx('appName')}>MIDI Jar</h1>
      </div>
      <Button
        intent="transparent"
        className={cx('button')}
        to="/chords"
        title="Chord Display"
      >
        <Icon name="music" />
        <span className={cx('label')}>Chord Display</span>
      </Button>
      <Button
        intent="transparent"
        className={cx('button')}
        to="/circle-of-fifths"
        title="Circle of Fifths"
      >
        <Icon name="circle-of-fifths" />
        <span className={cx('label')}>Circle of 5th</span>
      </Button>
      <Button to="/settings" className={cx('icon')} title="Settings">
        <Icon name="settings" />
      </Button>
      <Button
        intent={isAlwaysOnTop ? 'warning' : 'default'}
        onClick={toggleAlwaysOnTop}
        className={cx('icon')}
        active={isAlwaysOnTop}
        title="Always on Top"
        hoverVariant
      >
        <Icon name="pin" />
      </Button>
      <Button
        title="Quit App"
        onClick={window.app.quit}
        intent="danger"
        className={cx('icon')}
        hoverVariant
      >
        <Icon name="power" />
      </Button>
      {window.os?.isWindows && (
        <TrafficLightButtons className={cx('trafficLights')} />
      )}
    </ButtonGroup>
  );
};

Menu.defaultProps = defaultProps;

export default Menu;
