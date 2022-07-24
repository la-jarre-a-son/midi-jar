import React from 'react';
import classNames from 'classnames/bind';

import styles from './Toolbar.module.scss';

const cx = classNames.bind(styles);

type Props = {
  className?: string;
  bottom?: boolean;
  children?: React.ReactNode;
};

const defaultProps = {
  className: undefined,
  bottom: false,
  children: undefined,
};

/**
 * An horizontal space with shadow to put things in it.
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
export const Toolbar: React.FC<Props> = ({ className, bottom, children }) => (
  <div
    className={cx(
      'base',
      {
        'base--bottom': bottom,
      },
      className
    )}
  >
    {children}
  </div>
);

Toolbar.defaultProps = defaultProps;

export default Toolbar;
