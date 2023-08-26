import React, { useState, useContext, useEffect } from 'react';

import InternalMidiMessages from 'renderer/managers/InternalMidiMessages';
import MidiMessageManager from 'renderer/managers/MidiMessageManager';
import WebsocketMidiMessages from 'renderer/managers/WebsocketMidiMessages';

const MidiMessageManagerContext = React.createContext<MidiMessageManager | null | undefined>(
  undefined
);

type Props = {
  source: 'internal' | 'websocket';
  namespace: string;
  children: React.ReactNode;
};

const MidiMessageManagerProvider: React.FC<Props> = ({ source, namespace, children }) => {
  const [manager, setManager] = useState<MidiMessageManager | null>(null);

  useEffect(() => {
    if (source === 'internal') {
      setManager(new InternalMidiMessages(namespace));
    }

    if (source === 'websocket') {
      setManager(new WebsocketMidiMessages(namespace));
    }

    return () => {
      setManager((previousManager) => {
        previousManager?.dispose();
        return null;
      });
    };
  }, [source, namespace, setManager]);

  return (
    <MidiMessageManagerContext.Provider value={manager}>
      {manager ? children : null}
    </MidiMessageManagerContext.Provider>
  );
};

export const useMidiMessageManager = () => {
  const context = useContext(MidiMessageManagerContext);
  if (context === undefined) {
    throw new Error(`useMidiMessageManager must be used within a MidiMessageManagerProvider`);
  }
  return context;
};

export default MidiMessageManagerProvider;
