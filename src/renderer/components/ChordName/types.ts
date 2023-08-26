import { Chord } from '@tonaljs/chord';

export type ChordNameProps = {
  className?: string;
  chord?: Chord | null;
  hideRoot?: boolean;
  latinSharpsFlats?: boolean;
};
