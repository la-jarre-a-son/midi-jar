import { app } from 'electron';

import { Settings } from './types/Settings';

import { defaults, store } from './store';

export function getSettings(): Settings {
  return store.get('settings');
}

export function updateSettings(settings: Settings) {
  store.set('settings', settings);
}

export function updateSetting(key: string, value: unknown) {
  store.set(`settings.${key}`, value);
}

export function setStartupSetting(force = false) {
  const settings = getSettings();
  const loginItemSettings = app.getLoginItemSettings();

  if (app.isPackaged && settings.general) {
    if (force || !!settings.general?.launchAtStartup !== loginItemSettings.openAtLogin) {
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

store.onDidChange('settings', (newValue?: Settings, oldValue?: Settings) => {
  if (
    newValue &&
    oldValue &&
    (newValue.general?.launchAtStartup !== oldValue.general?.launchAtStartup ||
      newValue.general?.startMinimized !== oldValue.general?.startMinimized)
  ) {
    setStartupSetting(true);
  }
});
