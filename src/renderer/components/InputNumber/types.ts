import { InputProps } from '@la-jarre-a-son/ui';

export type InputNumberProps = Omit<InputProps, 'onChange' | 'value'> & {
  className?: string;
  value: string | number;
  onChange: (value: number) => unknown;
  block?: boolean;
  withOctave?: boolean;
  learn?: boolean;
};
