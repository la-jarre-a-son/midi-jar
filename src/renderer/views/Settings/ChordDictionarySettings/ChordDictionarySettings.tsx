import React from 'react';
import {
  Container,
  FormControlLabel,
  FormField,
  ButtonGroup,
  ToggleButton,
  Radio,
  RadioGroup,
  Switch,
  FormFieldset,
  Button,
  Box,
  List,
  ListItem,
  Select,
} from '@la-jarre-a-son/ui';

import { useSettings } from 'renderer/contexts/Settings';
import { Icon } from 'renderer/components';
import { fields } from './constants';

const ChordDictionarySettings: React.FC = () => {
  const { settings, updateSetting } = useSettings();

  const deleteDisabled = (value: string) => {
    const disabledChords = settings.chordDictionary.disabled.filter((c) => c !== value);

    return updateSetting('chordDictionary.disabled', disabledChords);
  };

  const deleteAlias = (value: string) => {
    const aliases = settings.chordDictionary.aliases.filter(([chordType]) => chordType !== value);

    return updateSetting('chordDictionary.aliases', aliases);
  };

  return (
    <Container size="md">
      <FormFieldset label="Browse">
        <FormField
          label="Interactive"
          hint="DETECT: midi input will browse played chord, PLAY: midi input will be displayed"
        >
          <ButtonGroup justify="center">
            <ToggleButton
              onClick={() => updateSetting('chordDictionary.interactive', 'detect')}
              selected={settings.chordDictionary.interactive === 'detect'}
            >
              Detect
            </ToggleButton>
            <ToggleButton
              onClick={() => updateSetting('chordDictionary.interactive', 'play')}
              selected={settings.chordDictionary.interactive === 'play'}
            >
              Play
            </ToggleButton>
          </ButtonGroup>
        </FormField>

        <FormField label="Group chords">
          <RadioGroup
            value={settings.chordDictionary.groupBy}
            name="groupBy"
            onChange={(value) => updateSetting('chordDictionary.groupBy', value)}
          >
            <div>
              <FormControlLabel label="No Group" hint="A single list with all chords">
                <Radio value="none" />
              </FormControlLabel>
              <FormControlLabel
                label="By Quality"
                hint="Simple groups of chord quality (Major, Minor, ...)"
              >
                <Radio value="quality" />
              </FormControlLabel>
              <FormControlLabel label="By Interval" hint="Hierarchical groups of intervals">
                <Radio value="intervals" />
              </FormControlLabel>
            </div>
          </RadioGroup>
        </FormField>

        <FormControlLabel label="Hide disabled chords" reverse>
          <Switch
            onChange={(value) => updateSetting('chordDictionary.hideDisabled', value)}
            checked={settings.chordDictionary.hideDisabled}
          />
        </FormControlLabel>

        <FormControlLabel
          label="Filter chords in key"
          hint="Only chords that are in the current key signature will be displayed"
          reverse
        >
          <Switch
            onChange={(value) => updateSetting('chordDictionary.filterInKey', value)}
            checked={settings.chordDictionary.filterInKey}
          />
        </FormControlLabel>
      </FormFieldset>
      <FormFieldset label="Disabled chords">
        <Box elevation={1}>
          <List>
            {settings.chordDictionary.disabled.map((disabledChord) => (
              <ListItem
                right={
                  <Button
                    intent="neutral"
                    size="sm"
                    icon
                    aria-label="delete"
                    onClick={() => deleteDisabled(disabledChord)}
                  >
                    <Icon name="trash" />
                  </Button>
                }
              >
                {disabledChord}
              </ListItem>
            ))}
            {!settings.chordDictionary.disabled.length && (
              <ListItem disabled>No disabled Chords</ListItem>
            )}
          </List>
        </Box>
      </FormFieldset>
      <FormFieldset label="Preferred notation">
        <FormControlLabel
          label="Default notation"
          hint="Choose the preferred notation chords are displayed in by default"
          reverse
        >
          <Select
            value={settings.chordDictionary.defaultNotation}
            onChange={(value) => updateSetting('chordDictionary.defaultNotation', value)}
            options={fields.defaultNotation.choices}
          />
        </FormControlLabel>
        <Box elevation={1}>
          <List>
            {settings.chordDictionary.aliases.map(([chordType, alias]) => (
              <ListItem
                key={chordType}
                right={
                  <Button
                    intent="neutral"
                    size="sm"
                    icon
                    aria-label="delete"
                    onClick={() => deleteAlias(chordType)}
                  >
                    <Icon name="trash" />
                  </Button>
                }
              >
                <span>{chordType}</span>=&gt;
                <span>{alias}</span>
              </ListItem>
            ))}
            {!Object.keys(settings.chordDictionary.aliases).length && (
              <ListItem disabled>No preferred aliases</ListItem>
            )}
          </List>
        </Box>
      </FormFieldset>
    </Container>
  );
};

export default ChordDictionarySettings;
