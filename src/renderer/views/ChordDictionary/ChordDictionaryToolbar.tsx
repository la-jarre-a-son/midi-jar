import React from 'react';
import classnames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Divider,
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

import { groupValues } from './utils';

import styles from './ChordDictionary.module.scss';

const cx = classnames.bind(styles);

type Props = {
  interactive: 'play' | 'detect';
  onChangeInteractive: (mode: 'play' | 'detect') => void;
  hideDisabled: boolean;
  onChangeHideDisabled: (hideDisabled: boolean) => void;
  filterChordsInKey: boolean;
  onChangeFilterChordsInKey: (filterChordsInKey: boolean) => void;
  group: keyof typeof groupValues;
  onChangeGroup: (group: keyof typeof groupValues) => void;
};

const ChordDictionaryToolbar: React.FC<Props> = ({
  interactive,
  hideDisabled,
  filterChordsInKey,
  group,
  onChangeInteractive,
  onChangeHideDisabled,
  onChangeFilterChordsInKey,
  onChangeGroup,
}) => {
  const navigate = useNavigate();

  const { settings, updateSetting } = useSettings();

  const toggleHideDisabled = () => onChangeHideDisabled(!hideDisabled);
  const toggleFilterChordsInKey = () => onChangeFilterChordsInKey(!filterChordsInKey);

  const handleToggleInteractive = (mode: Props['interactive']) => () => onChangeInteractive(mode);

  const bindSortAndFilter = (value: keyof typeof groupValues) => ({
    onClick: () => onChangeGroup(value),
    checked: group === value,
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
      {`${groupValues[group]}${filterChordsInKey ? ' (In Key)' : ''}`}
    </Button>
  );

  return (
    <Toolbar as={Stack} className={cx('header')} elevation={2}>
      <Menu className={cx('menu')} trigger={menuTrigger}>
        <MenuGroup header="Group">
          <MenuItemRadio {...bindSortAndFilter('none')}>{groupValues.none}</MenuItemRadio>
          <MenuItemRadio {...bindSortAndFilter('quality')}>{groupValues.quality}</MenuItemRadio>
          <MenuItemRadio {...bindSortAndFilter('intervals')}>{groupValues.intervals}</MenuItemRadio>
        </MenuGroup>
        <Divider />
        <MenuGroup header="Filter">
          <MenuItemCheckbox checked={hideDisabled} variant="switch" onClick={toggleHideDisabled}>
            Hide disabled chords
          </MenuItemCheckbox>
          <MenuItemCheckbox
            checked={filterChordsInKey}
            variant="switch"
            onClick={toggleFilterChordsInKey}
          >
            Only chords in key
          </MenuItemCheckbox>
        </MenuGroup>
      </Menu>
      <StackSeparator />
      <ButtonGroup>
        <ToggleButton
          onClick={handleToggleInteractive('detect')}
          selected={interactive === 'detect'}
        >
          Detect
        </ToggleButton>
        <ToggleButton onClick={handleToggleInteractive('play')} selected={interactive === 'play'}>
          Play
        </ToggleButton>
      </ButtonGroup>
    </Toolbar>
  );
};

export default ChordDictionaryToolbar;
