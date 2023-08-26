import type { To } from 'react-router';

import { IconName } from '../Icon';

export type ButtonIntents =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'submit'
  | 'success'
  | 'warning'
  | 'danger'
  | 'transparent';

export type ButtonTypes = 'link' | 'button' | 'submit';

export type ButtonStatus = null | 'success' | 'pending' | 'error';

export type ButtonProps = {
  /**
   * Triggered when button is clicked - should return a Promise
   */
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLAnchorElement>
  ) => unknown;
  to?: To;
  title?: string;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  /**
   * A message to display when Button is disabled.
   *
   * @since 1.2.0
   */
  disabledMessage?: string;

  block?: boolean;
  intent?: ButtonIntents;
  icon?: boolean | IconName;
  successIcon?: IconName;
  errorIcon?: IconName;
  pendingIcon?: IconName;
  hoverVariant?: boolean;
  /**
   * A message to display when Button is disabled.
   *
   * @since 1.2.0
   */
  type?: ButtonTypes;
  /**
   * An external promise given for feedback.
   *
   * @since 1.3.0
   */
  promise?: Promise<unknown> | null;

  /**
   * An external promise given for feedback.
   *
   * @since 1.4.0
   */
  active?: boolean;
};
