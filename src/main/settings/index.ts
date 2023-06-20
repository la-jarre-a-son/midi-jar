import Store from 'electron-store';
import { app } from 'electron';

import { MidiRoute, MidiRouteRaw } from '../types/MidiRoute';

import { StoreType, Settings } from '../types/Settings';
import { schema, defaults } from './schema';
import migrations from './migrations';

import { version } from '../../../package.json';

const store = new Store<StoreType>({
  schema,
  defaults,
  migrations,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: Electron Store supports projectVersion but it's not typed
  projectVersion: version,
});

export function getMidiRoutes(): MidiRoute[] {
  return ((store.get('midi.routes') as MidiRouteRaw[]) || []).map((route) =>
    MidiRoute.fromStore(route)
  );
}

export function setMidiRoutes(routes: MidiRoute[]) {
  store.set(
    'midi.routes',
    routes.map((route) => route.toStore())
  );
}

export function getSettings(): Settings {
  return store.get('settings');
}

export function updateSettings(settings: Settings) {
  store.set('settings', settings);
}

export function updateSetting(key: string, value: unknown) {
  store.set(`settings.${key}`, value);
}

export function setStartupSetting(isInit = false) {
  const settings = getSettings();
  const loginItemSettings = app.getLoginItemSettings();

  if (app.isPackaged && settings.general) {
    if (
      !!settings.general?.launchAtStartup !== loginItemSettings.openAtLogin ||
      // Since MacOS Ventura, startup item no longer have hidden setting, but generates a notification when called.
      // So now, when initing the app, we ignore if the hidden settings changed.
      (!isInit &&
        !!settings.general?.startMinimized !== loginItemSettings.openAsHidden)
    ) {
      app.setLoginItemSettings({
        openAtLogin: !!settings?.general?.launchAtStartup,
        openAsHidden: !!settings?.general?.startMinimized,
        args: settings?.general?.startMinimized ? ['--openAsHidden'] : [],
      });
    }
  }
}

export const isHiddenStartupLaunch = () => {
  const settings = getSettings();
  const loginItemSettings = app.getLoginItemSettings();

  if (
    process.argv.indexOf('--openAsHidden') >= 0 ||
    loginItemSettings.wasOpenedAsHidden ||
    (!!settings?.general?.startMinimized && loginItemSettings.wasOpenedAtLogin)
  )
    return true;

  return false;
};

export function onSettingsChange(
  callback: (newValue?: Settings, oldValue?: Settings) => void
): () => void {
  return store.onDidChange('settings', callback);
}

export function resetSettings(key: keyof Settings) {
  return store.set(`settings.${key}`, defaults.settings[key]);
}

export function clearSettings() {
  return store.clear();
}

store.onDidChange('settings', () => {
  setStartupSetting();
});
