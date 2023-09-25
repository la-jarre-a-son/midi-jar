import { screen, BrowserWindow, Rectangle } from 'electron';
import { store, defaults } from './store';
import { WindowState } from './types/WindowState';

export const DEFAULT_WINDOW_WIDTH = 1024;
export const DEFAULT_WINDOW_HEIGHT = 768;
export const DEFAULT_WINDOW_MIN_WIDTH = 480;
export const DEFAULT_WINDOW_MIN_HEIGHT = 260;

function isWindowInDisplay(wB: Rectangle, dB: Rectangle) {
  return (
    wB.x >= dB.x &&
    wB.y >= dB.y &&
    wB.x + wB.width <= dB.x + dB.width &&
    wB.y + wB.height <= dB.y + dB.height
  );
}

export function getWindowState() {
  return store.get('windowState') ?? defaults.windowState;
}

export function getWindowBoundsOnDisplay() {
  const { x, y, width, height } = getWindowState();

  if (
    typeof x === 'number' &&
    typeof y === 'number' &&
    typeof width === 'number' &&
    typeof height === 'number'
  ) {
    const bounds = { x, y, width, height };
    if (
      screen.getAllDisplays().some((display) => {
        return isWindowInDisplay(bounds, display.bounds);
      })
    ) {
      return bounds;
    }
  }

  return { x: undefined, y: undefined, width: DEFAULT_WINDOW_WIDTH, height: DEFAULT_WINDOW_HEIGHT };
}

export function saveWindowState(window: BrowserWindow) {
  const previousState = store.get('windowState');

  const { x, y, height, width } = window.getNormalBounds();

  store.set('windowState', { ...previousState, x, y, width, height });
}

export function dismissChangelog() {
  return store.set('windowState.changelogDismissed', true);
}

export function onWindowStateChange(
  callback: (newValue?: WindowState, oldValue?: WindowState) => void
): () => void {
  return store.onDidChange('windowState', callback);
}
