import React from 'react';
import classNames from 'classnames/bind';
import { Box, List } from '@la-jarre-a-son/ui';

import { CreditsProps } from './types';
import CreditItem from './CreditItem';

import styles from './Credits.module.scss';

const cx = classNames.bind(styles);

const Credits: React.FC<CreditsProps> = ({ items }) => (
  <Box className={cx('base')} outlined elevation={1}>
    <List as="table" className={cx('table')}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Links</th>
        </tr>
      </thead>
      <tbody>
        {items.map((credit) => (
          <CreditItem key={credit.name} {...credit} />
        ))}
      </tbody>
    </List>
  </Box>
);

export default Credits;
