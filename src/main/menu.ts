import { app, Menu, shell, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import { resolveHtmlPath } from './util';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  goTo(route: string) {
    this.mainWindow.loadURL(`${resolveHtmlPath('renderer.html')}#${route}`);
  }

  buildMenu(): Menu {
    const template = process.platform === 'darwin' ? this.buildDarwinTemplate() : [];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'MIDI Jar',
      submenu: [
        {
          label: 'About MIDI Jar',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        {
          label: 'Preferences',
          submenu: [
            {
              label: 'General',
              click: () => {
                this.goTo('/settings/general');
              },
            },
            {
              label: 'Routing',
              click: () => {
                this.goTo('/settings/routing');
              },
            },
            {
              label: 'Debugger',
              click: () => {
                this.goTo('/settings/debugger');
              },
            },
            {
              label: 'Server',
              click: () => {
                this.goTo('/settings/server');
              },
            },
          ],
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide MIDI Jar',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Close',
          accelerator: 'Command+W',
          click: () => {
            this.mainWindow.close();
          },
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Always On Top',
          accelerator: 'Ctrl+Command+P',
          click: () => {
            const isAlwaysOnTop = this.mainWindow.isAlwaysOnTop();

            this.mainWindow.setAlwaysOnTop(!isAlwaysOnTop, 'floating');
          },
        },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'Credits',
          click: () => {
            this.goTo('/settings/credits');
          },
        },
        {
          label: 'Licenses',
          click: () => {
            this.goTo('/settings/licenses');
          },
        },
        {
          label: 'Report Bug',
          click() {
            shell.openExternal('https://github.com/la-jarre-a-son/midi-jar/issues');
          },
        },
      ],
    };

    return [subMenuAbout, subMenuWindow, subMenuHelp];
  }
}
