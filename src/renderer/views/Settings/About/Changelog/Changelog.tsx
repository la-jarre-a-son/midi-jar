import React from 'react';
import classNames from 'classnames/bind';
import { Box } from '@la-jarre-a-son/ui';
import ReactMarkdown from 'react-markdown';

import styles from './Changelog.module.scss';

import ChangelogMD from '../../../../../../CHANGELOG.md';

const cx = classNames.bind(styles);

const Changelog: React.FC = () => (
  <Box className={cx('base')} outlined elevation={1}>
    <ReactMarkdown linkTarget="_blank" skipHtml>
      {ChangelogMD}
    </ReactMarkdown>
  </Box>
);

export default Changelog;
