import React, { useState } from 'react';
import classnames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Divider,
  Drawer,
  DropdownTriggerInternal,
  Menu,
  MenuGroup,
  MenuItemCheckbox,
  MenuItemRadio,
  Stack,
  StackSeparator,
  ToggleButton,
  Toolbar,
} from '@la-jarre-a-son/ui';

import { useSettings } from 'renderer/contexts/Settings';
import { Icon } from 'renderer/components';

import { ChordDictionarySettings as TChordDictionarySettings } from 'main/types';
import { groupValues } from './utils';
import { ChordSearch } from './ChordSearch';

import styles from './ChordDictionary.module.scss';
import ChordDictionarySettings from '../Settings/ChordDictionarySettings';

const cx = classnames.bind(styles);

type Props = {
  disableUpdate?: boolean;
};

const ChordDictionaryToolbar: React.FC<Props> = ({ disableUpdate }) => {
  const navigate = useNavigate();
  const { settings, updateSetting } = useSettings();

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const toggleHideDisabled = () =>
    updateSetting('chordDictionary.hideDisabled', !settings.chordDictionary.hideDisabled);
  const toggleFilterInKey = () =>
    updateSetting('chordDictionary.filterInKey', !settings.chordDictionary.filterInKey);

  const handleToggleInteractive = (interactive: TChordDictionarySettings['interactive']) => () =>
    updateSetting('chordDictionary.interactive', interactive);

  const bindSortAndFilter = (groupBy: TChordDictionarySettings['groupBy']) => ({
    onClick: () => updateSetting('chordDictionary.groupBy', groupBy),
    checked: settings.chordDictionary.groupBy === groupBy,
  });

  const menuTrigger: (internals: DropdownTriggerInternal) => React.ReactNode = ({
    open,
    triggerRef,
  }) => (
    <Button
      ref={triggerRef as React.Ref<HTMLButtonElement>}
      className={cx('menuTrigger')}
      right={open ? <Icon name="angle-up" /> : <Icon name="angle-down" />}
      intent="neutral"
    >
      {`${groupValues[settings.chordDictionary.groupBy]}${
        settings.chordDictionary.filterInKey ? ' (In Key)' : ''
      }`}
    </Button>
  );

  const handleChordSelect = (chord: string | null) => {
    if (chord) {
      navigate(`./${encodeURIComponent(chord)}`);
    }
  };

  const handleSettingsClosed = () => {
    setSettingsOpen(false);
  };

  return (
    <>
      <Toolbar as={Stack} className={cx('header')} elevation={2}>
        {!disableUpdate && (
          <Menu className={cx('menu')} trigger={menuTrigger}>
            <MenuGroup header="Group">
              <MenuItemRadio {...bindSortAndFilter('none')}>{groupValues.none}</MenuItemRadio>
              <MenuItemRadio {...bindSortAndFilter('quality')}>{groupValues.quality}</MenuItemRadio>
              <MenuItemRadio {...bindSortAndFilter('intervals')}>
                {groupValues.intervals}
              </MenuItemRadio>
            </MenuGroup>
            <Divider />
            <MenuGroup header="Filter">
              <MenuItemCheckbox
                checked={settings.chordDictionary.hideDisabled}
                variant="switch"
                onClick={toggleHideDisabled}
              >
                Hide disabled chords
              </MenuItemCheckbox>
              <MenuItemCheckbox
                checked={settings.chordDictionary.filterInKey}
                variant="switch"
                onClick={toggleFilterInKey}
              >
                Only chords in key
              </MenuItemCheckbox>
            </MenuGroup>
          </Menu>
        )}
        <StackSeparator />
        <ChordSearch onSelect={handleChordSelect} />
        {!disableUpdate && (
          <ButtonGroup>
            <ToggleButton
              onClick={handleToggleInteractive('detect')}
              selected={settings.chordDictionary.interactive === 'detect'}
            >
              Detect
            </ToggleButton>
            <ToggleButton
              onClick={handleToggleInteractive('play')}
              selected={settings.chordDictionary.interactive === 'play'}
            >
              Play
            </ToggleButton>
          </ButtonGroup>
        )}
        <Button
          onClick={() => setSettingsOpen(true)}
          intent="neutral"
          icon
          aria-label="Open dictionary settings"
        >
          <Icon name="settings" />
        </Button>
      </Toolbar>
      <Drawer
        open={settingsOpen}
        placement="right"
        size="lg"
        onClose={handleSettingsClosed}
        className={cx('base')}
        aria-label="Chord Dictionary Settings"
      >
        <ChordDictionarySettings />
      </Drawer>
    </>
  );
};

ChordDictionaryToolbar.defaultProps = {
  disableUpdate: false,
};

export default ChordDictionaryToolbar;
