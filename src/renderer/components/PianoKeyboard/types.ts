import { Chord } from '@tonaljs/chord';
import { KeyboardSettings } from 'main/types';
import { KeySignatureConfig } from 'renderer/helpers';

export type PianoKeyboardProps = {
  id?: string;
  className?: string;
  keyboard?: KeyboardSettings;
  keySignature?: KeySignatureConfig;
  played?: number[];
  sustained?: number[];
  midi?: number[];
  targets?: number[] | null;
  exactTargets?: boolean;
  chord?: Chord;
};
