import { CustomLinkProps } from '../CustomLink';

export type LinkProps = CustomLinkProps & {
  className?: string;
  children?: React.ReactNode;
};
