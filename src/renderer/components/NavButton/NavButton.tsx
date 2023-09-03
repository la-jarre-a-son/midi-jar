import React from 'react';
import {
  Link,
  LinkProps,
  useResolvedPath,
  useLocation,
  UNSAFE_NavigationContext as NavigationContext,
} from 'react-router-dom';

import { ToggleButton } from '@la-jarre-a-son/ui';

import { NavButtonProps } from './types';

export const NavButton = React.forwardRef<HTMLAnchorElement, LinkProps & NavButtonProps>(
  function NavButtonWithRef(
    {
      'aria-current': ariaCurrentProp = 'page',
      caseSensitive = false,
      end = false,
      to,
      children,
      ...rest
    },
    ref
  ) {
    const path = useResolvedPath(to, { relative: rest.relative });
    const location = useLocation();
    const { navigator } = React.useContext(NavigationContext);

    let toPathname = navigator.encodeLocation
      ? navigator.encodeLocation(path).pathname
      : path.pathname;
    let locationPathname = location.pathname;

    if (!caseSensitive) {
      locationPathname = locationPathname.toLowerCase();
      toPathname = toPathname.toLowerCase();
    }

    const isActive =
      locationPathname === toPathname ||
      (!end &&
        locationPathname.startsWith(toPathname) &&
        locationPathname.charAt(toPathname.length) === '/');

    const ariaCurrent = isActive ? ariaCurrentProp : undefined;

    return (
      <ToggleButton
        as={Link}
        {...rest}
        aria-current={ariaCurrent}
        ref={ref}
        to={to}
        selected={isActive}
      >
        {children}
      </ToggleButton>
    );
  }
);

export default NavButton;
