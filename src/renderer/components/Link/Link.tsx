import React from 'react';
import classnames from 'classnames/bind';

import CustomLink, { Props as CustomLinkProps } from '../CustomLink';

import styles from './Link.module.scss';

const cx = classnames.bind(styles);

type Props = CustomLinkProps & {
  className?: string;
  children?: React.ReactNode;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

/**
 * A wrapper that can contain button, and flex align them.
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const Link: React.FC<Props> = ({ className, children, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <CustomLink className={cx('base', className)} {...rest}>
    {children}
  </CustomLink>
);

Link.defaultProps = defaultProps;

export default Link;
