import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import { ServerState } from 'main/types';

interface ServerStateContextInterface {
  state: ServerState;
  enable: (enabled: boolean) => Promise<void>;
}

const ServerStateContext =
  React.createContext<ServerStateContextInterface | null>(null);

type Props = {
  children: React.ReactNode;
};

const ServerStateProvider: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState<ServerState>({
    started: false,
    port: null,
    error: null,
    addresses: [],
  });

  const onStateChange = useCallback(
    (s: ServerState) => {
      setState(s);
    },
    [setState]
  );

  const enable = useCallback(
    (enabled: boolean) => window.app.server.enable(enabled),
    []
  );

  useEffect(() => {
    window.app.server.getState();
    const offState = window.app.server.onStateChange(onStateChange);

    return () => {
      offState();
    };
  }, [onStateChange]);

  const value = useMemo(
    () => ({
      state,
      enable,
    }),
    [state, enable]
  );

  return (
    <ServerStateContext.Provider value={value}>
      {children}
    </ServerStateContext.Provider>
  );
};

export const useServerState = () => {
  const context = useContext(ServerStateContext);
  if (!context) {
    throw new Error(`useServerState must be used within a ServerStateProvider`);
  }
  return context;
};

export default ServerStateProvider;
