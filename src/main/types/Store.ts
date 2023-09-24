import { Midi } from './Midi';
import { Settings } from './Settings';
import { WindowState } from './WindowState';

export type StoreType = {
  midi: Midi;
  settings: Settings;
  windowState: WindowState;
};
