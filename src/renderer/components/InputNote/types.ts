export type InputNoteProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'value'> & {
  className?: string;
  id: string;
  value: string | number | null;
  onChange: (value: string) => unknown;
  block?: boolean;
  withOctave?: boolean;
  learn?: boolean;
};
