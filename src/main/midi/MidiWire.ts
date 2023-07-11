import makeDebug from 'debug';

import { MidiMessage } from '../types/Midi';
import { ApiMidiWire } from '../types/api';

import { MidiRoute } from './MidiRoute';
import { MidiInput } from './MidiInput';
import { MidiOutput } from './MidiOutput';

const debug = makeDebug('app:midi:MidiWire');

export class MidiWire {
  route: MidiRoute;

  connected = false;

  input: MidiInput | null = null;

  output: MidiOutput | null = null;

  constructor(route: MidiRoute) {
    this.route = route;

    this.send = this.send.bind(this);
    this.receive = this.receive.bind(this);
  }

  plug(input: MidiInput, output: MidiOutput) {
    this.input = input;
    this.output = output;

    if (this.input && this.output) {
      debug(`Plug "${this.input.name}" to "${this.output.name}"`);
      this.input.register(this.send);
      this.output.register(this.receive);
      this.connected = true;
    } else {
      this.connected = false;
    }
  }

  unplug() {
    if (this.input) {
      this.input.unregister(this.send);
    }
    if (this.output) {
      this.output.unregister(this.receive);
    }
    this.connected = false;
    this.input = null;
    this.output = null;
  }

  send(message: MidiMessage, timestamp: number, device: string) {
    if (this.output) {
      this.output.send(message, timestamp, device);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  receive(_message: MidiMessage, _timestamp: number, _device: string) {
    // debug(`Wire output received from "${device}":`, message);
  }

  toApi(): ApiMidiWire {
    return { route: this.route.toApi(), connected: this.connected };
  }
}

export default MidiWire;
