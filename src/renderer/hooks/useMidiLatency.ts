import { useEffect, useRef, useState, useCallback } from 'react';

export default function useMidiLatency(filterDevice = '*'): [number, number, () => void] {
  const [currentLatency, setCurrentLatency] = useState<number>(0);
  const [highestLatency, setHighestLatency] = useState<number>(0);
  const highest = useRef<number>(0);
  const buffer = useRef<Array<number>>([]);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHighest = useCallback(() => {
    highest.current = 0;
    setHighestLatency(0);
  }, []);

  useEffect(() => {
    return window.midi.onLatency((latency, device) => {
      if (filterDevice === '*' || filterDevice === device) {
        buffer.current.push(latency);

        if (!timeout.current) {
          timeout.current = setTimeout(() => {
            timeout.current = null;
            let sum = 0;
            for (let i = 0; i < buffer.current.length; i += 1) {
              sum += buffer.current[i];
              if (highest.current < buffer.current[i]) {
                highest.current = buffer.current[i];
              }
            }
            const average = sum / buffer.current.length;
            buffer.current = [];

            setCurrentLatency(average);
            setHighestLatency(highest.current);
          }, 0);
        }
      }
    });
  }, [filterDevice]);

  return [currentLatency, highestLatency, resetHighest];
}
