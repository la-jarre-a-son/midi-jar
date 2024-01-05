import React, { useMemo } from 'react';
import classnames from 'classnames/bind';

import { NavLink } from 'react-router-dom';
import { Link } from '@la-jarre-a-son/ui';
import { ChordNameLinkProps } from './types';

import { ChordName } from '../ChordName/ChordName';

import styles from './ChordNameLink.module.scss';

const cx = classnames.bind(styles);

export const ChordNameLink: React.FC<ChordNameLinkProps> = ({
  className,
  chord,
  dictionaryUrl,
  ...rest
}) => {
  const to = useMemo(
    () => (chord ? `${dictionaryUrl}${encodeURIComponent(chord.tonic + chord.aliases[0])}` : ''),
    [chord, dictionaryUrl]
  );

  if (!chord) return null;

  return (
    <Link as={NavLink} className={cx('base', className)} to={to}>
      <ChordName chord={chord} {...rest} />
    </Link>
  );
};

ChordNameLink.defaultProps = {
  dictionaryUrl: '/chord-dictionary/',
};

export default ChordNameLink;
