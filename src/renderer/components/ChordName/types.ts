import { Chord } from '@tonaljs/chord';

export type ChordNameProps = {
  className?: string;
  chord?: Chord | null;
  notation?: 'long' | 'short' | 'symbol';
  hideRoot?: boolean;
  highlightAlterations?: boolean;
  latinSharpsFlats?: boolean;
};
