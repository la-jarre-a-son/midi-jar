import React from 'react';
import classnames from 'classnames/bind';

import { formatSharpsFlats } from 'renderer/helpers/note';
import {
  tokenizeChord,
  tokenizeChordType,
  formatQuality,
  ALIAS_NOTATION,
} from 'renderer/helpers/chords';

import { useChordDictionary } from 'renderer/contexts/ChordDictionary';
import { ChordNameProps } from './types';

import styles from './ChordName.module.scss';

const cx = classnames.bind(styles);

function getChordSymbol(
  chord: ChordNameProps['chord'],
  notation: 'long' | 'short' | 'symbol' | number
) {
  if (!chord) {
    return '';
  }

  if (typeof notation === 'string') {
    if (chord.aliases[ALIAS_NOTATION[notation]] !== undefined) {
      return chord.tonic + chord.aliases[ALIAS_NOTATION[notation]];
    }
  } else if (typeof notation === 'number' && chord.aliases[notation] !== undefined) {
    return chord.tonic + chord.aliases[notation];
  }

  if (chord.aliases[ALIAS_NOTATION.short] !== undefined) {
    return chord.tonic + chord.aliases[ALIAS_NOTATION.short];
  }
  return chord.symbol;
}

export const ChordName: React.FC<ChordNameProps> = ({
  className,
  chord,
  notation = 'preferred',
  hideRoot,
  highlightAlterations,
  latinSharpsFlats,
}) => {
  const { aliases, defaultNotation } = useChordDictionary();

  if (!chord) return null;

  const preferredAlias = aliases.get(chord.aliases[0]);

  const symbol =
    notation === 'preferred' && preferredAlias !== undefined
      ? chord.tonic + preferredAlias
      : getChordSymbol(chord, notation === 'preferred' ? defaultNotation : notation);

  if (!symbol) return null;

  const [tonic, type] = tokenizeChord(symbol);
  const tokens = tokenizeChordType(type);
  const [first, ...rest] = tokens;

  return (
    <div className={cx('base', 'chord', highlightAlterations && '--highlighted', className)}>
      <span className={cx('tonic', 'chord-tonic')}>
        {latinSharpsFlats ? tonic : formatSharpsFlats(tonic)}
      </span>
      <span className={cx('name', 'chord-name')}>
        <span className={cx('quality')}>{formatQuality(first)}</span>
        {rest.map((part, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <span className={cx('extension')} key={`${part}_${index}`}>
            {latinSharpsFlats ? part : formatSharpsFlats(part)}
          </span>
        ))}
      </span>
      {!hideRoot && chord.root && (
        <span className={cx('root', 'chord-root')}>
          /{latinSharpsFlats ? chord.root : formatSharpsFlats(chord.root)}
        </span>
      )}
    </div>
  );
};

ChordName.defaultProps = {
  className: undefined,
  chord: null,
  notation: 'preferred',
  highlightAlterations: false,
  hideRoot: false,
  latinSharpsFlats: undefined,
};

export default ChordName;
