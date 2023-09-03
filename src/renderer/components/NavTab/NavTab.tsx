import React from 'react';
import {
  Link,
  LinkProps,
  useResolvedPath,
  useLocation,
  UNSAFE_NavigationContext as NavigationContext,
} from 'react-router-dom';

import { Tab } from '@la-jarre-a-son/ui';

import { NavTabProps } from './types';

export const NavTab = React.forwardRef<HTMLAnchorElement, LinkProps & NavTabProps>(
  function NavTabWithRef(
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
      <Tab as={Link} {...rest} aria-current={ariaCurrent} ref={ref} to={to} selected={isActive}>
        {children}
      </Tab>
    );
  }
);

export default NavTab;
