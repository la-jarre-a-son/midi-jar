import makeDebug from 'debug';
import { EventEmitter } from 'events';
import midi from '@julusian/midi';

import { MidiMessage } from '../types/Midi';
import { InternalOutput } from './InternalOutput';
import { MidiInputDevice } from './MidiInputDevice';
import { MidiOutputDevice } from './MidiOutputDevice';
import { MidiRoute } from './MidiRoute';
import { MidiWire } from './MidiWire';
import { MidiInput } from './MidiInput';
import { MidiOutput } from './MidiOutput';

const debug = makeDebug('app:midi');

const midiIn = new midi.Input();
const midiOut = new midi.Output();

const IGNORE_RTMIDI_REGEX = /RtMidi/i;

const INTERNAL_OUTPUTS = [
  'chord-display/internal',
  'chord-display/overlay',
  'chord-quiz',
  'debugger',
];

export class MidiDeviceManager extends EventEmitter {
  inputs: Map<string, MidiInput>;

  outputs: Map<string, MidiOutput>;

  wires: MidiWire[];

  constructor() {
    super();

    this.inputs = new Map();
    this.outputs = new Map();
    this.wires = [];

    this.createInternalOutputs();
  }

  createInternalOutputs() {
    // eslint-disable-next-line no-restricted-syntax
    for (const name of INTERNAL_OUTPUTS) {
      const output = new InternalOutput(name);
      output.addListener('message', (message: MidiMessage, timestamp: number, device: string) =>
        this.emit('midi', output.name, message, timestamp, device)
      );
      this.outputs.set(name, output);
    }
  }

  refresh() {
    let changed = false;
    changed = this.refreshInputs() || changed;
    changed = this.refreshOutputs() || changed;

    return changed;
  }

  refreshInputs() {
    let changed = false;
    const inputs = [];
    for (let port = 0; port < midiIn.getPortCount(); port += 1) {
      const name = midiIn.getPortName(port);
      if (!name.match(IGNORE_RTMIDI_REGEX)) {
        inputs.push(name);
        const input = this.inputs.get(name);
        if (!input) {
          const newInput = new MidiInputDevice(name, true);
          this.inputs.set(name, newInput);
          newInput.addListener('latency', (latency: number) =>
            this.emit('activity', latency, name)
          );
          changed = true;
        } else if (input instanceof MidiInputDevice && !input.connected) {
          input.connected = true;
          changed = true;
        }
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const input of this.inputs.values()) {
      if (inputs.indexOf(input.name) <= -1) {
        if (input instanceof MidiInputDevice && input.connected) {
          input.connected = false;
          input.close();
          changed = true;
        }
      }
    }
    return changed;
  }

  refreshOutputs() {
    let changed = false;
    const outputs = [];
    for (let port = 0; port < midiOut.getPortCount(); port += 1) {
      const name = midiOut.getPortName(port);
      if (!name.match(IGNORE_RTMIDI_REGEX)) {
        outputs.push(name);
        const output = this.outputs.get(name);
        if (!output) {
          this.outputs.set(name, new MidiOutputDevice(midiOut.getPortName(port), true));
          changed = true;
        } else if (output instanceof MidiOutputDevice && !output.connected) {
          output.connected = true;
          changed = true;
        }
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const output of this.outputs.values()) {
      if (outputs.indexOf(output.name) <= -1) {
        if (output instanceof MidiOutputDevice && output.connected) {
          output.connected = false;
          output.close();
          changed = true;
        }
      }
    }

    return changed;
  }

  getOrCreateInput(name: string) {
    const input = this.inputs.get(name);

    if (!input) {
      const newInput = new MidiInputDevice(name, false);
      this.inputs.set(name, newInput);

      return newInput;
    }
    return input;
  }

  getOrCreateOutput(name: string, type: MidiRoute['type']) {
    const output = this.outputs.get(name);

    if (!output) {
      switch (type) {
        case 'internal': {
          const newOutput = new InternalOutput(name);
          this.outputs.set(name, newOutput);
          return newOutput;
        }
        default: {
          const newOutput = new MidiOutputDevice(name, false);
          this.outputs.set(name, newOutput);
          return newOutput;
        }
      }
    }
    return output;
  }

  routeMidi(routes: MidiRoute[]) {
    const previousWires = this.wires;

    this.wires = [];
    for (let r = 0; r < routes.length; r += 1) {
      const route = routes[r];
      if (route.enabled) {
        const input = this.getOrCreateInput(route.input);
        const output = this.getOrCreateOutput(route.output, route.type);
        const wire = new MidiWire(routes[r]);
        wire.plug(input, output);
        this.wires.push(wire);
      }
    }

    for (let w = 0; w < previousWires.length; w += 1) {
      previousWires[w].unplug();
    }

    debug('Routing updated');

    this.emit('refreshed');
  }

  getInputs() {
    return Array.from(this.inputs.values());
  }

  getOutputs() {
    return Array.from(this.outputs.values());
  }

  getWires() {
    return Array.from(this.wires);
  }
}
