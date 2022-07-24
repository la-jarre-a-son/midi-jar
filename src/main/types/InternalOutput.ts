import makeDebug from 'debug';
import { EventEmitter } from 'events';
import { MidiMessageHandler, MidiMessage } from './MidiMessage';
import { ApiMidiOutput } from './api';

const debug = makeDebug('app:midi:InternalOutput');

declare interface InternalOutput {
  on(
    event: 'message',
    listener: (message: MidiMessage, timestamp: number, device: string) => void
  ): this;
}

class InternalOutput extends EventEmitter {
  name: string;

  handlers: MidiMessageHandler[];

  constructor(name: string) {
    super();
    this.name = name;

    this.handlers = [];
  }

  send(message: MidiMessage, timestamp: number, device: string) {
    process.nextTick(() => {
      this.emit('message', message, timestamp, device);
      for (let i = 0; i < this.handlers.length; i += 1) {
        this.handlers[i](message, timestamp, device);
      }
      debug(`[${this.name}]`, 'Forwarded from', device, message);
    });
  }

  register(handler: MidiMessageHandler) {
    if (handler) {
      this.handlers.push(handler);
    }
  }

  unregister(handler: MidiMessageHandler) {
    if (handler) {
      const i = this.handlers.indexOf(handler);
      if (i >= 0) {
        this.handlers.splice(i, 1);
      }
    }
  }

  toApi(): ApiMidiOutput {
    return {
      name: this.name,
      type: 'internal',
      opened: true,
      connected: true,
      error: false,
    };
  }
}

export default InternalOutput;
