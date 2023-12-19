export type KeyboardSettings = {
  skin: 'classic' | 'flat';
  from: string;
  to: string;
  label: 'none' | 'pitchClass' | 'note' | 'chordNote' | 'interval';
  keyName: 'none' | 'octave' | 'pitchClass' | 'note';
  keyInfo: 'none' | 'tonic' | 'interval' | 'tonicAndInterval';
  fadeOutDuration: number;
  textOpacity: number;
  displaySustained: boolean;
  wrap: boolean;
  sizes: {
    radius: number;
    height: number;
    ratio: number;
    bevel: boolean;
  };
  colors: {
    white: string | null;
    black: string | null;
    played: string | null;
    wrapped: string | null;
    sustained: string | null;
  };
};

export type ChordDisplaySettings = {
  id: string;
  chordNotation: 'long' | 'short' | 'symbol';
  allowOmissions: boolean;
  useSustain: boolean;
  detectOnRelease: boolean;
  highlightAlterations: boolean;
  displayKeyboard: boolean;
  displayChord: boolean;
  displayName: boolean;
  displayNotation: boolean;
  displayAltChords: boolean;
  displayIntervals: boolean;
  keyboard: KeyboardSettings;
};

export type ChordQuizSettings = {
  mode: 'random' | 'randomInKey';
  difficulty: 0 | 1 | 2 | 3 | 4 | 5;
  gameLength: number;
  gamification: boolean;
  chordNotation: 'long' | 'short' | 'symbol';
  displayName: boolean;
  displayReaction: boolean;
  displayIntervals: boolean;
};

export type CircleOfFifthsSettings = {
  scale: 'major' | 'minor';
  highlightSector: 'chord' | 'notes';
  highlightInScale: boolean;
  displayMajor: boolean;
  displayMinor: boolean;
  displayDiminished: boolean;
  displayDominants: boolean;
  displayAlterations: boolean;
  displaySuspended: boolean;
  displayModes: boolean;
  displayDegrees: boolean;
  displayDegreeLabels: boolean;
};

export type NotationSettings = {
  key: string;
  accidentals: 'flat' | 'sharp';
  staffClef: 'both' | 'bass' | 'treble';
  staffTranspose: number;
};

export type ServerSettings = {
  enabled: boolean;
  port: number;
};

export type GeneralSettings = {
  launchAtStartup: boolean;
  startMinimized: boolean;
};

export type Settings = {
  general: GeneralSettings;
  chordDisplay: ChordDisplaySettings[];
  chordQuiz: ChordQuizSettings;
  circleOfFifths: CircleOfFifthsSettings;
  notation: NotationSettings;
  server: ServerSettings;
};
