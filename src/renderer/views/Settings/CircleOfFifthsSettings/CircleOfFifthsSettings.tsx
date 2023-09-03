import React from 'react';
import {
  Button,
  Container,
  Switch,
  FormField,
  FormControlLabel,
  Select,
  Toolbar,
} from '@la-jarre-a-son/ui';

import { useSettings } from 'renderer/contexts/Settings';

import { Icon, ScrollContainer } from 'renderer/components';

import { fields } from './constants';

const CircleOfFifthsSettings: React.FC = () => {
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <>
      <ScrollContainer pad="md">
        <Container size="md">
          <FormControlLabel
            label="Display Major"
            hint="Enables the Majoy keys section of the circle"
            reverse
          >
            <Switch
              onChange={(value) => updateSetting('circleOfFifths.displayMajor', value)}
              checked={settings.circleOfFifths.displayMajor}
            />
          </FormControlLabel>

          <FormControlLabel
            label="Display Minor"
            hint="Enables the Minor keys section of the circle"
            reverse
          >
            <Switch
              onChange={(value) => updateSetting('circleOfFifths.displayMinor', value)}
              checked={settings.circleOfFifths.displayMinor}
            />
          </FormControlLabel>

          <FormField
            label="Main scale"
            hint="Choose what scale to put first (only if both major and minor are displayed)"
          >
            <Select
              options={fields.scale.choices}
              onChange={(value) => updateSetting('circleOfFifths.scale', value)}
              value={settings.circleOfFifths.scale}
              disabled={
                !(settings.circleOfFifths.displayMajor && settings.circleOfFifths.displayMinor)
              }
            />
          </FormField>

          <FormControlLabel
            label="Display Diminished"
            hint="Enables the Diminished chords section of the circle"
            reverse
          >
            <Switch
              onChange={(value) => updateSetting('circleOfFifths.displayDiminished', value)}
              checked={settings.circleOfFifths.displayDiminished}
            />
          </FormControlLabel>

          <FormControlLabel
            label="Display Dominant Chords"
            hint="Adds a section in the circle with dominant chords: V7, bVII7, bII7, and III7"
            reverse
          >
            <Switch
              onChange={(value) => updateSetting('circleOfFifths.displayDominants', value)}
              checked={settings.circleOfFifths.displayDominants}
            />
          </FormControlLabel>

          <FormControlLabel
            label="Display Suspended Chords"
            hint="Adds suspended chords between associated keys"
            reverse
          >
            <Switch
              onChange={(value) => updateSetting('circleOfFifths.displaySuspended', value)}
              checked={settings.circleOfFifths.displaySuspended}
            />
          </FormControlLabel>

          <FormControlLabel
            label="Display Alterations"
            hint="Adds the Key signature alterations"
            reverse
          >
            <Switch
              onChange={(value) => updateSetting('circleOfFifths.displayAlterations', value)}
              checked={settings.circleOfFifths.displayAlterations}
            />
          </FormControlLabel>

          <FormControlLabel
            label="Display Modes"
            hint="Adds markers for each enharmonic mode in the underlying key"
            reverse
          >
            <Switch
              onChange={(value) => updateSetting('circleOfFifths.displayModes', value)}
              checked={settings.circleOfFifths.displayModes}
            />
          </FormControlLabel>

          <FormControlLabel
            label="Display Degrees"
            hint="Adds a section above each key with its degree name"
            reverse
          >
            <Switch
              onChange={(value) => updateSetting('circleOfFifths.displayDegrees', value)}
              checked={settings.circleOfFifths.displayDegrees}
            />
          </FormControlLabel>

          <FormControlLabel
            label="Display Degrees Labels"
            hint="Adds the degree names in the selected key. Left is in major key, right is in minor key"
            reverse
          >
            <Switch
              onChange={(value) => updateSetting('circleOfFifths.displayDegreeLabels', value)}
              checked={settings.circleOfFifths.displayDegreeLabels}
            />
          </FormControlLabel>

          <FormField
            label="Hightlight Sectors"
            hint="Enables sectors of the circle to be shown when played on chords or on notes"
          >
            <Select
              options={fields.highlightSector.choices}
              onChange={(value) => updateSetting('circleOfFifths.highlightSector', value)}
              value={settings.circleOfFifths.highlightSector}
            />
          </FormField>

          <FormControlLabel
            label="Highlight sectors in the key"
            hint="Shows differently the sectors in the current key scale"
            reverse
          >
            <Switch
              onChange={(value) => updateSetting('circleOfFifths.highlightInScale', value)}
              checked={settings.circleOfFifths.highlightInScale}
            />
          </FormControlLabel>
        </Container>
      </ScrollContainer>
      <Toolbar elevation={2} placement="bottom">
        <Button onClick={() => resetSettings('circleOfFifths')} intent="neutral">
          <Icon name="trash" />
          Reset to Defaults
        </Button>
      </Toolbar>
    </>
  );
};

export default CircleOfFifthsSettings;
