import React, { useEffect, useMemo, useRef } from 'react';
import classnames from 'classnames/bind';
import { Tab, TabList } from '@la-jarre-a-son/ui';

import { getChordTypes } from 'renderer/helpers';

import styles from './ChordDictionary.module.scss';

const cx = classnames.bind(styles);

type Props = {
  selected: string | null;
  onSelect: (note: string) => void;
};

const ChordDictionaryChordMenu: React.FC<Props> = ({ selected, onSelect }) => {
  const ref = useRef<HTMLElement>();
  const chordTypes = useMemo(() => getChordTypes(), []);

  useEffect(() => {
    if (ref.current) {
      const currentEl: HTMLElement | null = ref.current.querySelector('[aria-selected=true]');

      if (currentEl) {
        if (ref.current.scrollTop > currentEl.offsetTop) {
          currentEl.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
        }
        if (
          ref.current.scrollTop + ref.current.offsetHeight <
          currentEl.offsetTop + currentEl.offsetHeight
        ) {
          currentEl.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });
        }
      }
    }
  }, [selected]);

  return (
    <TabList
      ref={ref}
      className={cx('chordnav')}
      aria-label="Chord Types Navigation"
      direction="vertical"
      variant="ghost"
      block
    >
      {chordTypes.map((chordType) => (
        <Tab
          key={chordType.aliases[0]}
          className={cx('tab')}
          selected={selected === chordType.aliases[0]}
          onClick={() => onSelect(chordType.aliases[0])}
        >
          <span className={cx('label')}>{chordType.aliases[0] || 'maj'}</span>
        </Tab>
      ))}
    </TabList>
  );
};

export default ChordDictionaryChordMenu;
