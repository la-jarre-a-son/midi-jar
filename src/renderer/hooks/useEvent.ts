/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react-hooks/exhaustive-deps */

import { useCallback, useEffect, useRef } from 'react';

/**
 * A Hook to define an event handler with an always-stable function identity.
 * https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
 * (Need to be changed with the React implementation once released)
 */
function useEvent<T extends Function>(func: T): T {
  const ref = useRef<T>(func);

  useEffect(() => {
    ref.current = func;
  });

  return useCallback(
    ((...args: any[]) => {
      return ref.current(...args);
    }) as any,
    []
  );
}

export default useEvent;
