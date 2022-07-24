import React from 'react';
import classnames from 'classnames/bind';
import { Outlet } from 'react-router-dom';

import Menu from './Menu';

import styles from './Layout.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
};

/**
 * Main Application Layout
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const Layout: React.FC<Props> = ({ className }) => (
  <div className={cx('base', className)}>
    <Menu className={cx('menu', className)} />
    <div className={cx('content', className)}>
      <Outlet />
    </div>
  </div>
);

Layout.defaultProps = defaultProps;

export default Layout;
