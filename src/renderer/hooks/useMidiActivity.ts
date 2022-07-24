import { useEffect, useRef } from 'react';

export default function useMidiActivity(
  filterDevice = '*',
  onActivity?: () => void
) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return window.midi.onLatency((_latency, device) => {
      if (filterDevice === '*' || filterDevice === device) {
        if (!timeout.current) {
          timeout.current = setTimeout(() => {
            timeout.current = null;
            if (onActivity) {
              onActivity();
            }
          }, 0);
        }
      }
    });
  }, [filterDevice, onActivity]);
}
