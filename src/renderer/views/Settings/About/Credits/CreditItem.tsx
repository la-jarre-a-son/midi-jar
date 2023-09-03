import React from 'react';
import classNames from 'classnames/bind';
import { Link, ListItem } from '@la-jarre-a-son/ui';
import { Icon } from 'renderer/components';

import { CreditItemProps } from './types';

import styles from './Credits.module.scss';

const cx = classNames.bind(styles);

const CreditItem: React.FC<CreditItemProps> = ({ name, description, links }) => (
  <ListItem as="tr" className={cx('item')}>
    <td className={cx('name')}>{name}</td>
    <td className={cx('description')}>{description}</td>
    <td className={cx('links')}>
      {links.github && (
        <Link href={links.github} target="_blank" rel="noreferrer">
          <Icon name="github" /> Github
        </Link>
      )}
      {links.github && links.website && ' - '}
      {links.website && (
        <Link href={links.website} target="_blank" rel="noreferrer">
          Website
        </Link>
      )}
    </td>
  </ListItem>
);

export default CreditItem;
