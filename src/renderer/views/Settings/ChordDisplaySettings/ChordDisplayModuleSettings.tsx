import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useModuleSettings } from 'renderer/contexts/Settings';

import {
  Container,
  Button,
  Select,
  Switch,
  FormFieldset,
  FormControlLabel,
  Toolbar,
  StackSeparator,
} from '@la-jarre-a-son/ui';

import { Icon, InputColor, InputNote, ScrollContainer } from 'renderer/components';

import { fields } from './utils';

type Props = {
  parentPath: string;
};

const ChordDisplayModuleSettings: React.FC<Props> = ({ parentPath }) => {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const { moduleSettings, updateModuleSetting, resetModuleSettings, deleteModule } =
    useModuleSettings('chordDisplay', moduleId ?? '');

  const handleDeleteModule = () => {
    deleteModule();
    navigate(parentPath);
  };

  return (
    <>
      <ScrollContainer pad="md">
        <Container size="md">
          <FormFieldset label="Chords">
            <FormControlLabel
              label="Display Chord"
              hint="The current chord will be displayed if detected"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('displayChord', value)}
                checked={moduleSettings.displayChord}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Display Alternative Chords"
              hint="A chord can have many names or interpretations"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('displayAltChords', value)}
                checked={moduleSettings.displayAltChords}
              />
            </FormControlLabel>
          </FormFieldset>

          <FormFieldset label="Notation">
            <FormControlLabel
              label="Display Notation"
              hint="Enables the standard notation staff (configure staff in Settings/Music Notation)"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('displayNotation', value)}
                checked={moduleSettings.displayNotation}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Display Notes"
              hint="Displays the notes in the played order"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('displayNotes', value)}
                checked={moduleSettings.displayNotes}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Display Intervals"
              hint="Adds a 12 cells table with the intervals detected in the chord"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('displayIntervals', value)}
                checked={moduleSettings.displayIntervals}
              />
            </FormControlLabel>
          </FormFieldset>

          <FormFieldset label="Keyboard">
            <FormControlLabel
              label="Display Keyboard"
              hint="Adds keyboard with played notes"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('displayKeyboard', value)}
                checked={moduleSettings.displayKeyboard}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Keyboard skin"
              hint="Choose the appearance of the keyboard"
              reverse
            >
              <Select
                value={moduleSettings.skin}
                onChange={(value) => updateModuleSetting('skin', value)}
                options={fields.skin.choices}
              />
            </FormControlLabel>

            <FormControlLabel label="Keyboard Start" hint="First note of keyboard" reverse>
              <InputNote
                onChange={(value) => updateModuleSetting('from', value)}
                value={moduleSettings.from}
                withOctave
                learn
              />
            </FormControlLabel>

            <FormControlLabel label="Keyboard End" hint="Last note of keyboard" reverse>
              <InputNote
                onChange={(value) => updateModuleSetting('to', value)}
                value={moduleSettings.to}
                withOctave
                learn
              />
            </FormControlLabel>

            <FormControlLabel label="Display Key Names" hint="Adds the name of each key" reverse>
              <Switch
                onChange={(value) => updateModuleSetting('displayKeyNames', value)}
                checked={moduleSettings.displayKeyNames}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Display Tonic Dot"
              hint="Adds a dot on the detected chord tonic"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('displayTonic', value)}
                checked={moduleSettings.displayTonic}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Display Chord Degrees"
              hint="Adds the intervals detected in the chord"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('displayDegrees', value)}
                checked={moduleSettings.displayDegrees}
              />
            </FormControlLabel>

            <FormControlLabel label="Color Black Keys" reverse>
              <InputColor
                onChange={(value) => updateModuleSetting('colorNoteBlack', value)}
                value={moduleSettings.colorNoteBlack}
              />
            </FormControlLabel>

            <FormControlLabel label="Color White Keys" reverse>
              <InputColor
                onChange={(value) => updateModuleSetting('colorNoteWhite', value)}
                value={moduleSettings.colorNoteWhite}
              />
            </FormControlLabel>

            <FormControlLabel label="Color Highlight" hint="Color of played keys" reverse>
              <InputColor
                onChange={(value) => updateModuleSetting('colorHighlight', value)}
                value={moduleSettings.colorHighlight}
              />
            </FormControlLabel>
          </FormFieldset>
        </Container>
      </ScrollContainer>
      <Toolbar elevation={2} placement="bottom">
        <Button onClick={() => resetModuleSettings()} intent="neutral">
          <Icon name="reset" />
          Reset to Defaults
        </Button>
        <StackSeparator />
        <Button onClick={handleDeleteModule} intent="neutral">
          <Icon name="trash" />
          Delete
        </Button>
      </Toolbar>
    </>
  );
};

export default ChordDisplayModuleSettings;
