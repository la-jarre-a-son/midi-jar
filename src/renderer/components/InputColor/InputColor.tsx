import React, { useCallback } from 'react';
import classNames from 'classnames/bind';

import Input from '../Input';

import styles from './InputColor.module.scss';

const COLOR_CHARS = '0 1 2 3 4 5 6 7 8 9 a b c d e f'.split(' ');

const cx = classNames.bind(styles);

type InputProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'value'>;
type Props = InputProps & {
  className?: string;
  id: string;
  value: string | null;
  onChange: (value: string) => unknown;
  block?: boolean;
};

const defaultProps = {
  className: undefined,
  block: false,
};

const InputColor: React.FC<Props> = ({
  className,
  id,
  value,
  onChange,
  block,
  ...rest
}) => {
  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!value && event.key === '#') return;

      if (
        value &&
        value.startsWith('#') &&
        value.length < 7 &&
        COLOR_CHARS.includes(event.key.toLowerCase())
      )
        return;
      event.preventDefault();
    },
    [value]
  );

  const handleColorChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value: newValue } = event.target;

      onChange(newValue.toLowerCase());
    },
    [onChange]
  );

  const handleTextChange = useCallback(
    (newValue: string) => {
      onChange(newValue.toLowerCase());
    },
    [onChange]
  );

  return (
    <Input
      className={cx('base', className)}
      id={id}
      value={value}
      onKeyPress={handleKeyPress}
      onChange={handleTextChange}
      left={
        <input
          className={cx('color')}
          type="color"
          onChange={handleColorChange}
          value={value ?? ''}
        />
      }
      block={block}
      type="text"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  );
};

InputColor.defaultProps = defaultProps;

export default InputColor;