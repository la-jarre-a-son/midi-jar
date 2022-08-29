import React from 'react';
import classnames from 'classnames/bind';
import { defaults } from 'main/settings/schema';

import { useSettings } from 'renderer/contexts/Settings';

import Toolbar from 'renderer/components/Toolbar';
import Button from 'renderer/components/Button';
import Icon from 'renderer/components/Icon';
import FormField from 'renderer/components/FormField';
import Toggle from 'renderer/components/Toggle';

import { fields } from './constants';

import styles from './CircleOfFifthsSettings.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

/**
 *  CircleOfFifths settings page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const CircleOfFifthsSettings: React.FC<Props> = ({ className }) => {
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <div className={cx('base', className)}>
      <div className={cx('container')}>
        <div className={cx('group')}>
          <FormField
            fieldId="circle_of_fifths_settings:display-major"
            label="Display Major"
            hint="Enables the Majoy keys section of the circle"
          >
            <Toggle
              id="circle_of_fifths_settings:display-major"
              onChange={(value) =>
                updateSetting('circleOfFifths.displayMajor', value)
              }
              value={
                settings?.circleOfFifths?.displayMajor ??
                defaults.settings.circleOfFifths.displayMajor
              }
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="circle_of_fifths_settings:display-minor"
            label="Display Minor"
            hint="Enables the Minor keys section of the circle"
          >
            <Toggle
              id="circle_of_fifths_settings:display-minor"
              onChange={(value) =>
                updateSetting('circleOfFifths.displayMinor', value)
              }
              value={
                settings?.circleOfFifths?.displayMinor ??
                defaults.settings.circleOfFifths.displayMinor
              }
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="circle_of_fifths_settings:order"
            label="Main scale"
            hint="Choose what scale to put first (only if both major and minor are displayed)"
          >
            <Toggle
              id="circle_of_fifths_settings:scale"
              choices={fields.scale.choices}
              onChange={(value) => updateSetting('circleOfFifths.scale', value)}
              value={
                settings?.circleOfFifths?.scale ??
                defaults.settings.circleOfFifths.scale
              }
              disabled={
                !(
                  settings?.circleOfFifths?.displayMajor &&
                  settings?.circleOfFifths?.displayMinor
                )
              }
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="circle_of_fifths_settings:display-diminished"
            label="Display Diminished"
            hint="Enables the Diminished chords section of the circle"
          >
            <Toggle
              id="circle_of_fifths_settings:display-diminished"
              onChange={(value) =>
                updateSetting('circleOfFifths.displayDiminished', value)
              }
              value={
                settings?.circleOfFifths?.displayDiminished ??
                defaults.settings.circleOfFifths.displayDiminished
              }
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="circle_of_fifths_settings:display-dominants"
            label="Display Dominant Chords"
            hint="Adds a section in the circle with dominant chords: V7, bVII7, bII7, and III7"
          >
            <Toggle
              id="circle_of_fifths_settings:display-dominants"
              onChange={(value) =>
                updateSetting('circleOfFifths.displayDominants', value)
              }
              value={
                settings?.circleOfFifths?.displayDominants ??
                defaults.settings.circleOfFifths.displayDominants
              }
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="circle_of_fifths_settings:display-suspended"
            label="Display Suspended Chords"
            hint="Adds suspended chords between associated keys"
          >
            <Toggle
              id="circle_of_fifths_settings:display-suspended"
              onChange={(value) =>
                updateSetting('circleOfFifths.displaySuspended', value)
              }
              value={
                settings?.circleOfFifths?.displaySuspended ??
                defaults.settings.circleOfFifths.displaySuspended
              }
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="circle_of_fifths_settings:display-alterations"
            label="Display Alterations"
            hint="Adds the Key signature alterations"
          >
            <Toggle
              id="circle_of_fifths_settings:display-alterations"
              onChange={(value) =>
                updateSetting('circleOfFifths.displayAlterations', value)
              }
              value={
                settings?.circleOfFifths?.displayAlterations ??
                defaults.settings.circleOfFifths.displayAlterations
              }
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="circle_of_fifths_settings:display-modes"
            label="Display Modes"
            hint="Adds markers for each enharmonic mode in the underlying key"
          >
            <Toggle
              id="circle_of_fifths_settings:display-modes"
              onChange={(value) =>
                updateSetting('circleOfFifths.displayModes', value)
              }
              value={
                settings?.circleOfFifths?.displayModes ??
                defaults.settings.circleOfFifths.displayModes
              }
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="circle_of_fifths_settings:display-degrees"
            label="Display Degrees"
            hint="Adds a section above each key with its degree name"
          >
            <Toggle
              id="circle_of_fifths_settings:display-degrees"
              onChange={(value) =>
                updateSetting('circleOfFifths.displayDegrees', value)
              }
              value={
                settings?.circleOfFifths?.displayDegrees ??
                defaults.settings.circleOfFifths.displayDegrees
              }
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="circle_of_fifths_settings:display-degreeLabels"
            label="Display Degrees Labels"
            hint="Adds the degree names in the selected key. Left is in major key, right is in minor key"
          >
            <Toggle
              id="circle_of_fifths_settings:display-degreeLabels"
              onChange={(value) =>
                updateSetting('circleOfFifths.displayDegreeLabels', value)
              }
              value={
                settings?.circleOfFifths?.displayDegreeLabels ??
                defaults.settings.circleOfFifths.displayDegreeLabels
              }
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="circle_of_fifths_settings:highlight-sector"
            label="Hightlight Sectors"
            hint="Enables sectors of the circle to be shown when played on chords or on notes"
          >
            <Toggle
              id="circle_of_fifths_settings:highlightSector"
              choices={fields.highlightSector.choices}
              onChange={(value) =>
                updateSetting('circleOfFifths.highlightSector', value)
              }
              value={
                settings?.circleOfFifths?.highlightSector ??
                defaults.settings.circleOfFifths.highlightSector
              }
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="circle_of_fifths_settings:highlightInScale"
            label="Highlight sectors in the key"
            hint="Shows differently the sectors in the current key scale"
          >
            <Toggle
              id="circle_of_fifths_settings:highlight-in-scale"
              onChange={(value) =>
                updateSetting('circleOfFifths.highlightInScale', value)
              }
              value={
                settings?.circleOfFifths?.highlightInScale ??
                defaults.settings.circleOfFifths.highlightInScale
              }
              successIcon="save"
            />
          </FormField>
        </div>
      </div>
      <Toolbar bottom>
        <Button onClick={() => resetSettings('circleOfFifths')}>
          <Icon name="trash" />
          Reset to Defaults
        </Button>
      </Toolbar>
    </div>
  );
};

CircleOfFifthsSettings.defaultProps = defaultProps;

export default CircleOfFifthsSettings;
