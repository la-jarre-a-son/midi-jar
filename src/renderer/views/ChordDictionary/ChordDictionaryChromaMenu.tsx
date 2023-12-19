import React, { useEffect, useRef } from 'react';
import classnames from 'classnames/bind';
import { Tab, TabList } from '@la-jarre-a-son/ui';

import {
  KeySignatureConfig,
  NOTE_NAMES,
  formatSharpsFlats,
  getNoteInKeySignature,
} from 'renderer/helpers';

import styles from './ChordDictionary.module.scss';

const cx = classnames.bind(styles);

type Props = {
  keySignature: KeySignatureConfig;
  selected: number | null;
  onSelect: (chroma: number) => void;
};

const ChordDictionaryChromaMenu: React.FC<Props> = ({ keySignature, selected, onSelect }) => {
  const ref = useRef<HTMLElement>();

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
      className={cx('chromanav')}
      aria-label="Chroma Navigation"
      direction="vertical"
      variant="ghost"
      block
    >
      {NOTE_NAMES.map((note, index) => (
        <Tab
          key={note}
          className={cx('tab')}
          onClick={() => onSelect(index)}
          selected={selected === index}
        >
          <span className={cx('label')}>
            {formatSharpsFlats(getNoteInKeySignature(note, keySignature.notes))}
          </span>
        </Tab>
      ))}
    </TabList>
  );
};

export default ChordDictionaryChromaMenu;
