import React from 'react';
import classNames from 'classnames/bind';

import useEvent from 'renderer/hooks/useEvent';

import { Input } from '../Input';
import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { Icon } from '../Icon';

import { InputNumberProps } from './types';

import styles from './InputNumber.module.scss';

const cx = classNames.bind(styles);

export const InputNumber: React.FC<InputNumberProps> = ({
  className,
  id,
  value,
  onChange,
  block,
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
    <ButtonGroup>
      <Input
        className={cx('base', className)}
        id={id}
        value={value}
        onChange={handleChange}
        block={block}
        type="number"
        step={step}
        {...rest}
      />
      <Button className={cx('decrement')} onClick={decrement} intent="default">
        <Icon name="minus" />
      </Button>
      <Button className={cx('increment')} onClick={increment} intent="default">
        <Icon name="plus" />
      </Button>
    </ButtonGroup>
  );
};

InputNumber.defaultProps = {
  className: undefined,
  block: false,
  withOctave: false,
  learn: false,
};

export default InputNumber;
