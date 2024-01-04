import React, { useMemo } from 'react';
import classnames from 'classnames/bind';
import { TreeView, TreeViewItem } from '@la-jarre-a-son/ui';

import { ChordDictionarySettings } from 'main/types';

import { KeySignatureConfig } from 'renderer/helpers';

import { Icon } from 'renderer/components';
import { ChordGroup, ChordItem, getChordGroups } from './utils';

import styles from './ChordDictionary.module.scss';

const cx = classnames.bind(styles);

type Props = {
  keySignature: KeySignatureConfig;
  selected: string | null;
  onSelect: (note: string) => void;
  groupBy: ChordDictionarySettings['groupBy'];
  disabledChords: ChordDictionarySettings['disabled'];
  chroma: number | null;
  filterChordsInKey: boolean;
  hideDisabled: boolean;
};

const ChordDictionaryChordMenu: React.FC<Props> = ({
  keySignature,
  selected,
  onSelect,
  chroma,
  groupBy,
  disabledChords,
  hideDisabled,
  filterChordsInKey,
}) => {
  const groups = useMemo(
    () =>
      getChordGroups(
        groupBy,
        keySignature,
        chroma,
        disabledChords,
        hideDisabled,
        filterChordsInKey
      ),
    [groupBy, disabledChords, hideDisabled, keySignature, chroma, filterChordsInKey]
  );

  const renderTreeViewGroup = (item: ChordGroup | ChordItem) => {
    return item.type === 'item' ? (
      <TreeViewItem
        key={item.chordType.aliases[0]}
        className={cx('item', item.isDisabled && 'item--isDisabled')}
        onClick={() => onSelect(item.chordType.aliases[0] || 'maj')}
        title={item.chordType.aliases[0] || 'maj'}
        current={selected === (item.chordType.aliases[0] || 'maj')}
        left={item.isDisabled ? <Icon name="hidden" /> : null}
      />
    ) : (
      <TreeViewItem key={item.value} className={cx('group')} title={item.label}>
        {item.items.map((i) => renderTreeViewGroup(i))}
      </TreeViewItem>
    );
  };

  return (
    <TreeView
      className={cx('chordnav')}
      aria-label="Chord Types Navigation"
      sticky={groupBy !== 'none'}
    >
      {groups.map((item) => renderTreeViewGroup(item))}
    </TreeView>
  );
};

export default ChordDictionaryChordMenu;
