import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';

interface WindowStateContextInterface {
  isMaximized: boolean;
  isAlwaysOnTop: boolean;
  maximize: () => void;
  unmaximize: () => void;
  minimize: () => void;
  close: () => void;
  titleBarDoubleClick: () => void;
  setAlwaysOnTop: (flag: boolean) => void;
}

const WindowStateContext = React.createContext<WindowStateContextInterface | null>(null);

type Props = {
  children: React.ReactNode;
};

const WindowStateProvider: React.FC<Props> = ({ children }) => {
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState<boolean>(false);

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

  const maximize = useCallback(() => window.app.maximize(), []);
  const unmaximize = useCallback(() => window.app.unmaximize(), []);
  const minimize = useCallback(() => window.app.minimize(), []);
  const setAlwaysOnTop = useCallback((flag: boolean) => window.app.setAlwaysOnTop(flag), []);
  const close = useCallback(() => window.app.close(), []);
  const titleBarDoubleClick = useCallback(() => window.app.titleBarDoubleClick(), []);

  useEffect(() => {
    const offMaximize = window.app.on('maximize', onMaximize);
    const offUnmaximize = window.app.on('unmaximize', onUnmaximize);
    const offAlwaysOnTop = window.app.on('always-on-top-changed', onAlwaysOnTop);

    return () => {
      offMaximize();
      offUnmaximize();
      offAlwaysOnTop();
    };
  }, [onMaximize, onUnmaximize, onAlwaysOnTop]);

  const value = useMemo(
    () => ({
      isMaximized,
      isAlwaysOnTop,
      maximize,
      unmaximize,
      minimize,
      close,
      titleBarDoubleClick,
      setAlwaysOnTop,
    }),
    [
      isMaximized,
      isAlwaysOnTop,
      maximize,
      minimize,
      unmaximize,
      close,
      titleBarDoubleClick,
      setAlwaysOnTop,
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
