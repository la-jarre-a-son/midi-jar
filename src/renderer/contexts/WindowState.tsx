import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { WindowState } from 'main/types/WindowState';
import { defaults } from 'main/store/defaults';
import { UpdateInfo } from 'main/types';

interface WindowStateContextInterface {
  windowState: WindowState;
  updateInfo: UpdateInfo | null;
  maximize: () => void;
  unmaximize: () => void;
  minimize: () => void;
  close: () => void;
  titleBarDoubleClick: () => void;
  setAlwaysOnTop: (flag: boolean) => void;
  dismissChangelog: () => void;
  dismissUpdate: (version: string) => void;
}

const WindowStateContext = React.createContext<WindowStateContextInterface | null>(null);

type Props = {
  children: React.ReactNode;
};

const WindowStateProvider: React.FC<Props> = ({ children }) => {
  const [windowState, setWindowState] = useState<WindowState>(defaults.windowState);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  const onStateChange = useCallback((state: WindowState) => {
    setWindowState(state);
  }, []);

  const onUpdateInfo = useCallback((info: UpdateInfo) => {
    setUpdateInfo(info);
  }, []);

  const maximize = useCallback(() => window.app.window.maximize(), []);
  const unmaximize = useCallback(() => window.app.window.unmaximize(), []);
  const minimize = useCallback(() => window.app.window.minimize(), []);
  const setAlwaysOnTop = useCallback((flag: boolean) => window.app.window.setAlwaysOnTop(flag), []);
  const close = useCallback(() => window.app.window.close(), []);
  const titleBarDoubleClick = useCallback(() => window.app.window.titleBarDoubleClick(), []);
  const dismissChangelog = useCallback(() => window.app.window.dismissChangelog(), []);
  const dismissUpdate = useCallback(
    (version: string) => window.app.window.dismissUpdate(version),
    []
  );

  useEffect(() => {
    const offStateChange = window.app.window.onStateChange(onStateChange);
    const offUpdateInfo = window.app.window.onUpdateInfo(onUpdateInfo);

    window.app.window.getState();
    window.app.window.checkUpdates();

    return () => {
      offStateChange();
      offUpdateInfo();
    };
  }, [onStateChange, onUpdateInfo]);

  const value = useMemo(
    () => ({
      windowState,
      updateInfo,
      maximize,
      unmaximize,
      minimize,
      close,
      titleBarDoubleClick,
      setAlwaysOnTop,
      dismissChangelog,
      dismissUpdate,
    }),
    [
      windowState,
      updateInfo,
      maximize,
      minimize,
      unmaximize,
      close,
      titleBarDoubleClick,
      setAlwaysOnTop,
      dismissChangelog,
      dismissUpdate,
    ]
  );

  return <WindowStateContext.Provider value={value}>{children}</WindowStateContext.Provider>;
};

export const useWindowState = () => {
  const context = useContext(WindowStateContext);
  if (!context) {
    throw new Error(`useWindowState must be used within a WindowStateProvider`);
  }
  return context;
};

export default WindowStateProvider;
