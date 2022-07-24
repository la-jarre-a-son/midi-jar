import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import { Settings } from 'main/types/Settings';
import { SettingsEvent } from 'renderer/managers/SettingsManager';
import { useSettingsManager } from './SettingsManager';

interface SettingsContextInterface {
  settings: Settings | null;
  updateSetting: (key: string, value: unknown) => Promise<void>;
  updateSettings: (value: Settings) => Promise<void>;
  resetSettings: (key: keyof Settings) => Promise<void>;
}

const SettingsContext = React.createContext<SettingsContextInterface | null>(
  null
);

type Props = {
  children: React.ReactNode;
};

const SettingsProvider: React.FC<Props> = ({ children }) => {
  const manager = useSettingsManager();
  const [settings, setSettings] = useState<Settings | null>(null);

  const onSettingsChange = useCallback(
    (s: Settings) => {
      setSettings(s);
    },
    [setSettings]
  );

  const updateSetting = useCallback(
    (key: string, value: unknown) =>
      window.app.settings.updateSetting(key, value),
    []
  );

  const updateSettings = useCallback(
    (value: Settings) => window.app.settings.updateSettings(value),
    []
  );

  const resetSettings = useCallback(
    (key: keyof Settings) => window.app.settings.reset(key),
    []
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

    return () => {};
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
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(`useSettings must be used within a SettingsProvider`);
  }
  return context;
};

export default SettingsProvider;
