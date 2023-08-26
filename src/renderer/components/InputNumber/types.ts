export type InputNumberProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'value'> & {
  className?: string;
  id: string;
  value: string | number | null;
  onChange: (value: number) => unknown;
  block?: boolean;
  withOctave?: boolean;
  learn?: boolean;
};
