import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useMemo,
} from 'react';
import classnames from 'classnames/bind';
import type { To } from 'react-router';

import CustomLink from '../CustomLink';
import Icon from '../Icon';

import styles from './Button.module.scss';

const cx = classnames.bind(styles);

const FEEDBACK_DURATION = 1500;

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

export type Props = {
  /**
   * Triggered when button is clicked - should return a Promise
   */
  onClick?: (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>
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
  icon?: boolean | string;
  successIcon?: string;
  errorIcon?: string;
  pendingIcon?: string;
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
  toggle?: boolean;

  /**
   * An external promise given for feedback.
   *
   * @since 1.4.0
   */
  active?: boolean;
};

const defaultProps = {
  className: undefined,
  children: undefined,
  disabled: false,
  disabledMessage: '',
  block: false,
  intent: 'default' as ButtonIntents,
  icon: false,
  successIcon: 'check',
  errorIcon: 'exclamation',
  pendingIcon: 'loading',
  hoverVariant: false,
  type: 'button' as ButtonTypes,
  toggle: false,
  active: undefined,
  promise: null,
  to: undefined,
  title: undefined,
  onClick: undefined,
};

/**
 * A button which can handle progess (with native Promise), and shows a visual feedback
 * to user if it is pending / success / error.
 *
 * @version 1.3.0
 * @author Rémi Jarasson
 */
const Button: React.FC<Props> = ({
  type,
  intent,
  className,
  icon,
  successIcon,
  errorIcon,
  pendingIcon,
  hoverVariant,
  block,
  active,
  disabled,
  disabledMessage,
  to,
  title,
  promise,
  children,
  onClick,
}) => {
  const [status, setStatus] = useState<ButtonStatus>(null);

  const currentPromise = useRef(promise);
  const currentTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimeout = useCallback(() => {
    if (currentTimeout.current) {
      clearTimeout(currentTimeout.current);
    }
    currentTimeout.current = setTimeout(() => {
      setStatus(null);
      currentTimeout.current = null;
    }, FEEDBACK_DURATION);
  }, [setStatus]);

  const handlePromiseSuccess = useCallback(
    (resolvedPromise) => {
      if (currentPromise?.current === resolvedPromise) {
        setStatus('success');
        startTimeout();
      }
    },
    [setStatus, startTimeout]
  );

  const handlePromiseError = useCallback(
    (resolvedPromise) => {
      if (currentPromise?.current === resolvedPromise) {
        setStatus('error');
        startTimeout();
      }
    },
    [currentPromise, setStatus, startTimeout]
  );

  const handleClick = useCallback(
    (
      event:
        | React.MouseEvent<HTMLAnchorElement>
        | React.MouseEvent<HTMLButtonElement>
    ) => {
      if (onClick) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = onClick(event as React.MouseEvent<any>);
        if (result instanceof Promise) {
          currentPromise.current = result;
          setStatus('pending');
          result
            .then(() => handlePromiseSuccess(result))
            .catch(() => handlePromiseError(result));
        }
      }
      return null;
    },
    [handlePromiseError, handlePromiseSuccess, onClick]
  );

  useEffect(() => {
    if (promise) {
      currentPromise.current = promise;
      promise
        .then(() => handlePromiseSuccess(promise))
        .catch(() => handlePromiseError(promise));
    } else {
      currentPromise.current = null;
    }
  }, [promise, handlePromiseSuccess, handlePromiseError]);

  useEffect(
    () => () => {
      currentPromise.current = null;
      if (currentTimeout.current) {
        clearTimeout(currentTimeout.current);
      }
    },
    []
  );

  const renderFeedback = useMemo(() => {
    switch (status) {
      case 'success':
        return <Icon className={cx('icon')} name={successIcon ?? 'check'} />;
      case 'pending':
        return (
          <Icon className={cx('icon')} name={pendingIcon ?? 'loading'} spin />
        );
      case 'error':
        return (
          <Icon className={cx('icon')} name={errorIcon ?? 'exclamation'} />
        );
      default:
        return '';
    }
  }, [errorIcon, pendingIcon, status, successIcon]);

  const renderChildren = useMemo(() => {
    return React.Children.map(children, (child) => {
      if (typeof child === 'string' && child) {
        return <span>{child}</span>;
      }
      // if (child instanceof React.Component && child.constructor === Icon) {
      //   return <span className={cx('icon')}>{child}</span>;
      // }
      // if (
      //   child instanceof React.Component &&
      //   child.constructor === NotificationsBadge
      // ) {
      //   return <span className={cx('badge')}>{child}</span>;
      // }

      return child;
    });
  }, [children]);

  return (
    <CustomLink
      to={to}
      onClick={handleClick}
      title={title}
      disabled={!!status || !!disabled}
      type={type}
      activeClassName={cx('base--isActive')}
      className={cx(
        'base',
        `base--${intent}`,
        {
          'base--withDisabledMessage': !icon && !!disabledMessage,
          'base--disabled': !!disabled,
          'base--classic': !icon,
          'base--hoverVariant': !!hoverVariant,
          'base--icon': !!icon,
          'base--block': !icon && block,
          'base--isPending': status === 'pending',
          'base--isError': status === 'error',
          'base--isSuccess': status === 'success',
          'base--isActive': active === true,
          'base--isInactive': active === false,
        },
        className
      )}
    >
      <span className={cx('content')}>
        {icon && icon !== true ? (
          <Icon name={icon} hover={!disabled} />
        ) : (
          renderChildren
        )}
      </span>
      <span className={cx('feedback')}>{status && renderFeedback}</span>
      {!icon && disabledMessage && (
        <span className={cx('disabledMessage')}>{disabledMessage}</span>
      )}
    </CustomLink>
  );
};

Button.defaultProps = defaultProps;

export default Button;
