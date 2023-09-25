import { JSONSchema } from 'json-schema-typed';

import MidiSchema from '../types/Midi.schema.json';
import SettingsSchema from '../types/Settings.schema.json';
import WindowStateSchema from '../types/WindowState.schema.json';

export const schema = {
  midi: MidiSchema as JSONSchema,
  settings: SettingsSchema as JSONSchema,
  windowState: WindowStateSchema as JSONSchema,
};
