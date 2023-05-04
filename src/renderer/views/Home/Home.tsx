import React from 'react';
import classnames from 'classnames/bind';

import Link from 'renderer/components/Link';
import Button from 'renderer/components/Button';
import Icon from 'renderer/components/Icon';
import icon from '../../../../assets/icon.svg';

import styles from './Home.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
};

/**
 *  Home page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const Home: React.FC<Props> = ({ className }) => (
  <div className={cx('base', className)}>
    <div className={cx('header')}>
      <img className={cx('logo')} src={icon} alt="" />
      <h1 className={cx('title')}>MIDI Jar</h1>
      <div className={cx('subtitle')}>
        by{' '}
        <a href="https://ljas.fr" target="_blank" rel="noreferrer">
          La Jarre à Son
        </a>
      </div>
    </div>
    <div className={cx('description')}>
      <p>This application regroups a set of features around MIDI:</p>
      <ul>
        <li>Route MIDI messages between devices</li>
        <li>Display chords, notes and a piano as you play</li>
        <li>Integrate in OBS, or in your Web Browser</li>
        <li>Learn with tools like Chord Quiz and Circle of Fifths</li>
      </ul>
      {window.os.isWindows ? (
        <p className={cx('loopMidi')}>
          {
            'NOTE: Standard MIDI drivers are exclusive on Windows. To use MIDI\
            Jar, I recommend using '
          }
          <Link
            to="https://www.tobias-erichsen.de/software/loopmidi.html"
            target="_blank"
          >
            LoopMidi
          </Link>
          {
            ' by Tobias Erichsen to route your MIDI controller to a virtual device that can be connected to by other softwares like your DAW or standalone VST.'
          }
        </p>
      ) : null}
      <div className={cx('cta')}>
        <Button intent="success" to="/settings">
          <Icon name="midi" />
          Start routing your Devices
        </Button>
      </div>
      <p>
        {
          "I plan to add new modules, so don't hesitate to report any bugs, or \
        request new features:"
        }
      </p>
      <div className={cx('cta')}>
        <Button to="https://github.com/la-jarre-a-son/midi-jar/issues">
          <Icon name="github" />
          Report Issues
        </Button>
      </div>
    </div>
  </div>
);

Home.defaultProps = defaultProps;

export default Home;
