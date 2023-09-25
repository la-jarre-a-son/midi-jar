import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

import { MidiMessage, ServerState, Settings } from './types';

import { ApiMidiInput, ApiMidiOutput, ApiMidiRoute, ApiMidiWire } from './types/api';
import { WindowState } from './types/WindowState';

type AppEvent = 'maximize' | 'unmaximize' | 'always-on-top-changed';

const registerListener =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (channel: string) => (func: (...args: any[]) => void) => {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  };

export const AppApi = {
  quit: () => ipcRenderer.send('app:quit'),
  settings: {
    clear: () => ipcRenderer.send('app:settings:clear'),
    reset: (key: keyof Settings) => ipcRenderer.invoke('app:settings:reset', key),
    getSettings: () => ipcRenderer.send('app:settings:getSettings'),
    updateSetting: (key: string, value: unknown) =>
      ipcRenderer.invoke('app:settings:updateSetting', key, value),
    updateSettings: (value: Settings) => ipcRenderer.invoke('app:settings:updateSettings', value),
    onSettingsChange: (callback: (settings: Settings) => void) =>
      registerListener('app:settings')(callback),
  },
  server: {
    enable: (enabled: boolean) => ipcRenderer.invoke('app:server:enable', enabled),
    getState: () => ipcRenderer.send('app:server:getState'),
    onStateChange: (callback: (state: ServerState) => void) =>
      registerListener('app:server:state')(callback),
  },
  window: {
    close: () => ipcRenderer.send('app:window:close'),
    minimize: () => ipcRenderer.send('app:window:minimize'),
    maximize: () => ipcRenderer.send('app:window:maximize'),
    unmaximize: () => ipcRenderer.send('app:window:unmaximize'),
    setAlwaysOnTop: (flag: boolean) => ipcRenderer.send('app:window:setAlwaysOnTop', flag),
    titleBarDoubleClick: () => ipcRenderer.send('app:window:titleBarDoubleClick'),
    dismissChangelog: () => ipcRenderer.send('app:window:dismissChangelog'),
    getState: () => ipcRenderer.send('app:window:getState'),
    onStateChange: (callback: (state: WindowState) => void) =>
      registerListener('app:window:state')(callback),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on: (appEvent: AppEvent, callback: (...args: any[]) => void) =>
      registerListener(`app:window:${appEvent}`)(callback),
  },
};

export const OsApi = {
  isMac: process.platform === 'darwin',
  isWindows: process.platform === 'win32',
  platform: process.platform,
};

export const MidiApi = {
  refreshDevices: () => ipcRenderer.send('midi:refreshDevices'),
  clearRoutes: () => ipcRenderer.send('midi:clearRoutes'),
  addRoute: (route: ApiMidiRoute) => ipcRenderer.send('midi:addRoute', route),
  deleteRoute: (route: ApiMidiRoute) => ipcRenderer.send('midi:deleteRoute', route),
  getInputs: () => ipcRenderer.send('midi:getInputs'),
  onInputs: (callback: (inputs: ApiMidiInput[]) => void) =>
    registerListener('midi:inputs')(callback),
  getOutputs: () => ipcRenderer.send('midi:getOutputs'),
  onOutputs: (callback: (outputs: ApiMidiOutput[]) => void) =>
    registerListener('midi:outputs')(callback),
  getWires: () => ipcRenderer.send('midi:getWires'),
  onWires: (callback: (outputs: ApiMidiWire[]) => void) => registerListener('midi:wires')(callback),
  onLatency: (callback: (latency: number, device: string) => void) =>
    registerListener('midi:activity')(callback),
  onMidiMessage: (
    namespace: string,
    callback: (message: MidiMessage, timestamp: number, device: string) => void
  ) => registerListener(`midi:message:${namespace}`)(callback),
};

contextBridge.exposeInMainWorld('app', AppApi);
contextBridge.exposeInMainWorld('os', OsApi);
contextBridge.exposeInMainWorld('midi', MidiApi);
