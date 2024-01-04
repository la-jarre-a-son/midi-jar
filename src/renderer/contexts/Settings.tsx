import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';

import { Settings } from 'main/types/Settings';
import { defaults } from 'main/store/defaults';
import { SettingsEvent } from 'renderer/managers/SettingsManager';
import { mergeDeep } from 'renderer/helpers';

import { useSettingsManager } from './SettingsManager';

interface SettingsContextInterface {
  settings: Settings;
  updateSetting: (key: string, value: unknown) => Promise<unknown>;
  updateSettings: (value: Settings) => Promise<unknown>;
  resetSettings: (key: keyof Settings) => Promise<unknown>;
}

const SettingsContext = React.createContext<SettingsContextInterface | null>(null);

type ModuleName = 'chordDisplay';

type Props = {
  children: React.ReactNode;
};

const SettingsProvider: React.FC<Props> = ({ children }) => {
  const manager = useSettingsManager();
  const [settings, setSettings] = useState<Settings>(defaults.settings);
  const [inited, setInited] = useState<boolean>(false);

  const onSettingsChange = useCallback(
    (s: Settings) => {
      const newSettings = mergeDeep(defaults.settings, s);
      setSettings(newSettings);
      setInited(true);
    },
    [setSettings]
  );

  const updateSetting = useCallback(
    (key: string, value: unknown) =>
      manager
        ? manager.updateSetting(key, value)
        : Promise.reject(new Error('no settings manager')),
    [manager]
  );

  const updateSettings = useCallback(
    (value: Settings) =>
      manager ? manager.updateSettings(value) : Promise.reject(new Error('no settings manager')),
    [manager]
  );

  const resetSettings = useCallback(
    (key: keyof Settings) =>
      manager ? manager.resetSettings(key) : Promise.reject(new Error('no settings manager')),
    [manager]
  );

  useEffect(() => {
    if (manager) {
      manager.getSettings();

      const listener = ({ settings: s }: SettingsEvent) => {
        onSettingsChange(s);
      };
      manager.addEventListener('settings', listener);

      return () => {
        manager.removeEventListener('settings', listener);
      };
    }

    return undefined;
  }, [manager, manager?.isConnected, onSettingsChange]);

  const value = useMemo(
    () => ({
      settings,
      updateSetting,
      updateSettings,
      resetSettings,
    }),
    [settings, updateSetting, updateSettings, resetSettings]
  );

  return (
    <SettingsContext.Provider value={value}>{inited ? children : null}</SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(`useSettings must be used within a SettingsProvider`);
  }
  return context;
};

export const useModuleSettings = <T extends ModuleName>(moduleName: T, moduleId: string) => {
  const { settings, updateSetting } = useSettings();

  const moduleIndex: number = useMemo(() => {
    if (!settings || !moduleName || !moduleId) return -1;

    const modulesSettings = settings[moduleName];

    if (Array.isArray(modulesSettings)) {
      return modulesSettings.findIndex((module) => module.id === moduleId);
    }

    return -1;
  }, [moduleName, moduleId, settings]);

  const moduleSettings =
    moduleIndex > -1 ? settings[moduleName][moduleIndex] : defaults.settings[moduleName][0];

  const updateModuleSetting = useCallback(
    (setting: string, value: unknown) =>
      moduleIndex > -1 ? updateSetting(`${moduleName}.${moduleIndex}.${setting}`, value) : null,
    [moduleIndex, moduleName, updateSetting]
  );

  const updateModuleSettings = useCallback(
    (value: Settings[T]) =>
      moduleIndex > -1 ? updateSetting(`${moduleName}.${moduleIndex}`, value) : null,
    [moduleIndex, moduleName, updateSetting]
  );

  const resetModuleSettings = useCallback(
    () =>
      moduleIndex > -1
        ? updateSetting(`${moduleName}.${moduleIndex}`, {
            ...defaults.settings[moduleName][0],
            id: moduleId,
          })
        : null,
    [moduleIndex, moduleName, moduleId, updateSetting]
  );

  const deleteModule = useCallback(
    () =>
      updateSetting(
        moduleName,
        settings[moduleName].filter((module) => module.id !== moduleId)
      ),
    [moduleName, moduleId, settings, updateSetting]
  );

  const value = useMemo(
    () => ({
      moduleSettings,
      moduleIndex,
      updateModuleSetting,
      updateModuleSettings,
      resetModuleSettings,
      deleteModule,
    }),
    [
      moduleIndex,
      moduleSettings,
      updateModuleSetting,
      updateModuleSettings,
      resetModuleSettings,
      deleteModule,
    ]
  );

  return value;
};

export default SettingsProvider;
