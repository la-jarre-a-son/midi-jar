import { KeySignatureConfig } from 'renderer/helpers';

export type NotationProps = {
  id?: string;
  className?: string;
  midiNotes?: number[];
  keySignature: KeySignatureConfig;
  staffClef?: 'both' | 'bass' | 'treble';
  staffTranspose?: number;
};
