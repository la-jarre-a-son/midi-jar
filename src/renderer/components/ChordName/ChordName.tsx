import React from 'react';
import classnames from 'classnames/bind';

import { formatSharpsFlats } from 'renderer/helpers/note';
import { tokenizeChord, tokenizeChordType, formatQuality } from 'renderer/helpers/chords';

import { ChordNameProps } from './types';

import styles from './ChordName.module.scss';

const cx = classnames.bind(styles);

enum ALIAS_NOTATION {
  long = 0,
  short = 1,
  symbol = 2,
}

export const ChordName: React.FC<ChordNameProps> = ({
  className,
  chord,
  notation = 'short',
  hideRoot,
  highlightAlterations,
  latinSharpsFlats,
}) => {
  if (!chord) return null;

  const symbol =
    // eslint-disable-next-line no-nested-ternary
    chord.aliases[ALIAS_NOTATION[notation]] !== undefined
      ? chord.tonic + chord.aliases[ALIAS_NOTATION[notation]]
      : chord.aliases[ALIAS_NOTATION.short] !== undefined
      ? chord.tonic + chord.aliases[ALIAS_NOTATION.short]
      : chord.symbol;

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
  notation: 'short',
  highlightAlterations: false,
  hideRoot: false,
  latinSharpsFlats: undefined,
};

export default ChordName;
