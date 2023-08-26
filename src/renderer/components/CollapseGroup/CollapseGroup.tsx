import React, { useState } from 'react';
import classnames from 'classnames/bind';

import { Icon } from '../Icon';

import { CollapseGroupProps } from './types';

import styles from './CollapseGroup.module.scss';

const cx = classnames.bind(styles);

/**
 * A wrapper that collapse / open based on prop open
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
export const CollapseGroup: React.FC<CollapseGroupProps> = ({ className, header, children }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClick = () => {
    setOpen((previousValue) => !previousValue);
  };

  return (
    <div className={cx('base', className)}>
      <button type="button" className={cx('header')} onClick={handleClick}>
        <Icon className={cx('icon')} name={open ? 'angle-up' : 'angle-down'} />
        {header}
      </button>
      {open && <div className={cx('content')}>{children}</div>}
    </div>
  );
};

CollapseGroup.defaultProps = {
  className: undefined,
  children: undefined,
};

export default CollapseGroup;
