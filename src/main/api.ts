import os from 'os';
import { app, ipcMain, BrowserWindow, systemPreferences } from 'electron';

import * as midi from './midi';
import { startServer, stopServer, getState as getServerState } from './server';

import { ApiMidiRoute } from './types/api';
import { MidiMessage, MidiInput, MidiOutput, MidiRoute, Settings } from './types';
import {
  getSettings,
  updateSetting,
  updateSettings,
  onSettingsChange,
  resetSettings,
  clearSettings,
} from './settings';

function sendToAll(channel: string, ...args: unknown[]) {
  const windows = BrowserWindow.getAllWindows();
  windows.forEach((window) => {
    window.webContents.send(channel, ...args);
  });
}

ipcMain.on('app:quit', () => {
  app.quit();
});

ipcMain.on('app:close', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.close();
});

ipcMain.on('app:minimize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.minimize();
});

ipcMain.on('app:maximize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  window?.maximize();
});

ipcMain.on('app:unmaximize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  window?.unmaximize();
});

ipcMain.on('app:titleBarDoubleClick', (event) => {
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

ipcMain.on('app:setAlwaysOnTop', (event, flag) => {
  const window = BrowserWindow.fromWebContents(event.sender);

  window?.setAlwaysOnTop(flag, 'floating');
});

ipcMain.on('midi:refreshDevices', () => {
  midi.refreshDevices(true);
});

ipcMain.on('midi:clearRoutes', () => {
  midi.clearRoutes();
});

ipcMain.on('midi:addRoute', (_event, route: ApiMidiRoute) => {
  midi.addRoute(MidiRoute.fromApi(route));
});

ipcMain.on('midi:deleteRoute', (_event, route: ApiMidiRoute) => {
  midi.deleteRoute(MidiRoute.fromApi(route));
});

ipcMain.on('midi:getInputs', (event) => {
  const inputs = midi.getInputs().map((i: MidiInput) => i.toApi());
  event.reply('midi:inputs', inputs);
});

ipcMain.on('midi:getOutputs', (event) => {
  const outputs = midi.getOutputs().map((o: MidiOutput) => o.toApi());
  event.reply('midi:outputs', outputs);
});

ipcMain.on('midi:getWires', (event) => {
  const wires = midi.getWires().map((i) => i.toApi());
  event.reply('midi:wires', wires);
});

ipcMain.on('app:settings:getSettings', (event) => {
  const settings = getSettings();
  event.reply('app:settings', settings);
});

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

midi.manager.addListener('refreshed', () => {
  sendToAll(
    'midi:inputs',
    midi.getInputs().map((i) => i.toApi())
  );
  sendToAll(
    'midi:outputs',
    midi.getOutputs().map((i) => i.toApi())
  );
  sendToAll(
    'midi:wires',
    midi.getWires().map((i) => i.toApi())
  );
});

midi.manager.addListener(
  'midi',
  (namespace: string, message: MidiMessage, timestamp: number, device: string) => {
    sendToAll(`${namespace}:message`, message, timestamp, device);
  }
);

midi.manager.addListener('activity', (latency: number, device: string) => {
  sendToAll(`midi:activity`, latency, device);
});

// eslint-disable-next-line import/prefer-default-export
export function bindWindowEvents(window: BrowserWindow) {
  window.on('maximize', () => window.webContents.send('app:maximize'));
  window.on('unmaximize', () => window.webContents.send('app:unmaximize'));
  window.on('always-on-top-changed', (_event, isAlwaysOnTop) =>
    window.webContents.send('app:always-on-top-changed', isAlwaysOnTop)
  );
}
