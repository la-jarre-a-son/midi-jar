import { JSONSchema } from 'json-schema-typed';

import MidiSchema from '../types/Midi.schema.json';
import SettingsSchema from '../types/Settings.schema.json';
import WindowStateSchema from '../types/WindowState.schema.json';

export type StoreSchema = {
  midi: JSONSchema;
  settings: JSONSchema;
  windowState: JSONSchema;
};

export const schema: StoreSchema = {
  midi: MidiSchema,
  settings: SettingsSchema,
  windowState: WindowStateSchema,
};
