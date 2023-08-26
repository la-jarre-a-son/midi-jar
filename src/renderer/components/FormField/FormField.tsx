import React from 'react';
import classNames from 'classnames/bind';

import { FormFieldProps } from './types';

import styles from './FormField.module.scss';

const cx = classNames.bind(styles);

/**
 * A form field with a label, a hint, and some controls.
 * Can be arranged horizontally (by default), or vertically
 *
 * @version 1.1.0
 * @author Rémi Jarasson
 */
export const FormField: React.FC<FormFieldProps> = ({
  className,
  children,
  label,
  fieldId,
  hint,
  vertical,
}) => (
  <div className={cx('base', vertical && 'base--vertical', className)}>
    <div className={cx('label')}>
      <label htmlFor={fieldId} className={cx('name')}>
        {label}
      </label>
      {hint && <div className={cx('hint')}>{hint}</div>}
    </div>

    <div className={cx('control')}>{children}</div>
  </div>
);

FormField.defaultProps = {
  className: undefined,
  hint: undefined,
  vertical: false,
};

export default FormField;
