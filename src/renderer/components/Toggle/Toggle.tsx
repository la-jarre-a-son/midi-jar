import React from 'react';
import classNames from 'classnames/bind';
import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { Icon } from '../Icon';

import styles from './Toggle.module.scss';
import { ToggleProps } from './types';

const cx = classNames.bind(styles);

const defaultChoices = [
  {
    label: <Icon name="cross" />,
    intent: 'danger' as const,
    value: false,
  },
  {
    label: <Icon name="check" />,
    value: true,
    intent: 'success' as const,
  },
];

/**
 * A group of buttons that can be toggled.
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
export const Toggle: React.FC<ToggleProps> = ({
  className,
  id,
  choices = defaultChoices,
  value,
  disabled,
  onChange,
  successIcon,
  errorIcon,
  pendingIcon,
}) => (
  <ButtonGroup className={cx('base', className)}>
    <input type="hidden" id={id} value={value?.toString() ?? ''} />
    {choices?.map((choice, index) => (
      <Button
        key={`${choice.value}_${index}`}
        className={cx('button')}
        intent={choice.intent}
        active={value === choice.value}
        onClick={() => value !== choice.value && onChange(choice.value)}
        successIcon={successIcon}
        errorIcon={errorIcon}
        pendingIcon={pendingIcon}
        disabled={disabled}
      >
        {choice.label}
      </Button>
    ))}
  </ButtonGroup>
);

Toggle.defaultProps = {
  className: undefined,
  choices: defaultChoices,
  value: null,
  successIcon: undefined,
  errorIcon: undefined,
  pendingIcon: undefined,
  disabled: false,
};

export default Toggle;
