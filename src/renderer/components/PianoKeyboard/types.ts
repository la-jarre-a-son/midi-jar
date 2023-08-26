import { Chord } from '@tonaljs/chord';
import { KeySignatureConfig } from 'renderer/helpers';

export type PianoKeyboardProps = {
  id?: string;
  className?: string;
  skin?: 'classic' | 'flat';
  from?: string;
  to?: string;
  keySignature?: KeySignatureConfig;
  colorNoteWhite?: string;
  colorNoteBlack?: string;
  colorHighlight?: string;
  displayKeyNames?: boolean;
  displayDegrees?: boolean;
  displayTonic?: boolean;
  sustained?: number[];
  midi?: number[];
  chord?: Chord;
};
