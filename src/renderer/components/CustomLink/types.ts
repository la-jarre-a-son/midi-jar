import { To } from 'react-router';

export type CustomLinkTypes = 'link' | 'button' | 'submit' | 'reset';

export type CustomLinkProps = {
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
    event: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>
  ) => unknown;
};
