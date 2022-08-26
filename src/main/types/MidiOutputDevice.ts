import makeDebug from 'debug';
import midi, { Output } from 'midi';

import { MidiMessageHandler, MidiMessage } from './MidiMessage';
import { ApiMidiOutput } from './api';

const debug = makeDebug('app:midi:MidiOutputDevice');

class MidiOutputDevice {
  output: Output;

  name: string;

  connected: boolean;

  error: boolean;

  port: number | null;

  handlers: MidiMessageHandler[];

  constructor(name: string, connected: boolean) {
    this.name = name;
    this.port = null;
    this.connected = connected;
    this.error = false;
    this.output = new midi.Output();
    this.handlers = [];
  }

  open() {
    if (this.output.isPortOpen()) return;
    for (let port = 0; port < this.output.getPortCount(); port += 1) {
      if (this.output.getPortName(port) === this.name) {
        debug(`Connecting to ${this.name} port ${port}`);
        this.output.openPort(port);
        this.port = port;
        this.error = !this.output.isPortOpen();
      }
    }
  }

  close() {
    if (this.output.isPortOpen()) this.output.closePort();
  }

  send(message: MidiMessage, timestamp: number, device: string) {
    this.output.sendMessage(message);
    process.nextTick(() => {
      for (let i = 0; i < this.handlers.length; i += 1) {
        this.handlers[i](message, timestamp, this.name);
      }
      debug(`[${this.name}]`, 'Forwarded from', device, message);
    });
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

  toApi(): ApiMidiOutput {
    return {
      name: this.name,
      type: 'physical',
      opened: this.output.isPortOpen(),
      connected: this.connected,
      error: this.error,
    };
  }
}

export default MidiOutputDevice;