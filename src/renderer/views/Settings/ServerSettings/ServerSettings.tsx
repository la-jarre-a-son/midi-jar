import React from 'react';
import classnames from 'classnames/bind';

import { useSettings } from 'renderer/contexts/Settings';
import { useServerState } from 'renderer/contexts/ServerState';

import FormField from 'renderer/components/FormField';
import Toggle from 'renderer/components/Toggle';
import Input from 'renderer/components/Input';

import styles from './ServerSettings.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

/**
 *  Server settings page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const ServerSettings: React.FC<Props> = ({ className }) => {
  const { settings, updateSetting } = useSettings();
  const { state, enable } = useServerState();

  return (
    <div className={cx('base', className)}>
      <div
        className={cx('state', {
          isStarted: state.started,
          isError: !!state.error,
        })}
      >
        {!state.error &&
          state.started &&
          `Server is currently running on port ${state.port}`}
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
      </div>
      <div className={cx('container')}>
        <section className={cx('group')}>
          <FormField
            fieldId="server_settings:enabled"
            label="Enable HTTP &amp; WS server"
          >
            <Toggle
              id="server_settings:enabled"
              onChange={(value) => enable(!!value)}
              value={settings.server.enabled}
              successIcon="save"
            />
          </FormField>

          <FormField fieldId="server_settings:port" label="Server Port">
            <Input
              id="server_settings:port"
              onChange={(value) => updateSetting('server.port', Number(value))}
              value={settings.server.port ?? null}
              type="number"
            />
          </FormField>
        </section>
      </div>
    </div>
  );
};

ServerSettings.defaultProps = defaultProps;

export default ServerSettings;
