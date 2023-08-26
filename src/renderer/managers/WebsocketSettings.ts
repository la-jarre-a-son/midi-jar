import ReconnectingWebSocket from 'reconnecting-websocket';
import { Settings } from 'main/types/Settings';
import SettingsManager, { SettingsEvent } from './SettingsManager';

function parseMessage(str: string) {
  const index = str.indexOf('#');
  const eventType = index !== -1 ? str.slice(0, index) : str;
  const rawPayload = index !== -1 ? str.slice(index + 1) : undefined;

  const payload = rawPayload ? JSON.parse(rawPayload) : undefined;

  return [eventType, payload];
}

class WebsocketSettings extends SettingsManager {
  private ws: ReconnectingWebSocket;

  constructor() {
    super();
    this.isConnected = false;
    this.ws = new ReconnectingWebSocket(`ws://${window.location.host}/ws/settings`);

    this.handleMessage.bind(this);
    this.handleOpen.bind(this);

    this.ws.onmessage = (event: MessageEvent) => this.handleMessage(event);
    this.ws.onopen = () => this.handleOpen();
  }

  private handleMessage(event: MessageEvent) {
    const str = event.data.toString();

    try {
      const [eventName, payload] = parseMessage(str);

      if (eventName === 'app:settings') {
        this.handleSettings(payload);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  private handleOpen() {
    this.isConnected = true;
    this.dispatchEvent(new Event('connected'));
  }

  private handleSettings(settings: Settings) {
    this.dispatchEvent(new SettingsEvent('settings', settings));
  }

  public dispose() {
    this.ws.close();
    this.isConnected = false;
  }

  // eslint-disable-next-line class-methods-use-this
  public getSettings() {
    if (this.ws.OPEN) {
      this.ws.send('app:settings:getSettings');
    }
  }
}
export default WebsocketSettings;
