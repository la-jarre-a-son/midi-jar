import { InputProps } from '@la-jarre-a-son/ui';

export type InputColorProps = Omit<InputProps, 'onChange' | 'value'> & {
  className?: string;
  value: string | null;
  onChange: (value: string) => unknown;
  block?: boolean;
};
