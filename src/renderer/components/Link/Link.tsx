import React from 'react';
import classnames from 'classnames/bind';

import { CustomLink } from '../CustomLink';

import styles from './Link.module.scss';
import { LinkProps } from './types';

const cx = classnames.bind(styles);

/**
 * A wrapper that can contain button, and flex align them.
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
export const Link: React.FC<LinkProps> = ({ className, children, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <CustomLink className={cx('base', className)} {...rest}>
    {children}
  </CustomLink>
);

Link.defaultProps = {
  className: undefined,
  children: undefined,
};

export default Link;
