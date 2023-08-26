import os from 'os';
import makeDebug from 'debug';
import { getMidiRoutes, setMidiRoutes } from './settings';

import { MidiRoute } from './types';
import { MidiDeviceManager } from './MidiDeviceManager';

const debug = makeDebug('app:midi');

os.setPriority(19);

export const manager = new MidiDeviceManager();

const REFRESH_LOOP_TIMEOUT = 100;

let loopTimeout: ReturnType<typeof setTimeout> | null = null;

function routeMidi() {
  const routes = getMidiRoutes();

  manager.routeMidi(routes);
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
  const changed = manager.refresh();

  if (changed || force) {
    debug('Devices changed');
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
  return manager.getInputs();
}

export function getOutputs() {
  return manager.getOutputs();
}

export function getWires() {
  return manager.getWires();
}
