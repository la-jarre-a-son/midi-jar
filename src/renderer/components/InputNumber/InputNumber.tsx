import React from 'react';
import classNames from 'classnames/bind';

import useEvent from 'renderer/hooks/useEvent';
import Input from '../Input';
import Button from '../Button';
import ButtonGroup from '../ButtonGroup';

import styles from './InputNumber.module.scss';
import Icon from '../Icon';

const cx = classNames.bind(styles);

type InputProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'value'>;
type Props = InputProps & {
  className?: string;
  id: string;
  value: string | number | null;
  onChange: (value: number) => unknown;
  block?: boolean;
  withOctave?: boolean;
  learn?: boolean;
};

const defaultProps = {
  className: undefined,
  block: false,
  withOctave: false,
  learn: false,
};

const InputNumber: React.FC<Props> = ({
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

InputNumber.defaultProps = defaultProps;

export default InputNumber;
