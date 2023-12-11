import {
  ChordDisplaySettings,
  ChordQuizSettings,
  CircleOfFifthsSettings,
  KeyboardSettings,
  NotationSettings,
} from 'main/types';
import { StoreType } from '../types/Store';

export const defaultKeyboardSettings: KeyboardSettings = {
  skin: 'classic' as const,
  from: 'C3',
  to: 'C5',
  label: 'pitchClass',
  keyName: 'note',
  keyInfo: 'tonicAndInterval',
  fadeOutDuration: 0,
  textOpacity: 0.5,
  displaySustained: true,
  sizes: {
    radius: 0.4,
    height: 6,
    ratio: 0.6,
    bevel: true,
  },
  colors: {
    white: '#ffffff',
    black: '#000000',
    played: '#315bce',
    sustained: '#777777',
  },
};

export const defaultChordDisplaySettings: ChordDisplaySettings = {
  id: 'default',
  chordNotation: 'short',
  allowOmissions: true,
  useSustain: true,
  highlightAlterations: false,
  displayKeyboard: true,
  displayChord: true,
  displayName: false,
  displayNotation: false,
  displayAltChords: true,
  displayIntervals: false,
  keyboard: defaultKeyboardSettings,
};

export const defaultChordQuizSettings: ChordQuizSettings = {
  mode: 'random' as const,
  difficulty: 0 as const,
  gameLength: 16,
  gamification: true,
  chordNotation: 'short',
  displayName: true,
  displayReaction: true,
  displayIntervals: true,
};

export const defaultCircleOfFifthsSettings: CircleOfFifthsSettings = {
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
};

export const defaultNotationSettings: NotationSettings = {
  key: 'C',
  accidentals: 'flat' as const,
  staffClef: 'both' as const,
  staffTranspose: 0,
};

export const defaults: StoreType = {
  midi: {
    routes: [],
  },
  windowState: {
    x: null,
    y: null,
    width: null,
    height: null,
    maximized: false,
    alwaysOnTop: false,
    changelogDismissed: true,
    updateDismissed: null,
    path: '/',
  },
  settings: {
    general: {
      launchAtStartup: false,
      startMinimized: false,
    },
    chordDisplay: [defaultChordDisplaySettings],
    chordQuiz: defaultChordQuizSettings,
    circleOfFifths: defaultCircleOfFifthsSettings,
    notation: defaultNotationSettings,
    server: {
      enabled: true,
      port: 25011,
    },
  },
};
