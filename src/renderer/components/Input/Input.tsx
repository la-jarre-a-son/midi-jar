import React, { useCallback, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './Input.module.scss';

const cx = classNames.bind(styles);

type InputProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'value'>;
type Props = InputProps & {
  className?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  id: string;
  value: string | number | null;
  onChange: (value: string) => unknown;
  block?: boolean;
  disabled?: boolean;
};

const defaultProps = {
  className: undefined,
  left: undefined,
  right: undefined,
  block: false,
  disabled: false,
};

const Input: React.FC<Props> = ({
  className,
  id,
  left,
  right,
  value,
  onChange,
  block,
  disabled,
  ...rest
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  const handleChange = useCallback(
    (event) => {
      const { value: newValue } = event.target;

      onChange(newValue);
    },
    [onChange]
  );

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={cx(
        'base',
        {
          'base--block': block,
          'base--isFocused': focused,
          'base--isDisabled': disabled,
        },
        className
      )}
    >
      {left}
      <input
        className={cx('input')}
        id={id}
        value={value ?? ''}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />
      {right}
    </label>
  );
};

Input.defaultProps = defaultProps;

export default Input;
