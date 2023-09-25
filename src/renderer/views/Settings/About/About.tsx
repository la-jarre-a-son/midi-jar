import React from 'react';
import classnames from 'classnames/bind';

import { Badge, Box, Button, Container, Link, Stack } from '@la-jarre-a-son/ui';

import logo from 'renderer/assets/logo.svg';
import { Icon } from 'renderer/components';

import Credits from './Credits';
import { CREDIT_ITEMS } from './constants';

import styles from './About.module.scss';
import Changelog from './Changelog';

const cx = classnames.bind(styles);

const About: React.FC = () => (
  <Container className={cx('base')} size="xl">
    <div className={cx('header')}>
      <img className={cx('logo')} src={logo} alt="" />
      <h1 className={cx('appname')}>
        MIDI Jar <Badge className={cx('version')}>{process.env.APP_VERSION}</Badge>
      </h1>
      <div className={cx('author')}>
        {'by Rémi Jarasson / '}
        <Link href="https://ljas.fr" target="_blank" rel="noreferrer">
          La Jarre à Son
        </Link>
      </div>
    </div>
    {window.os.isWindows ? (
      <Box
        as={Stack}
        elevation={1}
        pad="md"
        className={cx('loopMidi')}
        outlined
        gap="md"
        direction="vertical"
      >
        <p>
          {
            'NOTE: Standard MIDI drivers are exclusive on Windows. To use MIDI\
            Jar, I recommend using '
          }
          <Link href="https://www.tobias-erichsen.de/software/loopmidi.html" target="_blank">
            LoopMidi
          </Link>
          {
            ' by Tobias Erichsen to route your MIDI controller to a virtual device that can be connected to by other softwares like your DAW or standalone VST.'
          }
        </p>
        <Stack justify="end">
          <Button
            as="a"
            target="_blank"
            rel="noreferrer"
            href="https://www.tobias-erichsen.de/software/loopmidi.html"
          >
            <Icon name="midi" />
            Download LoopMIDI
          </Button>
        </Stack>
      </Box>
    ) : null}
    <h2 className={cx('title')}>Features</h2>
    <div className={cx('description')}>
      <p>This application regroups a set of features around MIDI:</p>
      <ul>
        <li>Route MIDI messages between devices</li>
        <li>Display chords, notes and a piano as you play</li>
        <li>Integrate in OBS, or in your Web Browser</li>
        <li>Learn with tools like Chord Quiz and Circle of Fifths</li>
      </ul>
      <p>
        {"I plan to add new modules, so don't hesitate to "}
        <Button
          size="sm"
          intent="neutral"
          as="a"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/la-jarre-a-son/midi-jar/issues/new?labels=bug&template=1-Bug_report.md"
        >
          <Icon name="github" />
          Report a bug
        </Button>
        {' or '}
        <Button
          size="sm"
          intent="neutral"
          as="a"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/la-jarre-a-son/midi-jar/issues/new?labels=enhancement&template=2-Feature_request.md"
        >
          <Icon name="github" />
          Request a feature
        </Button>
      </p>
    </div>
    <h2 className={cx('title')}>Changelog</h2>
    <Changelog />
    <h2 className={cx('title')}>Special mentions</h2>
    <div className={cx('description')}>
      <p>
        MIDI Jar is based on a collection of amazing open-source projects and resources that deserve
        special mentions:
      </p>
    </div>
    <Credits items={CREDIT_ITEMS} />
  </Container>
);

export default About;
