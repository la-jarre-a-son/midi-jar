import { defaults } from 'main/store/defaults';
import { ChordDisplaySettings } from 'main/types';

export class FieldError extends Error {
  fields: Record<string, string>;

  constructor(fields: Record<string, string>) {
    super('One or more fields contains errors');
    this.fields = fields;
  }
}

export const fields = {
  skin: {
    choices: [
      {
        value: 'classic',
        label: 'Classic',
      },
      {
        value: 'flat',
        label: 'Flat',
      },
    ],
  },
  chordNotation: {
    choices: [
      {
        value: 'long',
        label: 'Long (min, maj, dom, aug, dim...)',
      },
      {
        value: 'short',
        label: 'Short (m, M, aug, dim...)',
      },
      {
        value: 'symbol',
        label: 'Symbol (-, Δ, +, °...)',
      },
    ],
  },
};

export const transformModuleName = (name: string) => {
  return name
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
};

export function addModule(
  name: string,
  chordDisplay: ChordDisplaySettings[],
  settings: ChordDisplaySettings = defaults.settings.chordDisplay[0]
) {
  const id = transformModuleName(name);

  if (!id) {
    throw new FieldError({ name: 'Cannot be empty' });
  }

  if (chordDisplay.find((module) => module.id === id)) {
    throw new FieldError({ name: 'Already exists' });
  }

  const moduleSettings = { ...settings, id };

  return [...chordDisplay, moduleSettings];
}
