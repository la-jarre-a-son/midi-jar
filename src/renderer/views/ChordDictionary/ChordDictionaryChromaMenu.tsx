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
  return (
    <TabList
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
