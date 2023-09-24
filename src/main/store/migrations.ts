/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Migrations } from 'conf/dist/source/types';
import Conf from 'conf';
import {
  ChordQuizSettings,
  CircleOfFifthsSettings,
  NotationSettings,
  ServerSettings,
} from 'main/types';
import { MidiRouteRaw } from '../midi/MidiRoute';
import { StoreType } from '../types/Store';

type v1_1_0_ChordDisplaySettings = {
  useInternal: boolean;
  skin: 'classic' | 'flat';
  from: string;
  to: string;
  key: string;
  accidentals: 'flat' | 'sharp';
  displayKeyboard: boolean;
  displayNotes: boolean;
  displayChord: boolean;
  displayNotation: boolean;
  displayAltChords: boolean;
  displayTonic: boolean;
  displayDegrees: boolean;
  displayKeyNames: boolean;
  colorHighlight: string | null;
  colorNoteWhite: string | null;
  colorNoteBlack: string | null;
};

type v1_1_0_Settings = {
  chordDisplay: {
    internal: v1_1_0_ChordDisplaySettings;
    overlay: v1_1_0_ChordDisplaySettings;
  };
  general: {
    launchAtStartup: boolean;
    startMinimized: boolean;
  };
  notation: NotationSettings;
  server: ServerSettings;
};

type v1_2_0_ChordDisplaySettings = {
  useInternal: boolean;
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
  colorHighlight: string | null;
  colorNoteWhite: string | null;
  colorNoteBlack: string | null;
};

type v1_2_0_Settings = {
  chordDisplay: {
    internal: v1_2_0_ChordDisplaySettings;
    overlay: v1_2_0_ChordDisplaySettings;
  };
  circleOfFifths: CircleOfFifthsSettings;
  notation: NotationSettings;
  server: ServerSettings;
};

type v1_3_0_Settings = v1_2_0_Settings & {
  chordQuiz: ChordQuizSettings;
};

type v1_3_0_MidiRouteRaw = {
  input: string;
  output: string;
  type: 'physical' | 'internal' | 'websocket';
  enabled: boolean;
};

const migrations: Migrations<StoreType> = {
  '1.0.0': (store: Conf<StoreType>) => {
    store.set('version', '1.0.0');
    store.set('settings.chordDisplay', {
      internal: {
        skin: 'classic',
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
      },
      overlay: {
        useInternal: true,
        skin: 'classic',
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
      },
    });
  },
  '1.1.0': (store: Conf<StoreType>) => {
    store.set('version', '1.1.0');
    store.set('settings.chordDisplay.internal.key', 'C');
    store.set('settings.chordDisplay.overlay.key', 'C');
  },
  '1.2.0': (store: Conf<StoreType>) => {
    store.set('version', '1.2.0');

    const settings = store.get('settings') as unknown as v1_1_0_Settings;

    // @ts-ignore
    delete settings.chordDisplay.internal.key;
    // @ts-ignore
    delete settings.chordDisplay.internal.accidentals;

    const newSettings: v1_2_0_Settings = {
      notation: {
        key: settings.chordDisplay.internal.key || 'C',
        accidentals: settings.chordDisplay.internal.accidentals || 'flat',
        staffClef: 'both',
        staffTranspose: 0,
      },
      chordDisplay: {
        internal: settings.chordDisplay.internal,
        overlay: settings.chordDisplay.overlay,
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
      server: settings.server,
    };

    store.set('settings', newSettings);
  },
  '1.3.0': (store: Conf<StoreType>) => {
    store.set('version', '1.3.0');
    store.set('settings.chordDisplay.internal.displayIntervals', false);
    store.set('settings.chordDisplay.overlay.displayIntervals', false);

    const settings = store.get('settings') as unknown as v1_2_0_Settings;

    const newSettings: v1_3_0_Settings = {
      ...settings,
      chordQuiz: {
        mode: 'random' as const,
        difficulty: 0,
        gameLength: 16,
        gamification: true,
        displayReaction: true,
        displayIntervals: true,
      },
    };

    store.set('settings', newSettings);
  },
  '1.3.1': (store: Conf<StoreType>) => {
    const routes = store.get('midi.routes', []) as unknown as v1_3_0_MidiRouteRaw[];

    const newRoutes = routes.map((r: v1_3_0_MidiRouteRaw): MidiRouteRaw => {
      if (r.type === 'websocket' && r.output === 'chord-display') {
        return { ...r, type: 'internal', output: 'chord-display/overlay' };
      }
      if (r.type === 'internal' && r.output === 'chord-display') {
        return { ...r, type: 'internal', output: 'chord-display/internal' };
      }

      return r as MidiRouteRaw;
    });

    store.set('version', '1.3.1');

    store.set('midi.routes', newRoutes);
  },
  '1.4.0': (store: Conf<StoreType>) => {
    const oldChordDisplaySettings = store.get('settings.chordDisplay', undefined) as unknown as
      | undefined
      | {
          internal: v1_2_0_ChordDisplaySettings;
          overlay: v1_2_0_ChordDisplaySettings;
        };

    if (!oldChordDisplaySettings) {
      store.set('settings.chordDisplay', [
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
      ]);
    } else {
      // @ts-ignore
      delete oldChordDisplaySettings.internal.useInternal;
      // @ts-ignore
      delete oldChordDisplaySettings.overlay.useInternal;

      store.set('settings.chordDisplay', [
        {
          id: 'internal',
          ...oldChordDisplaySettings.internal,
        },
        {
          id: 'overlay',
          ...oldChordDisplaySettings.overlay,
        },
      ]);
    }
  },
};

export default migrations;
