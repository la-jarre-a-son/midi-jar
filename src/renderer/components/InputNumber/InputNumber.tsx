import React from 'react';
import classNames from 'classnames/bind';

import useEvent from 'renderer/hooks/useEvent';

import { Input, Button, InputGroup } from '@la-jarre-a-son/ui';
import { Icon } from '../Icon';

import { InputNumberProps } from './types';

import styles from './InputNumber.module.scss';

const cx = classNames.bind(styles);

export const InputNumber: React.FC<InputNumberProps> = ({
  className,
  value,
  onChange,
  step,
  ...rest
}) => {
  const increment = useEvent(() => {
    if (onChange) onChange(Number(value) + Number(step));
  });

  const decrement = () => {
    if (onChange) onChange(Number(value) - Number(step));
  };

  const handleChange = useEvent((v: string) => {
    if (onChange) onChange(Number(v));
  });

  return (
    <InputGroup>
      <Input
        className={cx('base', className)}
        value={value}
        onChange={handleChange}
        type="number"
        step={step}
        {...rest}
      />
      <Button className={cx('decrement')} onClick={decrement} icon aria-label="decrement">
        <Icon name="minus" />
      </Button>
      <Button className={cx('increment')} onClick={increment} icon aria-label="increment">
        <Icon name="plus" />
      </Button>
    </InputGroup>
  );
};

InputNumber.defaultProps = {
  className: undefined,
};

export default InputNumber;
