import React from 'react';
import classnames from 'classnames/bind';
import { Chord } from '@tonaljs/chord';

import { tokenizeChord, tokenizeChordType } from 'renderer/helpers/chords';

import styles from './ChordName.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
  chord?: Chord | null;
};

const defaultProps = {
  className: undefined,
  chord: null,
};

const ChordName: React.FC<Props> = ({ className, chord }) => {
  if (!chord) return null;
  const { symbol } = chord;
  const [tonic, type, root] = tokenizeChord(symbol);
  const tokens = tokenizeChordType(type);
  const [first, ...rest] = tokens;
  return (
    <div className={cx('base', 'chord', className)}>
      <span className={cx('tonic', 'chord-tonic')}>{tonic}</span>
      <span className={cx('name', 'chord-name')}>
        <span className={cx('quality')}>{first}</span>
        {rest.map((part, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <span className={cx('extension')} key={`${part}_${index}`}>
            {part}
          </span>
        ))}
      </span>
      {root && <span className={cx('root', 'chord-root')}>/{root}</span>}
    </div>
  );
};

ChordName.defaultProps = defaultProps;

export default ChordName;
