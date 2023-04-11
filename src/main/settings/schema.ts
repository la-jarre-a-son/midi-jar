import { JSONSchema as TypedJSONSchema } from 'json-schema-typed';
import { StoreType } from '../types/Settings';

export declare type Schema<T> = {
  [Property in keyof T]: TypedJSONSchema;
};

export const schema: Schema<StoreType> = {
  midi: {
    type: 'object',
    properties: {
      routes: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            input: { type: 'string' },
            output: { type: 'string' },
            type: {
              type: 'string',
              enum: ['physical', 'internal', 'websocket'],
            },
            enabled: { type: 'boolean' },
          },
        },
      },
    },
  },
  settings: {
    type: 'object',
    properties: {
      general: {
        type: 'object',
        properties: {
          launchAtStartup: { type: 'boolean' },
          startMinimized: { type: 'boolean' },
        },
      },
      chordDisplay: {
        type: 'object',
        properties: {
          '^internal|overlay$': {
            type: 'object',
            properties: {
              useInternal: { type: 'boolean' },
              skin: { type: 'string', enum: ['classic', 'flat'] },
              from: { type: 'string' },
              to: { type: 'string' },
              displayKeyboard: { type: 'boolean' },
              displayNotes: { type: 'boolean' },
              displayChord: { type: 'boolean' },
              displayNotation: { type: 'boolean' },
              displayAltChords: { type: 'boolean' },
              displayTonic: { type: 'boolean' },
              displayDegrees: { type: 'boolean' },
              displayKeyNames: { type: 'boolean' },
              colorHighlight: { type: ['string', 'null'] },
              colorNoteWhite: { type: ['string', 'null'] },
              colorNoteBlack: { type: ['string', 'null'] },
            },
          },
        },
      },
      chordQuiz: {
        type: 'object',
        properties: {
          mode: { type: 'string', enum: ['random'] },
        },
      },
      circleOfFifths: {
        type: 'object',
        properties: {
          scale: { type: 'string', enum: ['major', 'minor'] },
          highlightSector: { type: 'string', enum: ['chord', 'notes'] },
          highlightInScale: { type: 'boolean' },
          displayMajor: { type: 'boolean' },
          displayMinor: { type: 'boolean' },
          displayDiminished: { type: 'boolean' },
          displayDominants: { type: 'boolean' },
          displayAlterations: { type: 'boolean' },
          displaySuspended: { type: 'boolean' },
          displayModes: { type: 'boolean' },
          displayDegrees: { type: 'boolean' },
          displayDegreeLabels: { type: 'boolean' },
        },
      },
      notation: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          accidentals: { type: 'string', enum: ['flat', 'sharp'] },
          staffClef: { type: 'string', enum: ['both', 'bass', 'treble'] },
          staffTranspose: { type: 'number' },
        },
      },
      server: {
        type: 'object',
        properties: {
          enabled: { type: 'boolean' },
          port: { type: 'number' },
        },
      },
    },
  },
};

const defaultChordDisplaySettings = {
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
  colorHighlight: '#315bce',
  colorNoteWhite: '#ffffff',
  colorNoteBlack: '#000000',
};

const defaultChordQuizSettings = {
  mode: 'random' as const,
};

const defaultCircleOfFifthsSettings = {
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

const defaultNotationSettings = {
  key: 'C',
  accidentals: 'flat' as const,
  staffClef: 'both' as const,
  staffTranspose: 0,
};

export const defaults = {
  midi: {
    routes: [],
  },
  settings: {
    general: {
      launchAtStartup: false,
      startMinimized: false,
    },
    chordDisplay: {
      internal: { useInternal: false, ...defaultChordDisplaySettings },
      overlay: { useInternal: true, ...defaultChordDisplaySettings },
    },

    chordQuiz: defaultChordQuizSettings,
    circleOfFifths: defaultCircleOfFifthsSettings,
    notation: defaultNotationSettings,
    server: {
      enabled: true,
      port: 25011,
    },
  },
};
