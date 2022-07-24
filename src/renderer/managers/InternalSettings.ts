import { Settings } from 'main/types/Settings';
import SettingsManager, { SettingsEvent } from './SettingsManager';

class InternalSettings extends SettingsManager {
  private offListener: () => void;

  constructor() {
    super();
    this.isConnected = true;

    this.offListener = window.app.settings.onSettingsChange(
      this.handleSettings.bind(this)
    );

    this.dispatchEvent(new Event('connected'));
  }

  private handleSettings(settings: Settings) {
    this.dispatchEvent(new SettingsEvent('settings', settings));
  }

  public dispose() {
    this.offListener();
  }

  // eslint-disable-next-line class-methods-use-this
  public getSettings() {
    window.app.settings.getSettings();
  }
}
export default InternalSettings;
