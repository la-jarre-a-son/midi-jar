import React, { useCallback, useState } from 'react';
import classNames from 'classnames/bind';

import { InputProps } from './types';

import styles from './Input.module.scss';

const cx = classNames.bind(styles);

export const Input: React.FC<InputProps> = ({
  className,
  id,
  left,
  right,
  value,
  onChange,
  onKeyPress,
  block,
  disabled,
  ...rest
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (onKeyPress) onKeyPress(event);
    },
    [onKeyPress]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
        onKeyPress={handleKeyPress}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        spellCheck="false"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
      />
      {right}
    </label>
  );
};

Input.defaultProps = {
  className: undefined,
  left: undefined,
  right: undefined,
  block: false,
  disabled: false,
  onKeyPress: undefined,
};

export default Input;
