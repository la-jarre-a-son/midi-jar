import React from 'react';
import classnames from 'classnames/bind';

import { ButtonGroupProps } from './types';

import styles from './ButtonGroup.module.scss';

const cx = classnames.bind(styles);

/**
 * A wrapper that can contain button, and flex align them.
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  className,
  children,
  fullWidth = false,
  balanced = false,
  vertical = false,
}) => (
  <div
    className={cx(
      'base',
      {
        'base--fullWidth': fullWidth,
        'base--balanced': balanced,
        'base--vertical': vertical,
      },
      className
    )}
  >
    {children}
  </div>
);

ButtonGroup.defaultProps = {
  className: undefined,
  children: undefined,
  fullWidth: false,
  balanced: false,
  vertical: false,
};

export default ButtonGroup;
