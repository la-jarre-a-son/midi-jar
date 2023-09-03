import React from 'react';
import classnames from 'classnames/bind';

import { useSettings } from 'renderer/contexts/Settings';
import { useServerState } from 'renderer/contexts/ServerState';

import { Box, Container, FormControlLabel, Switch, Input, FormFieldset } from '@la-jarre-a-son/ui';

import styles from './GeneralSettings.module.scss';

const cx = classnames.bind(styles);

const GeneralSettings: React.FC = () => {
  const { settings, updateSetting } = useSettings();
  const { state, enable } = useServerState();

  return (
    <>
      <Box
        className={cx('state', {
          isStarted: state.started,
          isError: !!state.error,
        })}
        pad="md"
      >
        {!state.error && state.started && `Server is currently running on port ${state.port}`}
        {!state.error && !state.started && 'Server is currently stopped'}
        {state.error && `Server has errored: ${state.error}`}
        {state.started && !!state.addresses.length && (
          <div className={cx('serverUrlContainer')}>
            {'You can access it through: '}
            {state.addresses.flatMap((address, index) => {
              const url = `http://${address}:${state.port}/`;

              return (
                <React.Fragment key={address}>
                  <a href={url} target="_blank" rel="noreferrer">
                    {address}:{state.port}
                  </a>
                  {index !== state.addresses.length - 1 && ', '}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </Box>
      <Container size="md">
        <FormFieldset label="Startup">
          <FormControlLabel label="Launch At Startup" reverse>
            <Switch
              checked={settings.general.launchAtStartup}
              onChange={(value) => updateSetting('general.launchAtStartup', value)}
            />
          </FormControlLabel>

          <FormControlLabel label="Start Minimized" reverse>
            <Switch
              checked={settings.general.startMinimized}
              onChange={(value) => updateSetting('general.startMinimized', value)}
            />
          </FormControlLabel>
        </FormFieldset>
        <FormFieldset label="Overlay server">
          <FormControlLabel label="Enable HTTP &amp; WS server" reverse>
            <Switch checked={settings.server.enabled} onChange={(value) => enable(!!value)} />
          </FormControlLabel>

          <FormControlLabel label="Server Port" reverse>
            <Input
              type="number"
              onChange={(value) => updateSetting('server.port', Number(value))}
              value={settings.server.port ?? null}
              style={{ width: '64px' }}
            />
          </FormControlLabel>
        </FormFieldset>
      </Container>
    </>
  );
};

export default GeneralSettings;
