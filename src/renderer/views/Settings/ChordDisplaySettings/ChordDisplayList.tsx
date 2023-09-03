import React from 'react';
import classnames from 'classnames/bind';

import { Stack, TabList, Toolbar } from '@la-jarre-a-son/ui';

import { useSettings } from 'renderer/contexts/Settings';
import { NavTab } from 'renderer/components';

import styles from './ChordDisplaySettings.module.scss';

const cx = classnames.bind(styles);

const ChordDisplayList: React.FC = () => {
  const { settings } = useSettings();

  const keys = Object.keys(settings.chordDisplay);

  return (
    <Toolbar as={Stack} className={cx('header')} elevation={2}>
      <TabList className={cx('list')} aria-label="Chord display list" justify="center">
        {keys.map((key) => (
          <NavTab key={key} to={`/settings/chords/${key}`}>
            {key}
          </NavTab>
        ))}
      </TabList>
      {/* COMING SOON <Button aria-label="Add session" left={<Icon name="plus" />} icon /> */}
    </Toolbar>
  );
};

export default ChordDisplayList;
