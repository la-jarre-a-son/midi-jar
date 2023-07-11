import { JSONSchema } from 'json-schema-typed';

import MidiSchema from '../types/Midi.schema.json';
import SettingsSchema from '../types/Settings.schema.json';

export type StoreSchema = {
  midi: JSONSchema;
  settings: JSONSchema;
};

export const schema: StoreSchema = {
  midi: MidiSchema,
  settings: SettingsSchema,
};
