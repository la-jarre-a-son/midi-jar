import React from 'react';
import classnames from 'classnames/bind';

import { formatSharpsFlats } from 'renderer/helpers/note';
import { tokenizeChord, tokenizeChordType } from 'renderer/helpers/chords';

import { ChordNameProps } from './types';

import styles from './ChordName.module.scss';

const cx = classnames.bind(styles);

export const ChordName: React.FC<ChordNameProps> = ({
  className,
  chord,
  hideRoot,
  latinSharpsFlats,
}) => {
  if (!chord) return null;

  const { symbol } = chord;
  const [tonic, type, root] = tokenizeChord(symbol);
  const tokens = tokenizeChordType(type);
  const [first, ...rest] = tokens;

  return (
    <div className={cx('base', 'chord', className)}>
      <span className={cx('tonic', 'chord-tonic')}>
        {latinSharpsFlats ? tonic : formatSharpsFlats(tonic)}
      </span>
      <span className={cx('name', 'chord-name')}>
        <span className={cx('quality')}>{first}</span>
        {rest.map((part, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <span className={cx('extension')} key={`${part}_${index}`}>
            {latinSharpsFlats ? part : formatSharpsFlats(part)}
          </span>
        ))}
      </span>
      {!hideRoot && root && (
        <span className={cx('root', 'chord-root')}>
          /{latinSharpsFlats ? root : formatSharpsFlats(root)}
        </span>
      )}
    </div>
  );
};

ChordName.defaultProps = {
  className: undefined,
  chord: null,
  hideRoot: false,
  latinSharpsFlats: undefined,
};

export default ChordName;
