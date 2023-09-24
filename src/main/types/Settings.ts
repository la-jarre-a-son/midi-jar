export type ChordDisplaySettings = {
  id: string;
  skin: 'classic' | 'flat';
  from: string;
  to: string;
  displayKeyboard: boolean;
  displayNotes: boolean;
  displayChord: boolean;
  displayNotation: boolean;
  displayAltChords: boolean;
  displayTonic: boolean;
  displayDegrees: boolean;
  displayKeyNames: boolean;
  displayIntervals: boolean;
  colorHighlight: string | null;
  colorNoteWhite: string | null;
  colorNoteBlack: string | null;
};

export type ChordQuizSettings = {
  mode: 'random' | 'randomInKey';
  difficulty: 0 | 1 | 2 | 3 | 4 | 5;
  gameLength: number;
  gamification: boolean;
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

export type Settings = {
  general: {
    launchAtStartup: boolean;
    startMinimized: boolean;
  };
  chordDisplay: ChordDisplaySettings[];
  chordQuiz: ChordQuizSettings;
  circleOfFifths: CircleOfFifthsSettings;
  notation: NotationSettings;
  server: ServerSettings;
};
