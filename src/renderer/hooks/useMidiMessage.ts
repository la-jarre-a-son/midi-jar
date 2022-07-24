import { useEffect } from 'react';

import { MidiMessage } from 'main/types';
import { MidiMessageEvent } from 'renderer/managers/MidiMessageManager';
import { useMidiMessageManager } from 'renderer/contexts/MidiMessageManager';

export default function useMidiMessage(
  onMessage?: (message: MidiMessage, timestamp: number, device: string) => void
) {
  const manager = useMidiMessageManager();

  useEffect(() => {
    if (manager && onMessage) {
      const listener = ({ message, timestamp, device }: MidiMessageEvent) => {
        onMessage(message, timestamp, device);
      };
      manager.addEventListener('message', listener);

      return () => {
        manager.removeEventListener('message', listener);
      };
    }
    return () => null;
  }, [manager, onMessage]);
}
