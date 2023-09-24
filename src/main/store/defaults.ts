import { StoreType } from '../types/Store';

export const defaults: StoreType = {
  midi: {
    routes: [],
  },
  windowState: {
    x: null,
    y: null,
    width: null,
    height: null,
    changelogDismissed: false,
  },
  settings: {
    general: {
      launchAtStartup: false,
      startMinimized: false,
    },
    chordDisplay: [
      {
        id: 'default',
        skin: 'classic' as const,
        from: 'C3',
        to: 'C5',
        displayKeyboard: true,
        displayNotes: true,
        displayChord: true,
        displayNotation: false,
        displayAltChords: true,
        displayTonic: true,
        displayDegrees: true,
        displayKeyNames: true,
        displayIntervals: false,
        colorHighlight: '#315bce',
        colorNoteWhite: '#ffffff',
        colorNoteBlack: '#000000',
      },
    ],
    chordQuiz: {
      mode: 'random' as const,
      difficulty: 0 as const,
      gameLength: 16,
      gamification: true,
      displayReaction: true,
      displayIntervals: true,
    },
    circleOfFifths: {
      scale: 'major' as const,
      highlightSector: 'chord' as const,
      highlightInScale: true,
      displayMajor: true,
      displayMinor: true,
      displayDiminished: true,
      displayDominants: false,
      displaySuspended: false,
      displayAlterations: true,
      displayModes: false,
      displayDegrees: false,
      displayDegreeLabels: false,
    },
    notation: {
      key: 'C',
      accidentals: 'flat' as const,
      staffClef: 'both' as const,
      staffTranspose: 0,
    },
    server: {
      enabled: true,
      port: 25011,
    },
  },
};
