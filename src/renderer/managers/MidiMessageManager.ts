// eslint-disable-next-line max-classes-per-file
import { MidiMessage } from 'main/types';

export class MidiMessageEvent extends Event {
  message: MidiMessage;

  timestamp: number;

  device: string;

  constructor(type: 'message', message: MidiMessage, timestamp: number, device: string) {
    super(type);
    this.message = message;
    this.timestamp = timestamp;
    this.device = device;
  }
}

interface MidiMessageManager extends EventTarget {
  addEventListener(
    type: 'message',
    listener: (ev: MidiMessageEvent) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: 'message',
    listener: (ev: MidiMessageEvent) => void,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
  dispose(): void;
}

class MidiMessageManager extends EventTarget {
  namespace: string;

  constructor(namespace: string) {
    super();
    this.namespace = namespace;
  }
}

export default MidiMessageManager;
