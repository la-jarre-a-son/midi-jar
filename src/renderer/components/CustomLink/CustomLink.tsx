import React, { useCallback } from 'react';
import { To } from 'react-router';
import { NavLink } from 'react-router-dom';

import './CustomLink.scss';

export type CustomLinkTypes = 'link' | 'button' | 'submit' | 'reset';

export type Props = {
  className?: string;
  activeClassName?: string;
  children?: React.ReactNode;
  type?: CustomLinkTypes;
  to?: To;
  href?: string;
  target?: string;
  exact?: boolean;
  disabled?: boolean;
  title?: string;
  onClick?: (
    event:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLButtonElement>
  ) => unknown;
};

const defaultProps = {
  className: undefined,
  activeClassName: undefined,
  children: undefined,
  type: 'link' as CustomLinkTypes,
  to: undefined,
  href: undefined,
  target: undefined,
  title: undefined,
  onClick: undefined,
  exact: false,
  disabled: false,
};

/**
 * An inline component to display vector icons from svg with variant (normal/outline/flat).
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const CustomLink: React.FC<Props> = ({
  type,
  to: propsTo,
  exact,
  href: propsHref,
  target: propsTarget,
  className,
  activeClassName,
  disabled,
  title,
  children,
  onClick,
}) => {
  const to = propsTo || propsHref;

  const handleClick = useCallback(
    (
      event:
        | React.MouseEvent<HTMLButtonElement>
        | React.MouseEvent<HTMLAnchorElement>
    ) => {
      if (disabled) {
        event.preventDefault();
      }
      if (onClick && !disabled) {
        onClick(event);
      }
    },
    [onClick, disabled]
  );

  if (!to && type === 'submit') {
    return <button type="submit">{children}</button>;
  }
  if (!to && (type === 'reset' || type === 'button')) {
    return (
      <button
        type="button"
        className={className}
        onClick={handleClick}
        title={title}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
  if (!to && type === 'submit') {
    return (
      <button
        type="submit"
        className={className}
        onClick={handleClick}
        title={title}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
  if (!to && propsHref) {
    return (
      <a
        className={className}
        href={propsHref}
        target={propsTarget || '_blank'}
        title={title}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }
  if (
    typeof to === 'string' &&
    (to.startsWith('http://') ||
      to.startsWith('https://') ||
      to.startsWith('//') ||
      to.startsWith('mailto:') ||
      to.startsWith('tel:'))
  ) {
    return (
      <a
        className={className}
        href={to}
        target={propsTarget || '_blank'}
        title={title}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <NavLink
      className={({ isActive }) =>
        [className, isActive ? activeClassName : ''].filter(Boolean).join(' ')
      }
      title={title}
      to={to || '.'}
      onClick={handleClick}
      end={exact}
    >
      {children}
    </NavLink>
  );
};

CustomLink.defaultProps = defaultProps;

export default CustomLink;
