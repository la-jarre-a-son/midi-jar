window.os = {
  isMac: true,
  isWindows: false,
  platform: process.platform,
};

window.app = {
  quit: jest.fn(),
  settings: {
    clear: jest.fn(),
    reset: jest.fn(),
    getSettings: jest.fn(),
    updateSetting: jest.fn(),
    updateSettings: jest.fn(),
    onSettingsChange: jest.fn().mockReturnValue(jest.fn()),
  },
  server: {
    enable: jest.fn(),
    getState: jest.fn(),
    onStateChange: jest.fn().mockReturnValue(jest.fn()),
  },
  window: {
    close: jest.fn(),
    minimize: jest.fn(),
    maximize: jest.fn(),
    unmaximize: jest.fn(),
    setAlwaysOnTop: jest.fn(),
    titleBarDoubleClick: jest.fn(),
    checkUpdates: jest.fn(),
    dismissUpdate: jest.fn(),
    dismissChangelog: jest.fn(),
    getState: jest.fn(),
    onStateChange: jest.fn().mockReturnValue(jest.fn()),
    onUpdateInfo: jest.fn().mockReturnValue(jest.fn()),
  },
};

window.midi = {
  refreshDevices: jest.fn(),
  clearRoutes: jest.fn(),
  addRoute: jest.fn(),
  deleteRoute: jest.fn(),
  getInputs: jest.fn(),
  onInputs: jest.fn().mockReturnValue(jest.fn()),
  getOutputs: jest.fn(),
  onOutputs: jest.fn().mockReturnValue(jest.fn()),
  getWires: jest.fn(),
  onWires: jest.fn().mockReturnValue(jest.fn()),
  onLatency: jest.fn().mockReturnValue(jest.fn()),
  onMidiMessage: jest.fn().mockReturnValue(jest.fn()),
};
