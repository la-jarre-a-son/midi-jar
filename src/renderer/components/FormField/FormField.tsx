import React from 'react';
import classNames from 'classnames/bind';

import styles from './FormField.module.scss';

const cx = classNames.bind(styles);

type Props = {
  className?: string;
  label: string;
  children: React.ReactNode;
  fieldId: string;
  hint?: React.ReactNode;
  vertical?: boolean;
};

const defaultProps = {
  className: undefined,
  value: null,
  hint: undefined,
  vertical: false,
};

/**
 * A form field with a label, a hint, and some controls.
 * Can be arranged horizontally (by default), or vertically
 *
 * @version 1.1.0
 * @author Rémi Jarasson
 */
export const FormField: React.FC<Props> = ({
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

FormField.defaultProps = defaultProps;

export default FormField;
