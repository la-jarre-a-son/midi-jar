import makeDebug from 'debug';
import { onSettingsChange, getSettings } from './settings';

import { registerHandler, broadcast } from './websockets';
import { Settings } from './types/Settings';

const debug = makeDebug('app:ws:api');

registerHandler('settings:get', (namespace, payload, reply) => {
  debug('received settings:get');
  const settings = getSettings();
  reply('settings:get', settings);
});

export function registerWebsocketSubscriptions() {
  debug('registerWebsocketSubscriptions');
  onSettingsChange((settings?: Settings) => {
    if (settings) {
      broadcast(['settings'], 'settings:update', settings);
    }
  });
}
