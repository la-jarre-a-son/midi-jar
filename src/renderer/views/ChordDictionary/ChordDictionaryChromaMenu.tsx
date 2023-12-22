import React from 'react';
import classnames from 'classnames/bind';
import { Note } from 'tonal';
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
  filterChordsInKey: boolean;
};

const ChordDictionaryChromaMenu: React.FC<Props> = ({
  keySignature,
  selected,
  onSelect,
  filterChordsInKey,
}) => {
  return (
    <TabList
      className={cx('chromanav')}
      aria-label="Chroma Navigation"
      direction="vertical"
      variant="ghost"
      block
    >
      {(filterChordsInKey ? keySignature.scale : NOTE_NAMES).map((note) => {
        const chroma = Note.chroma(note) as number;

        return (
          <Tab
            key={note}
            className={cx('tab')}
            onClick={() => onSelect(chroma)}
            selected={selected === chroma}
          >
            <span className={cx('label')}>
              {formatSharpsFlats(getNoteInKeySignature(note, keySignature.notes))}
            </span>
          </Tab>
        );
      })}
    </TabList>
  );
};

export default ChordDictionaryChromaMenu;
