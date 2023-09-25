import { WindowState } from 'main/types/WindowState';
import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';

interface WindowStateContextInterface {
  isChangelogDismissed: boolean;
  isMaximized: boolean;
  isAlwaysOnTop: boolean;
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
  const [isChangelogDismissed, setChangelogDismissed] = useState<boolean>(true);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState<boolean>(false);

  const onStateChange = useCallback(
    (state: WindowState) => {
      setChangelogDismissed(state.changelogDismissed);
    },
    [setChangelogDismissed]
  );

  const onMaximize = useCallback(() => {
    setIsMaximized(true);
  }, [setIsMaximized]);

  const onUnmaximize = useCallback(() => {
    setIsMaximized(false);
  }, [setIsMaximized]);

  const onAlwaysOnTop = useCallback(
    (isAoT: boolean) => {
      setIsAlwaysOnTop(isAoT);
    },
    [setIsAlwaysOnTop]
  );

  const maximize = useCallback(() => window.app.window.maximize(), []);
  const unmaximize = useCallback(() => window.app.window.unmaximize(), []);
  const minimize = useCallback(() => window.app.window.minimize(), []);
  const setAlwaysOnTop = useCallback((flag: boolean) => window.app.window.setAlwaysOnTop(flag), []);
  const close = useCallback(() => window.app.window.close(), []);
  const titleBarDoubleClick = useCallback(() => window.app.window.titleBarDoubleClick(), []);
  const dismissChangelog = useCallback(() => window.app.window.dismissChangelog(), []);

  useEffect(() => {
    const offMaximize = window.app.window.on('maximize', onMaximize);
    const offUnmaximize = window.app.window.on('unmaximize', onUnmaximize);
    const offAlwaysOnTop = window.app.window.on('always-on-top-changed', onAlwaysOnTop);
    const offStateChange = window.app.window.onStateChange(onStateChange);

    window.app.window.getState();

    return () => {
      offMaximize();
      offUnmaximize();
      offAlwaysOnTop();
      offStateChange();
    };
  }, [onStateChange, onMaximize, onUnmaximize, onAlwaysOnTop]);

  const value = useMemo(
    () => ({
      isChangelogDismissed,
      isMaximized,
      isAlwaysOnTop,
      maximize,
      unmaximize,
      minimize,
      close,
      titleBarDoubleClick,
      setAlwaysOnTop,
      dismissChangelog,
    }),
    [
      isChangelogDismissed,
      isMaximized,
      isAlwaysOnTop,
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
