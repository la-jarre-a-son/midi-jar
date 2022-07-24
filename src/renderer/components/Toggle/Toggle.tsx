import React from 'react';
import classNames from 'classnames/bind';
import Button, { ButtonIntents } from '../Button';
import ButtonGroup from '../ButtonGroup';
import Icon from '../Icon';

import styles from './Toggle.module.scss';

const cx = classNames.bind(styles);

type ToggleValue = string | number | boolean | null;

export interface ToggleChoice {
  label: string | React.ReactNode;
  value: ToggleValue;
  intent?: ButtonIntents;
}

type Props = {
  className?: string;
  id: string;

  /**
   * Possible values
   */
  choices?: ToggleChoice[];
  /**
   * Current Value
   */
  value?: ToggleValue;
  /**
   * When toggle changes
   */
  onChange: (value: ToggleValue) => unknown;
  /* Feedback icons */
  successIcon?: string;
  errorIcon?: string;
  pendingIcon?: string;
  disabled?: boolean;
};

const defaultChoices = [
  {
    label: <Icon name="check" />,
    value: true,
    intent: 'success' as ButtonIntents,
  },
  {
    label: <Icon name="cross" />,
    intent: 'danger' as ButtonIntents,
    value: false,
  },
];

const defaultProps = {
  className: undefined,
  choices: defaultChoices,
  value: null,
  successIcon: undefined,
  errorIcon: undefined,
  pendingIcon: undefined,
  disabled: false,
};

/**
 * A group of buttons that can be toggled.
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
export const Toggle: React.FC<Props> = ({
  className,
  id,
  choices,
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

Toggle.defaultProps = defaultProps;

export default Toggle;
