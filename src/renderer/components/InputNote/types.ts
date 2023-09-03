import { InputProps } from '@la-jarre-a-son/ui';

export type InputNoteProps = Omit<InputProps, 'onChange' | 'value'> & {
  className?: string;
  value: string | null;
  onChange: (value: string) => unknown;
  withOctave?: boolean;
  learn?: boolean;
};
