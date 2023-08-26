import { ReactEventHandler } from 'react';

export type InputProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'value'> & {
  className?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  id: string;
  value: string | number | null;
  onChange: (value: string) => unknown;
  onKeyPress?: ReactEventHandler<HTMLInputElement>;
  block?: boolean;
  disabled?: boolean;
};
