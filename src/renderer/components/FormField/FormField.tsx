import React from 'react';
import classNames from 'classnames/bind';

import styles from './FormField.module.scss';

const cx = classNames.bind(styles);

type Props = {
  className?: string;
  label: string;
  children: React.ReactNode;
  fieldId: string;
};

const defaultProps = {
  className: undefined,
  value: null,
};

/**
 * A group of buttons that can be toggled.
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
export const FormField: React.FC<Props> = ({
  className,
  children,
  label,
  fieldId,
}) => (
  <div className={cx('base', className)}>
    <label htmlFor={fieldId} className={cx('label')}>
      {label}
    </label>
    <div className={cx('field')}>{children}</div>
  </div>
);

FormField.defaultProps = defaultProps;

export default FormField;
