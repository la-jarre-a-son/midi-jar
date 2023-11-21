/* v1.0.0 */
export type v1_0_0_ChordDisplaySettings = {
  useInternal: boolean;
  skin: 'classic' | 'flat';
  from: string;
  to: string;
  accidentals: 'flat' | 'sharp';
  displayKeyboard: boolean;
  displayNotes: boolean;
  displayChord: boolean;
  displayAltChords: boolean;
  displayTonic: boolean;
  displayDegrees: boolean;
  displayKeyNames: boolean;
  colorHighlight: string | null;
  colorNoteWhite: string | null;
  colorNoteBlack: string | null;
};

export type v1_0_0_ServerSettings = {
  enabled: boolean;
  port: number;
};

export type v1_0_0_GeneralSettings = {
  launchAtStartup: boolean;
  startMinimized: boolean;
};

export type v1_0_0_Settings = {
  general: v1_0_0_GeneralSettings;
  server: v1_0_0_ServerSettings;
  chordDisplay: {
    internal: v1_0_0_ChordDisplaySettings;
    overlay?: v1_0_0_ChordDisplaySettings;
  };
};

export type v1_0_0_MidiRouteRaw = {
  input: string;
  output: string;
  type: 'physical' | 'internal' | 'websocket';
  enabled: boolean;
};

/* v1.1.0 - added staff notation in chord-display */

export type v1_1_0_ChordDisplaySettings = v1_0_0_ChordDisplaySettings & {
  displayNotation: boolean;
  key: string;
};

export type v1_1_0_Settings = {
  general: v1_0_0_GeneralSettings;
  server: v1_0_0_ServerSettings;
  chordDisplay: {
    internal: v1_1_0_ChordDisplaySettings;
    overlay?: v1_1_0_ChordDisplaySettings;
  };
};

/* v1.2.0 - moved staff notation to specific settings + circle of fifths */

export type v1_2_0_NotationSettings = {
  key: string;
  accidentals: 'flat' | 'sharp';
  staffClef: 'both' | 'bass' | 'treble';
  staffTranspose: number;
};

export type v1_2_0_ChordDisplaySettings = Omit<v1_1_0_ChordDisplaySettings, 'accidentals' | 'key'>;

export type v1_2_0_CircleOfFifthsSettings = {
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

export type v1_2_0_Settings = {
  general: v1_0_0_GeneralSettings;
  server: v1_0_0_ServerSettings;
  chordDisplay: {
    internal: v1_2_0_ChordDisplaySettings;
    overlay?: v1_2_0_ChordDisplaySettings;
  };
  circleOfFifths: v1_2_0_CircleOfFifthsSettings;
  notation: v1_2_0_NotationSettings;
};

/* v1.3.0 - added chord-quiz + intervals in chord-display */

export type v1_3_0_ChordDisplaySettings = v1_2_0_ChordDisplaySettings & {
  displayIntervals: boolean;
};

export type v1_3_0_ChordQuizSettings = {
  mode: 'random' | 'randomInKey';
  difficulty: 0 | 1 | 2 | 3 | 4 | 5;
  gameLength: number;
  gamification: boolean;
  displayReaction: boolean;
  displayIntervals: boolean;
};

export type v1_3_0_Settings = {
  general: v1_0_0_GeneralSettings;
  server: v1_0_0_ServerSettings;
  chordDisplay: {
    internal: v1_3_0_ChordDisplaySettings;
    overlay?: v1_3_0_ChordDisplaySettings;
  };
  notation: v1_2_0_NotationSettings;
  circleOfFifths: v1_2_0_CircleOfFifthsSettings;
  chordQuiz: v1_3_0_ChordQuizSettings;
};

/* v1.3.1 (unpublished) - migrated midi routes to allow multiple chord-display modules */

export interface v1_3_1_MidiRouteRaw {
  input: string;
  output: string;
  type: 'physical' | 'internal';
  enabled: boolean;
}

/* v1.4.0 - migrated chord-display to an array of settings + migrated midi routes */

export type v1_4_0_WindowState = {
  x: number | null;
  y: number | null;
  width: number | null;
  height: number | null;
  changelogDismissed: boolean;
};

export type v1_4_0_ChordDisplaySettings = Omit<v1_3_0_ChordDisplaySettings, 'useInternal'> & {
  id: string;
};

export type v1_4_0_Settings = {
  general: v1_0_0_GeneralSettings;
  server: v1_0_0_ServerSettings;
  chordDisplay: v1_4_0_ChordDisplaySettings[];
  chordQuiz: v1_3_0_ChordQuizSettings;
  circleOfFifths: v1_2_0_CircleOfFifthsSettings;
  notation: v1_2_0_NotationSettings;
};

/* v1.5.0 - update chord dictionary with omissions and chord notations */

export type v1_5_0_ChordDisplaySettings = v1_4_0_ChordDisplaySettings & {
  chordNotation: 'long' | 'short' | 'symbol';
  allowOmissions: boolean;
  highlightAlterations: boolean;
  displayName: boolean;
};

export type v1_5_0_ChordQuizSettings = v1_3_0_ChordQuizSettings & {
  chordNotation: 'long' | 'short' | 'symbol';
  displayName: boolean;
};

export type v1_5_0_Settings = {
  general: v1_0_0_GeneralSettings;
  server: v1_0_0_ServerSettings;
  chordDisplay: v1_5_0_ChordDisplaySettings[];
  chordQuiz: v1_5_0_ChordQuizSettings;
  circleOfFifths: v1_2_0_CircleOfFifthsSettings;
  notation: v1_2_0_NotationSettings;
};

/* v1.5.1 - window state with maximized, aot, path and updateDismissed */
export type v1_5_1_WindowState = v1_4_0_WindowState & {
  maximized: boolean;
  alwaysOnTop: boolean;
  path: string;
  updateDismissed: string | null;
};
