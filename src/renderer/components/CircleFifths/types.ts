import { Chord } from '@tonaljs/chord';
import { KeySignatureConfig } from 'renderer/helpers/note';

export type Section = {
  enabled: boolean;
  size: number;
  start: number;
  end: number;
  middle: number;
  align: number;
};

export type SectionType =
  | 'alt'
  | 'modes'
  | 'degreesMajor'
  | 'major'
  | 'dom'
  | 'degreesMinor'
  | 'minor'
  | 'dim'
  | 'arrow';

export type Sections = Record<SectionType, Section>;

export type CircleOfFifthsConfig = {
  scale?: 'major' | 'minor';
  highlightSector?: 'chord' | 'notes';
  highlightInScale?: boolean;
  displayMajor?: boolean;
  displayMinor?: boolean;
  displayDominants?: boolean;
  displaySuspended?: boolean;
  displayDiminished?: boolean;
  displayAlterations?: boolean;
  displayModes?: boolean;
  displayDegrees?: boolean;
  displayDegreeLabels?: boolean;
};

export type CircleFifthsProps = {
  className?: string;
  children?: React.ReactNode;
  keySignature?: KeySignatureConfig;
  chord?: Chord | null;
  notes?: string[];
  onChange?: (key: string) => unknown;
  config?: CircleOfFifthsConfig;
};
