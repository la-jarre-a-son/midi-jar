import React, { useState } from 'react';
import classnames from 'classnames/bind';
import styles from './CollapseGroup.module.scss';
import Icon from '../Icon';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
  header: React.ReactNode;
  children?: React.ReactNode;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

/**
 * A wrapper that collapse / open based on prop open
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const CollapseGroup: React.FC<Props> = ({ className, header, children }) => {
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

CollapseGroup.defaultProps = defaultProps;

export default CollapseGroup;
