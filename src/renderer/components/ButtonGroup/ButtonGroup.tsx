import React from 'react';
import classnames from 'classnames/bind';
import styles from './ButtonGroup.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
  balanced?: boolean;
  vertical?: boolean;
};

const defaultProps = {
  className: undefined,
  children: undefined,
  fullWidth: false,
  balanced: false,
  vertical: false,
};

/**
 * A wrapper that can contain button, and flex align them.
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const ButtonGroup: React.FC<Props> = ({
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

ButtonGroup.defaultProps = defaultProps;

export default ButtonGroup;
