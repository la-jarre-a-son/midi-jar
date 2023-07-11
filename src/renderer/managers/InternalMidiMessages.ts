import { MidiMessage } from 'main/types/Midi';
import MidiMessageManager, { MidiMessageEvent } from './MidiMessageManager';

class InternalMidiMessages extends MidiMessageManager {
  private offListener: () => void;

  constructor(namespace: string) {
    super(namespace);

    this.offListener = window.midi.onMidiMessage(this.namespace, this.handleMessage.bind(this));
  }

  private handleMessage(message: MidiMessage, timestamp: number, device: string) {
    this.dispatchEvent(new MidiMessageEvent('message', message, timestamp, device));
  }

  public dispose() {
    this.offListener();
  }
}
export default InternalMidiMessages;
