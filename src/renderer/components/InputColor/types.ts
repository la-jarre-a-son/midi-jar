export type InputColorProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'value'> & {
  className?: string;
  id: string;
  value: string | null;
  onChange: (value: string) => unknown;
  block?: boolean;
};
