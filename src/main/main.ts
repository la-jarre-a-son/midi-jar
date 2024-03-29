/* eslint global-require: off, no-console: off, promise/always-return: off, @typescript-eslint/no-var-requires: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, Tray, Menu, nativeImage } from 'electron';
import { resolveHtmlPath, getAssetPath } from './util';

import MenuBuilder from './menu';
import { startServer } from './server';
import { startRefreshLoop } from './midi';
import { bindWindowEvents } from './api';
import { registerWebsocketSubscriptions } from './wsApi';
import { setStartupSetting, isHiddenStartupLaunch } from './settings';
import {
  DEFAULT_WINDOW_MIN_HEIGHT,
  DEFAULT_WINDOW_MIN_WIDTH,
  getWindowBoundsOnDisplay,
  getWindowState,
  saveWindowState,
} from './windowState';

const singleInstance = app.requestSingleInstanceLock();
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

setStartupSetting();

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')({ showDevTools: false });
}

const installExtensions = () => {
  const { installExtension, REACT_DEVELOPER_TOOLS } = require('electron-extension-installer');

  return installExtension(REACT_DEVELOPER_TOOLS, {
    loadExtensionOptions: {
      allowFileAccess: true,
    },
  });
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const windowState = getWindowState();

  const winBounds = getWindowBoundsOnDisplay();

  mainWindow = new BrowserWindow({
    show: false,
    x: winBounds.x ?? undefined,
    y: winBounds.y ?? undefined,
    width: winBounds.width,
    height: winBounds.height,
    minWidth: DEFAULT_WINDOW_MIN_WIDTH,
    minHeight: DEFAULT_WINDOW_MIN_HEIGHT,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 10, y: 14 },
  });

  mainWindow.loadURL(resolveHtmlPath('renderer.html', windowState.path));
  mainWindow.setMenu(null);
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();

    if (windowState.maximized) {
      mainWindow.maximize();
    }

    if (windowState.alwaysOnTop) {
      mainWindow.setAlwaysOnTop(true, 'floating');
    }
  });

  mainWindow.on('close', () => {
    if (mainWindow) {
      saveWindowState(mainWindow);
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  bindWindowEvents(mainWindow);
};

const openWindow = () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    app.focus({ steal: true });
  } else {
    createWindow();
  }
  app.dock?.show();
};

const firstOpenWindow = () => {
  if (!isHiddenStartupLaunch()) {
    openWindow();
  } else {
    app.dock?.hide();
  }
};

const createTray = () => {
  const icon = nativeImage.createFromPath(getAssetPath('icon.png'));
  tray = new Tray(icon.resize({ width: 16, height: 16 }));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open App',
      click: () => {
        openWindow();
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.on('double-click', () => openWindow());
  tray.setContextMenu(contextMenu);
  tray.setToolTip('MIDI Jar');
};

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
  // Do not close app
  app.dock?.hide();
});

app.on('second-instance', () => {
  openWindow();
});

app.on('before-quit', (_event) => {
  tray?.destroy();
});

process.on('SIGINT', () => {
  console.log('SIGINT');
  app.quit();
  process.exit(0);
});
process.on('SIGTERM', () => {
  console.log('SIGTERM');
  app.quit();
  process.exit(0);
});

// Start app windows
if (!singleInstance) {
  app.quit();
}

app
  .whenReady()
  .then(() => startServer())
  .catch((err) => {
    console.error(err);
  })
  .then(() => {
    registerWebsocketSubscriptions();
    startRefreshLoop();
    firstOpenWindow();
    createTray();
    app.on('activate', () => {
      openWindow();
    });
  })
  .catch((err) => {
    console.error(err);
    app.quit();
  })

  .catch(console.log);
