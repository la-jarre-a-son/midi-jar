import { ButtonIntents } from '../Button';
import { IconName } from '../Icon';

export type ToggleValue = string | number | boolean | null;

export type ToggleChoice = {
  label: string | React.ReactNode;
  value: ToggleValue;
  intent?: ButtonIntents;
};

export type ToggleProps = {
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
  successIcon?: IconName;
  errorIcon?: IconName;
  pendingIcon?: IconName;
  disabled?: boolean;
};
