import React from 'react';
import classnames from 'classnames/bind';

import { IconProps } from './types';
import ICONS from './icons';

import styles from './Icon.module.scss';

const cx = classnames.bind(styles);

/**
 * An inline component to display vector icons from svg with variant (normal/outline/flat).
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
export const Icon: React.FC<IconProps> = ({ className, name, spin, hover }) => {
  const IconSvg = ICONS[name];

  if (!IconSvg) return null;

  return (
    <IconSvg
      className={cx(
        'base',
        {
          'base--spin': spin,
          'base--hover': !!hover,
        },
        className
      )}
    />
  );
};

Icon.defaultProps = {
  className: undefined,
  spin: false,
  hover: false,
};

export default Icon;
