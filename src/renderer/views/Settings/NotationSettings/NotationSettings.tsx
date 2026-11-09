import React from 'react';
import { Container, Select, Slider, FormControlLabel, FormField } from '@la-jarre-a-son/ui';

import { useSettings } from 'renderer/contexts/Settings';
import { InputNote } from 'renderer/components';

import { fields } from './constants';

const NotationSettings: React.FC = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <Container size="md">
      <FormControlLabel
        label="Note Naming"
        hint="Choose how note names are spelled throughout the application"
        reverse
      >
        <Select
          options={fields.noteNaming.choices}
          onChange={(value) => updateSetting('notation.noteNaming', value)}
          value={settings.notation.noteNaming}
        />
      </FormControlLabel>
      <FormControlLabel label="Key Signature" reverse>
        <InputNote
          onChange={(value: string) => updateSetting('notation.key', value)}
          value={settings.notation.key}
          type="text"
          learn
        />
      </FormControlLabel>

      <FormControlLabel label="Accidentals (in C)" reverse>
        <Select
          options={fields.accidentals.choices}
          onChange={(value) => updateSetting('notation.accidentals', value)}
          value={settings.notation.accidentals}
          disabled={settings.notation.key !== 'C'}
        />
      </FormControlLabel>

      <FormControlLabel label="Staff Clef" reverse>
        <Select
          options={fields.staffClef.choices}
          onChange={(value) => updateSetting('notation.staffClef', value)}
          value={settings.notation.staffClef}
        />
      </FormControlLabel>

      <FormField
        label="Staff Transpose (in semitones)"
        hint="You can transpose the staff notes: +12 for an octave"
      >
        <Slider
          value={settings.notation.staffTranspose}
          onChange={(value: number) => updateSetting('notation.staffTranspose', value)}
          min={-24}
          max={24}
          step={1}
          marks={[-24, -12, 0, 12, 24]}
          valueText={`${settings.notation.staffTranspose.toFixed()} st`}
        />
      </FormField>
    </Container>
  );
};

export default NotationSettings;
