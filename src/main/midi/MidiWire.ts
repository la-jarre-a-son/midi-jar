/* eslint-disable no-bitwise -- MIDI status bytes require bit masks. */
import makeDebug from 'debug';
import { EventEmitter } from 'events';

import { MidiMessage } from '../types/Midi';
import { ApiMidiWire } from '../types/api';

import { MidiRoute } from './MidiRoute';
import { MidiInput } from './MidiInput';
import { MidiOutput } from './MidiOutput';

const debug = makeDebug('app:midi:MidiWire');

export class MidiWire extends EventEmitter {
  route: MidiRoute;

  connected = false;

  input: MidiInput | null = null;

  output: MidiOutput | null = null;

  currentChannel: number | null = null;

  constructor(route: MidiRoute) {
    super();
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
    const status = Number(message[0]) & 0xff;

    // Only 0x80-0xEF are MIDI Channel Voice status bytes.
    // System Common, SysEx and System Real-Time messages have no channel nibble.
    if (status >= 0x80 && status <= 0xef) {
      const nextChannel = (status & 0x0f) + 1;
      if (nextChannel !== this.currentChannel) {
        this.currentChannel = nextChannel;
        this.emit('channel', this.currentChannel);
      }
    }

    if (!this.output) return;

    // Support the generic channel map and the legacy CH2 -> CH1 setting.
    const channelMap =
      this.route.channelMap || (this.route.mapChannel2To1 ? { from: 2, to: 1 } : undefined);

    if (channelMap && status >= 0x80 && status <= 0xef && (status & 0x0f) === channelMap.from - 1) {
      // Preserve the original MIDI message length (e.g. Program Change is 2 bytes).
      const outgoing: MidiMessage = [
        (status & 0xf0) | ((channelMap.to - 1) & 0x0f),
        ...message.slice(1),
      ];
      this.output.send(outgoing, timestamp, device);
      return;
    }

    this.output.send(message, timestamp, device);
  }

  // eslint-disable-next-line class-methods-use-this
  receive(_message: MidiMessage, _timestamp: number, _device: string) {
    // debug(`Wire output received from "${device}":`, message);
  }

  toApi(): ApiMidiWire {
    return {
      route: this.route.toApi(),
      connected: this.connected,
      currentChannel: this.currentChannel,
    };
  }
}

export default MidiWire;
