import React from 'react';
import classnames from 'classnames/bind';

import { useSettings } from 'renderer/contexts/Settings';

import {
  Container,
  Button,
  Select,
  Switch,
  FormFieldset,
  FormControlLabel,
  Toolbar,
} from '@la-jarre-a-son/ui';

import { Icon, InputColor, InputNote, ScrollContainer } from 'renderer/components';

import { Settings } from 'main/types/Settings';
import { fields } from './constants';

import styles from './ChordDisplaySettings.module.scss';

const cx = classnames.bind(styles);

type Props = {
  namespace: string;
};

const ChordDisplayNamespaceSettings: React.FC<Props> = ({ namespace }) => {
  const { settings, updateSetting, resetSettings } = useSettings();

  const namespaceSettings = namespace
    ? settings.chordDisplay[namespace as keyof Settings['chordDisplay']]
    : null;

  if (!namespaceSettings) {
    return (
      <div className={cx('base')}>
        <div className={cx('noSettings')}>
          <p>No Settings found, there might be an error with your settings.</p>
          <Button onClick={() => resetSettings('chordDisplay')}>
            <Icon name="trash" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    );
  }

  const updateNamespaceSettings = (setting: string, value: unknown) =>
    updateSetting(`chordDisplay.${namespace}.${setting}`, value);

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
                onChange={(value) => updateNamespaceSettings('displayChord', value)}
                checked={namespaceSettings.displayChord}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Display Alternative Chords"
              hint="A chord can have many names or interpretations"
              reverse
            >
              <Switch
                onChange={(value) => updateNamespaceSettings('displayAltChords', value)}
                checked={namespaceSettings.displayAltChords}
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
                onChange={(value) => updateNamespaceSettings('displayNotation', value)}
                checked={namespaceSettings.displayNotation}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Display Notes"
              hint="Displays the notes in the played order"
              reverse
            >
              <Switch
                onChange={(value) => updateNamespaceSettings('displayNotes', value)}
                checked={namespaceSettings.displayNotes}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Display Intervals"
              hint="Adds a 12 cells table with the intervals detected in the chord"
              reverse
            >
              <Switch
                onChange={(value) => updateNamespaceSettings('displayIntervals', value)}
                checked={namespaceSettings.displayIntervals}
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
                onChange={(value) => updateNamespaceSettings('displayKeyboard', value)}
                checked={namespaceSettings.displayKeyboard}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Keyboard skin"
              hint="Choose the appearance of the keyboard"
              reverse
            >
              <Select
                value={namespaceSettings.skin}
                onChange={(value) => updateNamespaceSettings('skin', value)}
                options={fields.skin.choices}
              />
            </FormControlLabel>

            <FormControlLabel label="Keyboard Start" hint="First note of keyboard" reverse>
              <InputNote
                onChange={(value) => updateNamespaceSettings('from', value)}
                value={namespaceSettings.from}
                withOctave
                learn
              />
            </FormControlLabel>

            <FormControlLabel label="Keyboard End" hint="Last note of keyboard" reverse>
              <InputNote
                onChange={(value) => updateNamespaceSettings('to', value)}
                value={namespaceSettings.to}
                withOctave
                learn
              />
            </FormControlLabel>

            <FormControlLabel label="Display Key Names" hint="Adds the name of each key" reverse>
              <Switch
                onChange={(value) => updateNamespaceSettings('displayKeyNames', value)}
                checked={namespaceSettings.displayKeyNames}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Display Tonic Dot"
              hint="Adds a dot on the detected chord tonic"
              reverse
            >
              <Switch
                onChange={(value) => updateNamespaceSettings('displayTonic', value)}
                checked={namespaceSettings.displayTonic}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Display Chord Degrees"
              hint="Adds the intervals detected in the chord"
              reverse
            >
              <Switch
                onChange={(value) => updateNamespaceSettings('displayDegrees', value)}
                checked={namespaceSettings.displayDegrees}
              />
            </FormControlLabel>

            <FormControlLabel label="Color Black Keys" reverse>
              <InputColor
                onChange={(value) => updateNamespaceSettings('colorNoteBlack', value)}
                value={namespaceSettings.colorNoteBlack}
              />
            </FormControlLabel>

            <FormControlLabel label="Color White Keys" reverse>
              <InputColor
                onChange={(value) => updateNamespaceSettings('colorNoteWhite', value)}
                value={namespaceSettings.colorNoteWhite}
              />
            </FormControlLabel>

            <FormControlLabel label="Color Highlight" hint="Color of played keys" reverse>
              <InputColor
                onChange={(value) => updateNamespaceSettings('colorHighlight', value)}
                value={namespaceSettings.colorHighlight}
              />
            </FormControlLabel>
          </FormFieldset>
        </Container>
      </ScrollContainer>
      <Toolbar elevation={2} placement="bottom">
        <Button onClick={() => resetSettings('chordDisplay')} intent="neutral">
          <Icon name="trash" />
          Reset to Defaults
        </Button>
      </Toolbar>
    </>
  );
};

export default ChordDisplayNamespaceSettings;
