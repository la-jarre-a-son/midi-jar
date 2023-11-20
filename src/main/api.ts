import os from 'os';
import { app, ipcMain, BrowserWindow, systemPreferences } from 'electron';

import * as midi from './midi';
import { startServer, stopServer, getState as getServerState } from './server';

import { ApiMidiRoute } from './types/api';
import { MidiMessage, Settings } from './types';
import {
  getSettings,
  updateSetting,
  updateSettings,
  onSettingsChange,
  resetSettings,
  clearSettings,
} from './settings';
import {
  setAlwaysOnTop,
  setMaximized,
  dismissChangelog,
  getWindowState,
  onWindowStateChange,
} from './windowState';
import { WindowState } from './types/WindowState';

function sendToAll(channel: string, ...args: unknown[]) {
  const windows = BrowserWindow.getAllWindows();
  windows.forEach((window) => {
    window.webContents.send(channel, ...args);
  });
}

ipcMain.on('app:quit', () => {
  app.quit();
});

/* WINDOW */

ipcMain.on('app:window:close', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.close();
});

ipcMain.on('app:window:minimize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.minimize();
});

ipcMain.on('app:window:maximize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.maximize();
  setMaximized(true);
});

ipcMain.on('app:window:unmaximize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  window?.unmaximize();
  setMaximized(false);
});

ipcMain.on('app:window:titleBarDoubleClick', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window && os.platform() === 'darwin') {
    const doubleClickAction = systemPreferences.getUserDefault(
      'AppleActionOnDoubleClick',
      'string'
    );

    if (doubleClickAction === 'Minimize') {
      window.minimize();
    } else if (doubleClickAction === 'Maximize') {
      if (!window.isMaximized()) {
        window.maximize();
      } else {
        window.unmaximize();
      }
    }
  }
});

ipcMain.on('app:window:setAlwaysOnTop', (event, flag) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  window?.setAlwaysOnTop(flag, 'floating');
});

ipcMain.on('app:window:dismissChangelog', () => {
  dismissChangelog();
});

ipcMain.on('app:window:getState', (event) => {
  event.reply('app:window:state', getWindowState());
});

onWindowStateChange((state?: WindowState) => {
  if (state) {
    sendToAll('app:window:state', state);
  }
});

export function bindWindowEvents(window: BrowserWindow) {
  window.on('maximize', () => {
    setMaximized(true);
  });
  window.on('unmaximize', () => {
    setMaximized(false);
  });
  window.on('always-on-top-changed', (_event, isAlwaysOnTop) => {
    setAlwaysOnTop(isAlwaysOnTop);
  });
}

/* MIDI */

ipcMain.on('midi:refreshDevices', () => {
  midi.refreshDevices(true);
});

ipcMain.on('midi:clearRoutes', () => {
  midi.clearRoutes();
});

ipcMain.on('midi:addRoute', (_event, route: ApiMidiRoute) => {
  midi.addRoute(route);
});

ipcMain.on('midi:deleteRoute', (_event, route: ApiMidiRoute) => {
  midi.deleteRoute(route);
});

ipcMain.on('midi:getInputs', (event) => {
  const inputs = midi.getInputs();
  event.reply('midi:inputs', inputs);
});

ipcMain.on('midi:getOutputs', (event) => {
  const outputs = midi.getOutputs();
  event.reply('midi:outputs', outputs);
});

ipcMain.on('midi:getWires', (event) => {
  const wires = midi.getWires();
  event.reply('midi:wires', wires);
});

ipcMain.on('app:settings:getSettings', (event) => {
  const settings = getSettings();
  event.reply('app:settings', settings);
});

midi.manager.addListener('refreshed', () => {
  sendToAll('midi:inputs', midi.getInputs());
  sendToAll('midi:outputs', midi.getOutputs());
  sendToAll('midi:wires', midi.getWires());
});

midi.manager.addListener(
  'midi',
  (namespace: string, message: MidiMessage, timestamp: number, device: string) => {
    sendToAll(`midi:message:*`, message, timestamp, device);
    sendToAll(`midi:message:${namespace}`, message, timestamp, device);
  }
);

midi.manager.addListener('activity', (latency: number, device: string) => {
  sendToAll(`midi:activity`, latency, device);
});

/* SETTINGS */

ipcMain.handle('app:settings:updateSetting', (_event, key: string, value: unknown) => {
  updateSetting(key, value);
});

ipcMain.handle('app:settings:updateSettings', (_event, value: Settings) => {
  updateSettings(value);
});

ipcMain.handle('app:settings:reset', (_event, key) => {
  resetSettings(key);
});

ipcMain.on('app:settings:clear', (_event) => {
  clearSettings();
});

onSettingsChange((settings?: Settings) => {
  if (settings) {
    sendToAll('app:settings', settings);
  }
});

/* SERVER */

ipcMain.handle('app:server:enable', async (_event, enabled: boolean) => {
  try {
    await updateSetting('server.enabled', enabled);

    if (enabled) {
      await startServer();
    } else {
      await stopServer();
    }
  } finally {
    sendToAll('app:server:state', getServerState());
  }
});

ipcMain.on('app:server:getState', (event) => {
  event.reply('app:server:state', getServerState());
});
