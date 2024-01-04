// eslint-disable-next-line max-classes-per-file
import { Settings } from 'main/types/Settings';

export class SettingsEvent extends Event {
  settings: Settings;

  constructor(type: 'settings', settings: Settings) {
    super(type);
    this.settings = settings;
  }
}

interface SettingsManager extends EventTarget {
  isConnected: boolean;
  addEventListener(
    type: 'settings',
    listener: (ev: SettingsEvent) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: 'settings',
    listener: (ev: SettingsEvent) => void,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
  dispose(): void;
  getSettings(): void;
  updateSetting(key: string, value: unknown): Promise<unknown>;
  updateSettings(value: Settings): Promise<unknown>;
  resetSettings(key: keyof Settings): Promise<unknown>;
}

class SettingsManager extends EventTarget {}

export default SettingsManager;
