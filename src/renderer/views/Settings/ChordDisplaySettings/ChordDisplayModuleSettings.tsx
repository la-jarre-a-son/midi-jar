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
  Slider,
  FormField,
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

            <FormControlLabel
              label="Display Chord Name"
              hint="Display the name of chord in full text"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('displayName', value)}
                checked={moduleSettings.displayName}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Chord Notation"
              hint="Choose the notation chords are displayed in"
              reverse
            >
              <Select
                value={moduleSettings.chordNotation}
                onChange={(value) => updateModuleSetting('chordNotation', value)}
                options={fields.chordNotation.choices}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Highlight Chord Alterations"
              hint="Displays chord parts more clearly to ease reading"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('highlightAlterations', value)}
                checked={moduleSettings.highlightAlterations}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Allow omissions"
              hint="Detects chords with omitted intervals"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('allowOmissions', value)}
                checked={moduleSettings.allowOmissions}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Use sustain pedal"
              hint="Detects chords including sustained notes"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('useSustain', value)}
                checked={moduleSettings.useSustain}
              />
            </FormControlLabel>
          </FormFieldset>

          <FormFieldset label="Additional Info">
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

            <FormControlLabel label="Note Start" hint="First note of keyboard" reverse>
              <InputNote
                onChange={(value) => updateModuleSetting('keyboard.from', value)}
                value={moduleSettings.keyboard.from}
                withOctave
                learn
              />
            </FormControlLabel>

            <FormControlLabel label="Note End" hint="Last note of keyboard" reverse>
              <InputNote
                onChange={(value) => updateModuleSetting('keyboard.to', value)}
                value={moduleSettings.keyboard.to}
                withOctave
                learn
              />
            </FormControlLabel>

            <FormControlLabel
              label="Wrap Keyboard"
              hint="Map notes outside of keyboard to closest octave"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('keyboard.wrap', value)}
                checked={moduleSettings.keyboard.wrap}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Display Sustained Notes"
              hint="Display notes still sustained (if use sustain is enabled)"
              reverse
            >
              <Switch
                onChange={(value) => updateModuleSetting('keyboard.displaySustained', value)}
                checked={moduleSettings.keyboard.displaySustained}
              />
            </FormControlLabel>

            <FormControlLabel label="Key Names" hint="Choose what names to display on keys" reverse>
              <Select
                value={moduleSettings.keyboard.keyName}
                onChange={(value) => updateModuleSetting('keyboard.keyName', value)}
                options={fields.keyboard.keyName.choices}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Played Key Info"
              hint="Choose what played info to display on keys"
              reverse
            >
              <Select
                value={moduleSettings.keyboard.keyInfo}
                onChange={(value) => updateModuleSetting('keyboard.keyInfo', value)}
                options={fields.keyboard.keyInfo.choices}
              />
            </FormControlLabel>

            <FormControlLabel
              label="Played Key Label"
              hint="Choose what played info to display above keys"
              reverse
            >
              <Select
                value={moduleSettings.keyboard.label}
                onChange={(value) => updateModuleSetting('keyboard.label', value)}
                options={fields.keyboard.label.choices}
              />
            </FormControlLabel>

            <FormField label="Fade out duration" hint="Played keys will fade out when released">
              <Slider
                value={moduleSettings.keyboard.fadeOutDuration}
                onChange={(value: number) => updateModuleSetting('keyboard.fadeOutDuration', value)}
                min={0}
                max={1}
                step={0.1}
                valueText={`${moduleSettings.keyboard.fadeOutDuration.toFixed(1)}s`}
              />
            </FormField>
          </FormFieldset>

          <FormFieldset label="Keyboard Skin">
            <FormControlLabel label="Skin" hint="Choose the appearance of the keyboard" reverse>
              <Select
                value={moduleSettings.keyboard.skin}
                onChange={(value) => updateModuleSetting('keyboard.skin', value)}
                options={fields.keyboard.skin.choices}
              />
            </FormControlLabel>

            <FormField label="Text Opacity" hint="Factor of the black keys width">
              <Slider
                value={moduleSettings.keyboard.textOpacity}
                onChange={(value: number) => updateModuleSetting('keyboard.textOpacity', value)}
                min={0}
                max={1}
                step={0.1}
                valueText={`${moduleSettings.keyboard.textOpacity}`}
              />
            </FormField>

            <FormField label="Key Height" hint="Factor of the black keys width">
              <Slider
                value={moduleSettings.keyboard.sizes.height}
                onChange={(value: number) => updateModuleSetting('keyboard.sizes.height', value)}
                min={1}
                max={8}
                step={0.1}
                valueText={`${moduleSettings.keyboard.sizes.height}`}
              />
            </FormField>

            {moduleSettings.keyboard.skin === 'classic' && (
              <FormField label="Black Key Ratio" hint="Percentage of white keys height">
                <Slider
                  value={moduleSettings.keyboard.sizes.ratio}
                  onChange={(value: number) => updateModuleSetting('keyboard.sizes.ratio', value)}
                  min={0.1}
                  max={0.9}
                  step={0.05}
                  valueText={`${Math.round(moduleSettings.keyboard.sizes.ratio * 100)}%`}
                />
              </FormField>
            )}
            {moduleSettings.keyboard.skin === 'classic' && (
              <FormField label="Key Border Radius">
                <Slider
                  value={moduleSettings.keyboard.sizes.radius}
                  onChange={(value: number) => updateModuleSetting('keyboard.sizes.radius', value)}
                  min={0}
                  max={1}
                  step={0.05}
                  valueText={`${Math.round(moduleSettings.keyboard.sizes.radius * 100)}%`}
                />
              </FormField>
            )}
            {moduleSettings.keyboard.skin === 'classic' && (
              <FormControlLabel label="Key Bevel" hint="Adds a bevel gradient to keys" reverse>
                <Switch
                  onChange={(value) => updateModuleSetting('keyboard.sizes.bevel', value)}
                  checked={moduleSettings.keyboard.sizes.bevel}
                />
              </FormControlLabel>
            )}
          </FormFieldset>

          <FormFieldset label="Keyboard Colors">
            <FormControlLabel label="Black Keys" reverse>
              <InputColor
                onChange={(value) => updateModuleSetting('keyboard.colors.black', value)}
                value={moduleSettings.keyboard.colors.black}
              />
            </FormControlLabel>

            <FormControlLabel label="White Keys" reverse>
              <InputColor
                onChange={(value) => updateModuleSetting('keyboard.colors.white', value)}
                value={moduleSettings.keyboard.colors.white}
              />
            </FormControlLabel>

            <FormControlLabel label="Played Keys" reverse>
              <InputColor
                onChange={(value) => updateModuleSetting('keyboard.colors.played', value)}
                value={moduleSettings.keyboard.colors.played}
              />
            </FormControlLabel>

            <FormControlLabel label="Wrapped Keys" reverse>
              <InputColor
                onChange={(value) => updateModuleSetting('keyboard.colors.wrapped', value)}
                value={moduleSettings.keyboard.colors.wrapped}
              />
            </FormControlLabel>

            <FormControlLabel label="Sustained Keys" reverse>
              <InputColor
                onChange={(value) => updateModuleSetting('keyboard.colors.sustained', value)}
                value={moduleSettings.keyboard.colors.sustained}
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
