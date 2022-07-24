import makeDebug from 'debug';
import { MidiMessage } from 'midi';
import MidiInputDevice from './MidiInputDevice';
import MidiOutputDevice from './MidiOutputDevice';
import InternalOutput from './InternalOutput';
import WebsocketOutput from './WebsocketOutput';
import { MidiRoute } from './MidiRoute';

import { ApiMidiWire } from './api';

const debug = makeDebug('app:midi:MidiWire');

class MidiWire {
  route: MidiRoute;

  connected: boolean = false;

  input: MidiInputDevice | null = null;

  output: MidiOutputDevice | InternalOutput | WebsocketOutput | null = null;

  constructor(route: MidiRoute) {
    this.route = route;

    this.send = this.send.bind(this);
    this.receive = this.receive.bind(this);
  }

  plug(
    inputs: MidiInputDevice[],
    outputs: MidiOutputDevice[],
    internalOutputs: InternalOutput[],
    websocketOutputs: WebsocketOutput[]
  ) {
    if (this.route?.type === 'physical') {
      this.input = inputs.find((i) => i.name === this.route.input) ?? null;
      this.output = outputs.find((o) => o.name === this.route.output) ?? null;

      if (
        this.input &&
        this.output &&
        this.output instanceof MidiOutputDevice
      ) {
        debug(`Plug "${this.input.name}" to pyhsical "${this.output.name}"`);
        this.input.register(this.send);
        this.output.register(this.receive);
        this.connected = true;
      }
    }

    if (this.route?.type === 'internal') {
      this.input = inputs.find((i) => i.name === this.route.input) ?? null;
      this.output =
        internalOutputs.find((o) => o.name === this.route.output) ?? null;

      if (this.input && this.output) {
        debug(`Plug "${this.input.name}" to internal "${this.output.name}"`);
        this.input.register(this.send);
        this.output.register(this.receive);
        this.connected = true;
      }
    }

    if (this.route?.type === 'websocket') {
      this.input = inputs.find((i) => i.name === this.route.input) ?? null;
      this.output =
        websocketOutputs.find((o) => o.name === this.route.output) ?? null;

      if (this.input && this.output) {
        debug(`Plug "${this.input.name}" to websocket "${this.output.name}"`);
        this.input.register(this.send);
        this.output.register(this.receive);
        this.connected = true;
      }
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
