import { useEffect, useRef } from 'react';
import { MidiMessage } from 'main/types';

import { MidiMessageEvent } from 'renderer/managers/MidiMessageManager';
import { useMidiMessageManager } from 'renderer/contexts/MidiMessageManager';

export default function useMidiMessages(
  onMessages: (messages: Array<[MidiMessage, number, string]>) => void
) {
  const manager = useMidiMessageManager();
  const buffer = useRef<Array<[MidiMessage, number, string]>>([]);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (manager && onMessages) {
      const listener = ({ message, timestamp, device }: MidiMessageEvent) => {
        buffer.current.push([message, timestamp, device]);
        if (!timeout.current) {
          timeout.current = setTimeout(() => {
            timeout.current = null;
            onMessages(buffer.current);
            buffer.current = [];
          }, 0);
        }
      };

      manager.addEventListener('message', listener);

      return () => {
        manager.removeEventListener('message', listener);
        manager.dispose();
      };
    }
    return () => null;
  }, [manager, onMessages]);
}
