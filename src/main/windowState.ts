import { screen, BrowserWindow, Rectangle } from 'electron';
import { lt, lte } from 'semver';

import { store, defaults } from './store';
import { WindowState } from './types/WindowState';
import { getURLHash } from './util';

import packageJson from '../../package.json';

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
  const storedWindowState = store.get('windowState') ?? defaults.windowState;

  return {
    ...storedWindowState,
    updateDismissed:
      !storedWindowState.updateDismissed ||
      lte(storedWindowState.updateDismissed, packageJson.version)
        ? null
        : storedWindowState.updateDismissed,
    changelogDismissed:
      !storedWindowState.changelogDismissed ||
      lt(storedWindowState.changelogDismissed, packageJson.version)
        ? null
        : storedWindowState.changelogDismissed,
  };
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

  const path = getURLHash(window.webContents.getURL());
  const maximized = window.isMaximized();
  const alwaysOnTop = window.isAlwaysOnTop();

  store.set('windowState', { ...previousState, x, y, width, height, maximized, alwaysOnTop, path });
}

export function dismissChangelog() {
  return store.set('windowState.changelogDismissed', packageJson.version);
}

export function dismissUpdate(version: string) {
  return store.set('windowState.updateDismissed', version);
}

export function setAlwaysOnTop(flag: boolean) {
  return store.set('windowState.alwaysOnTop', flag);
}

export function setMaximized(maximized: boolean) {
  return store.set('windowState.maximized', maximized);
}

export function onWindowStateChange(
  callback: (newValue?: WindowState, oldValue?: WindowState) => void
): () => void {
  return store.onDidChange('windowState', callback);
}
