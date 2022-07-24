import React, { useCallback } from 'react';
import classNames from 'classnames/bind';

import Input from '../Input';

import styles from './InputColor.module.scss';

const cx = classNames.bind(styles);

type InputProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'value'>;
type Props = InputProps & {
  className?: string;
  id: string;
  value: string | number | null;
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
  const handleChange = useCallback(
    (event) => {
      const { value: newValue } = event.target;

      onChange(newValue);
    },
    [onChange]
  );

  return (
    <Input
      className={cx('base', className)}
      id={id}
      value={value}
      onChange={onChange}
      left={
        <input
          className={cx('color')}
          type="color"
          onChange={handleChange}
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
