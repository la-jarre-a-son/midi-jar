import makeDebug from 'debug';
import { EventEmitter } from 'events';
import midi, { Input } from '@julusian/midi';
import { MidiMessageHandler, MidiMessage } from './MidiMessage';
import { ApiMidiInput } from './api';

const debug = makeDebug('app:midi:MidiInputDevice');

class MidiInputDevice extends EventEmitter {
  input: Input;

  handlers: MidiMessageHandler[];

  name: string;

  connected: boolean;

  error: boolean;

  port: number | null;

  i: number = 0;

  constructor(name: string, connected: boolean) {
    super();
    this.name = name;
    this.connected = connected;
    this.error = false;
    this.port = null;
    this.input = new midi.Input();
    this.handlers = [];

    this.input.on('message', this.onMessage.bind(this));
    this.input.ignoreTypes(false, false, false);
  }

  open() {
    if (this.input.isPortOpen()) return;
    for (let port = 0; port < this.input.getPortCount(); port += 1) {
      if (this.input.getPortName(port) === this.name) {
        debug(`Connecting to ${this.name} port ${port}`);
        try {
          this.input.openPort(port);
          this.port = port;
          this.error = !this.input.isPortOpen();
        } catch (err) {
          debug(
            `Cannot connect to ${this.name} port ${port}${
              err instanceof Error && err.message ? `: ${err.message}` : ''
            }`
          );
          this.error = true;
        }
      }
    }
  }

  close() {
    if (this.input.isPortOpen()) this.input.closePort();
  }

  onMessage(_deltaTime: number, message: MidiMessage) {
    const timestamp = performance.now();
    for (let i = 0; i < this.handlers.length; i += 1) {
      this.handlers[i](message, timestamp, this.name);
    }
    const latency = performance.now() - timestamp;
    this.emit('latency', latency);
    debug(`[${this.name}]`, 'Received', message, latency);
  }

  register(handler: MidiMessageHandler) {
    if (handler) {
      this.handlers.push(handler);
    }
    if (this.handlers.length) {
      this.open();
    }
  }

  unregister(handler: MidiMessageHandler) {
    if (handler) {
      const i = this.handlers.indexOf(handler);
      if (i >= 0) {
        this.handlers.splice(i, 1);
      }
    }
    if (!this.handlers.length) {
      this.close();
    }
  }

  toApi(): ApiMidiInput {
    return {
      name: this.name,
      opened: this.input.isPortOpen(),
      connected: this.connected,
      error: this.error,
    };
  }
}

export default MidiInputDevice;
