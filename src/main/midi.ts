import os from 'os';
import makeDebug from 'debug';
import midi from 'midi';
import { EventEmitter } from 'events';
import { getMidiRoutes, setMidiRoutes } from './settings';

import {
  MidiMessage,
  MidiInputDevice,
  MidiOutputDevice,
  MidiRoute,
  MidiWire,
  InternalOutput,
  WebsocketOutput,
} from './types';

const debug = makeDebug('app:midi');

os.setPriority(19);

export const eventsEmitter = new EventEmitter();

const midiIn = new midi.Input();
const midiOut = new midi.Output();
const REFRESH_LOOP_TIMEOUT = 100;
let previousMidiInCount = 0;
let previousMidiOutCount = 0;
let loopTimeout: ReturnType<typeof setTimeout> | null = null;

const internalOutputs = [
  new InternalOutput('chord-display'),
  new InternalOutput('debugger'),
];

const websocketOutputs = [new WebsocketOutput('chord-display')];

let inputs: MidiInputDevice[] = [];
let disconnectedInputs: MidiInputDevice[] = [];
let outputs: MidiOutputDevice[] = [];
let disconnectedOutputs: MidiOutputDevice[] = [];
let wires: MidiWire[] = [];

function bindInternalOutputs() {
  internalOutputs.forEach((output) => {
    output.addListener(
      'message',
      (message: MidiMessage, timestamp: number, device: string) =>
        eventsEmitter.emit('midi', output.name, message, timestamp, device)
    );
  });
}

function bindInputs() {
  inputs.forEach((input) => {
    input.addListener('latency', (latency: number) =>
      eventsEmitter.emit('activity', latency, input.name)
    );
  });
}

function refreshInputDevices(force = false): boolean {
  const count = midiIn.getPortCount();

  if (force || count !== previousMidiInCount) {
    for (let i = 0; i < inputs.length; i += 1) {
      inputs[i].close();
      inputs[i].removeAllListeners();
    }
    inputs = [];

    for (let port = 0; port < count; port += 1) {
      inputs.push(new MidiInputDevice(midiIn.getPortName(port), true));
    }

    previousMidiInCount = count;
    debug('Inputs changed, count =', count);
    return true;
  }
  return false;
}

function refreshOutputDevices(force = false): boolean {
  const count = midiOut.getPortCount();

  if (force || count !== previousMidiOutCount) {
    for (let i = 0; i < outputs.length; i += 1) {
      outputs[i].close();
    }
    outputs = [];

    for (let port = 0; port < count; port += 1) {
      outputs.push(new MidiOutputDevice(midiOut.getPortName(port), true));
    }

    previousMidiOutCount = count;
    debug('Outputs changed, count =', count);
    return true;
  }

  return false;
}

function refreshDisconnectedDevices() {
  const routes = getMidiRoutes();

  const disconnected = routes.reduce(
    (s, route) => {
      if (!inputs.find((i) => i.name === route.input)) {
        s.inputs.add(route.input);
      }
      if (
        route.type === 'physical' &&
        !outputs.find((o) => o.name === route.output)
      ) {
        s.outputs.add(route.output);
      }

      return s;
    },
    { inputs: new Set<string>(), outputs: new Set<string>() }
  );

  disconnectedInputs = Array.from(disconnected.inputs).map(
    (name) => new MidiInputDevice(name, false)
  );
  disconnectedOutputs = Array.from(disconnected.outputs).map(
    (name) => new MidiOutputDevice(name, false)
  );
}

function routeMidi() {
  const routes = getMidiRoutes();

  for (let w = 0; w < wires.length; w += 1) {
    wires[w].unplug();
  }
  debug('Wires unplugged');
  wires = [];
  for (let r = 0; r < routes.length; r += 1) {
    if (routes[r].enabled) {
      const wire = new MidiWire(routes[r]);
      wire.plug(inputs, outputs, internalOutputs, websocketOutputs);
      wires.push(wire);
    }
  }
  debug('Routing updated');
  eventsEmitter.emit('refreshed');
}

export function addRoute(route: MidiRoute) {
  debug('Adding route', route);
  const routes = getMidiRoutes();

  const existingRoute = routes.find((r) => r.isSame(route));

  if (!existingRoute) {
    setMidiRoutes([...routes, route]);
    debug('Added route', route);
  }
  routeMidi();
}

export function deleteRoute(route: MidiRoute) {
  const routes = getMidiRoutes();
  setMidiRoutes(routes.filter((r) => !r.isSame(route)));
  debug('Deleted route', route);
  routeMidi();
}

export function clearRoutes() {
  setMidiRoutes([]);
  routeMidi();
}

export function refreshDevices(force = false) {
  const outputChanged = refreshOutputDevices(force);
  const inputChanged = refreshInputDevices(force);
  if (force || outputChanged || inputChanged) {
    refreshDisconnectedDevices();
    bindInputs();
    routeMidi();
  }
}

export function startRefreshLoop() {
  refreshDevices();
  loopTimeout = setTimeout(startRefreshLoop, REFRESH_LOOP_TIMEOUT);
}

export function stopRefreshLoop() {
  if (loopTimeout) clearTimeout(loopTimeout);
  loopTimeout = null;
}

export function getInputs() {
  return [...inputs, ...disconnectedInputs];
}

export function getOutputs() {
  return [
    ...internalOutputs,
    ...websocketOutputs,
    ...outputs,
    ...disconnectedOutputs,
  ];
}

export function getWires() {
  return wires;
}

bindInternalOutputs();
