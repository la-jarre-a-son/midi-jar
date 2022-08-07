import { MidiRouteRaw } from './MidiRoute';

export type ChordDisplaySettings = {
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

export type ServerSettings = {
  enabled: boolean;
  port: number;
};

export type Settings = {
  general: {
    launchAtStartup: boolean;
    startMinimized: boolean;
  };
  chordDisplay: {
    internal: ChordDisplaySettings;
    overlay?: ChordDisplaySettings;
  };
  server: ServerSettings;
};

export type StoreType = {
  midi: {
    routes: MidiRouteRaw[];
  };
  settings: Settings;
};
