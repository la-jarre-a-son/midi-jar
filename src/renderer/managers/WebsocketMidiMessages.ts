import { MidiMessage } from 'main/types';
import MidiMessageManager, { MidiMessageEvent } from './MidiMessageManager';

class WebsocketMidiMessages extends MidiMessageManager {
  private ws: WebSocket;

  constructor(namespace: string) {
    super(namespace);
    this.ws = new window.WebSocket(
      `ws://${window.location.host}/ws/${namespace}`
    );
    this.ws.binaryType = 'arraybuffer';

    this.handleMessage.bind(this);
    this.handleOpen.bind(this);

    this.ws.onmessage = (event: MessageEvent) => this.handleMessage(event);
    this.ws.onopen = () => this.handleOpen();
  }

  private handleMessage(event: MessageEvent) {
    const message = [...new Uint8Array(event.data)] as MidiMessage;
    this.dispatchEvent(
      new MidiMessageEvent('message', message, Date.now(), 'unknown')
    );
  }

  private handleOpen() {
    this.dispatchEvent(new Event('connected'));
  }

  public dispose() {
    this.ws.close();
  }
}
export default WebsocketMidiMessages;
