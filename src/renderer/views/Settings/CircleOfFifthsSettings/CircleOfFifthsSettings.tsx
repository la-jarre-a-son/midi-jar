import React from 'react';
import classnames from 'classnames/bind';
import { defaults } from 'main/settings/schema';

import { useSettings } from 'renderer/contexts/Settings';

import Toolbar from 'renderer/components/Toolbar';
import Button from 'renderer/components/Button';
import Icon from 'renderer/components/Icon';
import FormField from 'renderer/components/FormField';
import Toggle from 'renderer/components/Toggle';

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
            fieldId="circle_of_fifths_settings:display-diminished"
            label="Display Diminished"
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
            fieldId="circle_of_fifths_settings:display-alt"
            label="Display Alterations"
          >
            <Toggle
              id="circle_of_fifths_settings:display-alt"
              onChange={(value) =>
                updateSetting('circleOfFifths.displayAlt', value)
              }
              value={
                settings?.circleOfFifths?.displayAlt ??
                defaults.settings.circleOfFifths.displayAlt
              }
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="circle_of_fifths_settings:display-dominants"
            label="Display Dominant Chords"
            hint="This will add a section in the circle with: V7, bVII7, bII7, and III7"
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
            fieldId="circle_of_fifths_settings:display-degrees"
            label="Display Degrees"
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
