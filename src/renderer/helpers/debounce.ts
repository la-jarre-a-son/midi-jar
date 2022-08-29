// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(func: Function, wait: number, immediate?: boolean) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function debouncedFn(this: unknown, ...args: unknown[]) {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    }, wait);
    if (immediate && !timeout) func.apply(this, args);
  };
}

export default debounce;
