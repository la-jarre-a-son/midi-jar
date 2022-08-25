import React from 'react';
import classnames from 'classnames/bind';

import { defaults } from 'main/settings/schema';
import { useSettings } from 'renderer/contexts/Settings';

import FormField from 'renderer/components/FormField';
import Toggle from 'renderer/components/Toggle';
import InputNote from 'renderer/components/InputNote';

import { fields } from './constants';

import styles from './NotationSettings.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

/**
 *  Music Notation settings page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const NotationSettings: React.FC<Props> = ({ className }) => {
  const { settings, updateSetting } = useSettings();

  return (
    <div className={cx('base', className)}>
      <div className={cx('container')}>
        <FormField fieldId="notation_settings:key" label="Key Signature">
          <InputNote
            id="notation_settings:key"
            onChange={(value: string) => updateSetting('notation.key', value)}
            value={settings?.notation.key ?? defaults.settings.notation.key}
            type="text"
            learn
          />
        </FormField>

        <FormField
          fieldId="notation_settings:accidentals"
          label="Accidentals (in C)"
        >
          <Toggle
            id="notation_settings:accidentals"
            choices={fields.accidentals.choices}
            onChange={(value) => updateSetting('notation.accidentals', value)}
            value={
              settings?.notation.accidentals ??
              defaults.settings.notation.accidentals
            }
            successIcon="save"
            disabled={settings?.notation.key !== 'C'}
          />
        </FormField>
      </div>
    </div>
  );
};

NotationSettings.defaultProps = defaultProps;

export default NotationSettings;
