import React from 'react';
import classnames from 'classnames/bind';

import styles from './Icon.module.scss';

import ICONS, { ICON_NAMES } from './icons';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
  /**
   * Name of the svg icon file
   */
  name: typeof ICON_NAMES[number];
  /**
   * A flag to add a spinning animatation to icon
   */
  spin?: boolean;
  /**
   * A flag to add a spinning animatation to icon
   */
  hover?: boolean;
};

const defaultProps = {
  className: undefined,
  spin: false,
  hover: false,
};

/**
 * An inline component to display vector icons from svg with variant (normal/outline/flat).
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const Icon: React.FC<Props> = ({ className, name, spin, hover }) => {
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

Icon.defaultProps = defaultProps;

export { ICON_NAMES };

export default Icon;
