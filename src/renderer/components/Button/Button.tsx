import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import classnames from 'classnames/bind';

import { CustomLink } from '../CustomLink';
import { Icon } from '../Icon';

import { ButtonIntents, ButtonProps, ButtonStatus, ButtonTypes } from './types';

import styles from './Button.module.scss';

const cx = classnames.bind(styles);

const FEEDBACK_DURATION = 1500;

/**
 * A button which can handle progess (with native Promise), and shows a visual feedback
 * to user if it is pending / success / error.
 *
 * @version 1.3.0
 * @author Rémi Jarasson
 */
export const Button: React.FC<ButtonProps> = ({
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
    (resolvedPromise: Promise<unknown>) => {
      if (currentPromise?.current === resolvedPromise) {
        setStatus('success');
        startTimeout();
      }
    },
    [setStatus, startTimeout]
  );

  const handlePromiseError = useCallback(
    (resolvedPromise: Promise<unknown>) => {
      if (currentPromise?.current === resolvedPromise) {
        setStatus('error');
        startTimeout();
      }
    },
    [currentPromise, setStatus, startTimeout]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        const result = onClick(event);
        if (result instanceof Promise) {
          currentPromise.current = result;
          setStatus('pending');
          result.then(() => handlePromiseSuccess(result)).catch(() => handlePromiseError(result));
        }
      }
      return null;
    },
    [handlePromiseError, handlePromiseSuccess, onClick]
  );

  useEffect(() => {
    if (promise) {
      currentPromise.current = promise;
      promise.then(() => handlePromiseSuccess(promise)).catch(() => handlePromiseError(promise));
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
        return <Icon className={cx('icon')} name={pendingIcon ?? 'loading'} spin />;
      case 'error':
        return <Icon className={cx('icon')} name={errorIcon ?? 'exclamation'} />;
      default:
        return '';
    }
  }, [errorIcon, pendingIcon, status, successIcon]);

  const renderChildren = useMemo(() => {
    return React.Children.map(children, (child) => {
      if (typeof child === 'string' && child) {
        return <span>{child}</span>;
      }

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
        {icon && icon !== true ? <Icon name={icon} hover={!disabled} /> : renderChildren}
      </span>
      <span className={cx('feedback')}>{status && renderFeedback}</span>
      {!icon && disabledMessage && <span className={cx('disabledMessage')}>{disabledMessage}</span>}
    </CustomLink>
  );
};

Button.defaultProps = {
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
  active: undefined,
  promise: null,
  to: undefined,
  title: undefined,
  onClick: undefined,
};

export default Button;
