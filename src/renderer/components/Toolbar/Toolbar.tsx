import React from 'react';
import classNames from 'classnames/bind';

import { ToolbarProps } from './types';

import styles from './Toolbar.module.scss';

const cx = classNames.bind(styles);

/**
 * An horizontal space with shadow to put things in it.
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
export const Toolbar: React.FC<ToolbarProps> = ({ className, bottom, children }) => (
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

Toolbar.defaultProps = {
  className: undefined,
  bottom: false,
  children: undefined,
};

export default Toolbar;
