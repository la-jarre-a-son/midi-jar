import { Migrations } from 'conf/dist/source/types';
import { StoreType } from '../types/Settings';

const migrations: Migrations<StoreType> = {
  '1.0.0': (store) => {
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
  '1.1.0': (store) => {
    store.set('version', '1.1.0');
    store.set('settings.chordDisplay.internal.key', 'C');
    store.set('settings.chordDisplay.overlay.key', 'C');
  },
  '1.2.0': (store) => {
    store.set('version', '1.2.0');

    const settings = store.get('settings');

    settings.notation = {
      key: settings.chordDisplay.internal.key || 'C',
      accidentals: settings.chordDisplay.internal.accidentals || 'flat',
      staffClef: 'both',
      staffTranspose: 0,
    };

    delete settings.chordDisplay.internal.key;
    delete settings.chordDisplay.internal.accidentals;

    settings.circleOfFifths = {
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

    store.set('settings', settings);
  },
  '1.3.0': (store) => {
    store.set('version', '1.3.0');

    const settings = store.get('settings');

    settings.chordQuiz = {
      mode: 'random' as const,
      difficulty: 0,
      gameLength: 16,
      gamification: true,
      displayReaction: true,
      displayIntervals: true,
    };

    store.set('settings', settings);
  },
};

export default migrations;
