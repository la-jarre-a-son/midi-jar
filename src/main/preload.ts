import os from 'os';
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

import { MidiMessage, ServerState, Settings } from './types';

import {
  ApiMidiInput,
  ApiMidiOutput,
  ApiMidiRoute,
  ApiMidiWire,
} from './types/api';

type AppEvent = 'maximize' | 'unmaximize' | 'always-on-top-changed';

const registerListener =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (channel: string) => (func: (...args: any[]) => void) => {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      func(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  };

export const AppApi = {
  quit: () => ipcRenderer.send('app:quit'),
  close: () => ipcRenderer.send('app:close'),
  minimize: () => ipcRenderer.send('app:minimize'),
  maximize: () => ipcRenderer.send('app:maximize'),
  unmaximize: () => ipcRenderer.send('app:unmaximize'),
  setAlwaysOnTop: (flag: boolean) =>
    ipcRenderer.send('app:setAlwaysOnTop', flag),
  titleBarDoubleClick: () => ipcRenderer.send('app:titleBarDoubleClick'),
  on: (appEvent: AppEvent, callback: (...args: unknown[]) => void) =>
    registerListener(`app:${appEvent}`)(callback),
  settings: {
    clear: () => ipcRenderer.send('app:settings:clear'),
    reset: (key: keyof Settings) =>
      ipcRenderer.invoke('app:settings:reset', key),
    getSettings: () => ipcRenderer.send('app:settings:getSettings'),
    updateSetting: (key: string, value: unknown) =>
      ipcRenderer.invoke('app:settings:updateSetting', key, value),
    updateSettings: (value: Settings) =>
      ipcRenderer.invoke('app:settings:updateSettings', value),
    onSettingsChange: (callback: (settings: Settings) => void) =>
      registerListener('app:settings')(callback),
  },
  server: {
    enable: (enabled: boolean) =>
      ipcRenderer.invoke('app:server:enable', enabled),
    getState: () => ipcRenderer.send('app:server:getState'),
    onStateChange: (callback: (state: ServerState) => void) =>
      registerListener('app:server:state')(callback),
  },
};

export const OsApi = {
  isMac: os.platform() === 'darwin',
  isWindows: os.platform() === 'win32',
};

export const MidiApi = {
  refreshDevices: () => ipcRenderer.send('midi:refreshDevices'),
  clearRoutes: () => ipcRenderer.send('midi:clearRoutes'),
  addRoute: (route: ApiMidiRoute) => ipcRenderer.send('midi:addRoute', route),
  deleteRoute: (route: ApiMidiRoute) =>
    ipcRenderer.send('midi:deleteRoute', route),
  getInputs: () => ipcRenderer.send('midi:getInputs'),
  onInputs: (callback: (inputs: ApiMidiInput[]) => void) =>
    registerListener('midi:inputs')(callback),
  getOutputs: () => ipcRenderer.send('midi:getOutputs'),
  onOutputs: (callback: (outputs: ApiMidiOutput[]) => void) =>
    registerListener('midi:outputs')(callback),
  getWires: () => ipcRenderer.send('midi:getWires'),
  onWires: (callback: (outputs: ApiMidiWire[]) => void) =>
    registerListener('midi:wires')(callback),
  onLatency: (callback: (latency: number, device: string) => void) =>
    registerListener('midi:activity')(callback),
  onMidiMessage: (
    namespace: string,
    callback: (message: MidiMessage, timestamp: number, device: string) => void
  ) => registerListener(`${namespace}:message`)(callback),
};

contextBridge.exposeInMainWorld('app', AppApi);
contextBridge.exposeInMainWorld('os', OsApi);
contextBridge.exposeInMainWorld('midi', MidiApi);
