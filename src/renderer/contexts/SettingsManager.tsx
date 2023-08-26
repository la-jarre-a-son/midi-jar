import React, { useState, useContext, useEffect } from 'react';

import InternalSettings from 'renderer/managers/InternalSettings';
import SettingsManager from 'renderer/managers/SettingsManager';
import WebsocketSettings from 'renderer/managers/WebsocketSettings';

const SettingsManagerContext = React.createContext<SettingsManager | null | undefined>(undefined);

type Props = {
  source: 'internal' | 'websocket';
  children: React.ReactNode;
};

const SettingsManagerProvider: React.FC<Props> = ({ source, children }) => {
  const [manager, setManager] = useState<SettingsManager | null>(null);

  useEffect(() => {
    if (source === 'internal') {
      setManager(new InternalSettings());
    }

    if (source === 'websocket') {
      const m = new WebsocketSettings();

      m.addEventListener('connected', () => {
        setManager(m);
      });
    }

    return () => {
      setManager((previousManager) => {
        previousManager?.dispose();
        return null;
      });
    };
  }, [source, setManager]);

  return (
    <SettingsManagerContext.Provider value={manager}>
      {manager ? children : null}
    </SettingsManagerContext.Provider>
  );
};

export const useSettingsManager = () => {
  const context = useContext(SettingsManagerContext);
  if (context === undefined) {
    throw new Error(`useSettingsManager must be used within a SettingsManagerProvider`);
  }
  return context;
};

export default SettingsManagerProvider;
