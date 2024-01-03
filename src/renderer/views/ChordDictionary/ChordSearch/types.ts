import { Chord } from '@tonaljs/chord';

export type ChordSearchProps = {
  className?: string;
  onSelect: (value: string | null) => unknown;
};

export type ChordSearchOptionProps = {
  /**
   * Specifies that the option is selected
   */
  selected?: boolean;
  /**
   * Specifies that the option is focused
   */
  focused?: boolean;
  /**
   * Callback fired when the option is selected
   */
  onSelect?: (value: string | null) => void;
  /**
   * The chord result
   */
  chord: Chord;
  /**
   * The matching parts of chord name
   */
  parts?: [string, string];
};

export type ChordSearchResult = {
  chord: Chord;
  parts: [string, string];
};
