import { Chord } from '@tonaljs/chord';

export type ChordNameProps = {
  className?: string;
  chord?: Chord | null;
  notation?: 'long' | 'short' | 'symbol' | 'preferred' | number;
  hideRoot?: boolean;
  highlightAlterations?: boolean;
  latinSharpsFlats?: boolean;
};
