import React from 'react';
import classnames from 'classnames/bind';

import { useSettings } from 'renderer/contexts/Settings';

import FormField from 'renderer/components/FormField';
import Toggle from 'renderer/components/Toggle';

import styles from './GeneralSettings.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

/**
 *  General settings page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const GeneralSettings: React.FC<Props> = ({ className }) => {
  const { settings, updateSetting } = useSettings();

  return (
    <div className={cx('base', className)}>
      <div className={cx('container')}>
        <FormField
          fieldId="general_settings:launchAtStartup"
          label="Launch At Startup"
        >
          <Toggle
            id="general_settings:launchAtStartup"
            onChange={(value) =>
              updateSetting('general.launchAtStartup', value)
            }
            value={settings?.general?.launchAtStartup}
            successIcon="save"
          />
        </FormField>

        <FormField fieldId="general_settings:port" label="Start Minimized">
          <Toggle
            id="general_settings:startMinimized"
            onChange={(value) => updateSetting('general.startMinimized', value)}
            value={settings?.general?.startMinimized}
            successIcon="save"
          />
        </FormField>
      </div>
    </div>
  );
};

GeneralSettings.defaultProps = defaultProps;

export default GeneralSettings;
