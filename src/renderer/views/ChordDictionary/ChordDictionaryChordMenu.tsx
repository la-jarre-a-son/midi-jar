import React, { useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames/bind';
import { Tab, TabList, TreeView, TreeViewItem } from '@la-jarre-a-son/ui';

import styles from './ChordDictionary.module.scss';
import { ChordGroup, ChordItem, getChordGroups, groupValues } from './utils';

const cx = classnames.bind(styles);

type Props = {
  selected: string | null;
  onSelect: (note: string) => void;
  group: keyof typeof groupValues;
};

const ChordDictionaryChordMenu: React.FC<Props> = ({ selected, onSelect, group }) => {
  const ref = useRef<HTMLElement>();
  const groups = useMemo(() => getChordGroups(group), [group]);

  const renderTreeViewGroup = (c: ChordGroup | ChordItem) => {
    return c.type === 'item' ? (
      <TreeViewItem
        key={c.chordType.aliases[0]}
        className={cx('item')}
        onClick={() => onSelect(c.chordType.aliases[0] || 'maj')}
        title={c.chordType.aliases[0] || 'maj'}
        current={selected === (c.chordType.aliases[0] || 'maj')}
      />
    ) : (
      <TreeViewItem key={c.value} className={cx('group')} title={c.label}>
        {c.items.map((item) => renderTreeViewGroup(item))}
      </TreeViewItem>
    );
  };

  return group === 'none' ? (
    <TabList
      ref={ref}
      className={cx('chordnav')}
      aria-label="Chord Types Navigation"
      direction="vertical"
      variant="ghost"
      block
    >
      {groups.map(
        (item) =>
          item.type === 'item' && (
            <Tab
              key={item.chordType.aliases[0]}
              className={cx('tab')}
              selected={selected === (item.chordType.aliases[0] || 'maj')}
              onClick={() => onSelect(item.chordType.aliases[0] || 'maj')}
            >
              <span className={cx('label')}>{item.chordType.aliases[0] || 'maj'}</span>
            </Tab>
          )
      )}
    </TabList>
  ) : (
    <TreeView className={cx('chordnav')} aria-label="Chord Types Navigation" sticky>
      {groups.map((item) => renderTreeViewGroup(item))}
    </TreeView>
  );
};

export default ChordDictionaryChordMenu;
