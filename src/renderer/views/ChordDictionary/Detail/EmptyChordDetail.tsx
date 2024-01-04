import React from 'react';
import classnames from 'classnames/bind';
import { Box, Container } from '@la-jarre-a-son/ui';
import styles from './ChordDetail.module.scss';

const cx = classnames.bind(styles);

type Props = {
  chordName?: string;
};

export const EmptyChordDetail: React.FC<Props> = ({ chordName }) => (
  <Container className={cx('empty')} size="sm">
    {chordName ? (
      <Box elevation={2} pad="lg">
        Cannot find a chord named {chordName}
      </Box>
    ) : (
      <Box elevation={2} pad="lg">
        Search a chord, select a chroma and chord type in left menu, or use the Detect mode to
        automatically browse the played chord
      </Box>
    )}
  </Container>
);

EmptyChordDetail.defaultProps = { chordName: undefined };

export default EmptyChordDetail;
