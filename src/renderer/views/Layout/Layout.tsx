import React from 'react';
import classnames from 'classnames/bind';
import { Outlet } from 'react-router-dom';
import { ModalContainer } from '@la-jarre-a-son/ui';

import TopBar from './TopBar';

import styles from './Layout.module.scss';

const cx = classnames.bind(styles);

const Layout: React.FC = () => (
  <div className={cx('base')}>
    <TopBar />
    <div className={cx('modalContainer')}>
      <ModalContainer>
        <div className={cx('content')}>
          <Outlet />
        </div>
      </ModalContainer>
    </div>
  </div>
);

export default Layout;
