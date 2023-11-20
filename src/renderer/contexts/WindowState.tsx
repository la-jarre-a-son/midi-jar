import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { WindowState } from 'main/types/WindowState';
import { defaults } from 'main/store/defaults';

interface WindowStateContextInterface {
  windowState: WindowState;
  maximize: () => void;
  unmaximize: () => void;
  minimize: () => void;
  close: () => void;
  titleBarDoubleClick: () => void;
  setAlwaysOnTop: (flag: boolean) => void;
  dismissChangelog: () => void;
}

const WindowStateContext = React.createContext<WindowStateContextInterface | null>(null);

type Props = {
  children: React.ReactNode;
};

const WindowStateProvider: React.FC<Props> = ({ children }) => {
  const [windowState, setWindowState] = useState<WindowState>(defaults.windowState);

  const onStateChange = useCallback((state: WindowState) => {
    setWindowState(state);
  }, []);

  const maximize = useCallback(() => window.app.window.maximize(), []);
  const unmaximize = useCallback(() => window.app.window.unmaximize(), []);
  const minimize = useCallback(() => window.app.window.minimize(), []);
  const setAlwaysOnTop = useCallback((flag: boolean) => window.app.window.setAlwaysOnTop(flag), []);
  const close = useCallback(() => window.app.window.close(), []);
  const titleBarDoubleClick = useCallback(() => window.app.window.titleBarDoubleClick(), []);
  const dismissChangelog = useCallback(() => window.app.window.dismissChangelog(), []);

  useEffect(() => {
    const offStateChange = window.app.window.onStateChange(onStateChange);

    window.app.window.getState();

    return () => {
      offStateChange();
    };
  }, [onStateChange]);

  const value = useMemo(
    () => ({
      windowState,
      maximize,
      unmaximize,
      minimize,
      close,
      titleBarDoubleClick,
      setAlwaysOnTop,
      dismissChangelog,
    }),
    [
      windowState,
      maximize,
      minimize,
      unmaximize,
      close,
      titleBarDoubleClick,
      setAlwaysOnTop,
      dismissChangelog,
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
