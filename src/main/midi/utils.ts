import { getSettings } from '../settings';
import { InternalOutput, MidiOutput } from './MidiOutput';

export function getModuleOutputs() {
  let moduleOutputs = ['chord-dictionary', 'chord-quiz', 'circle-of-fifths', 'debugger'];
  const chordDisplayOutputs = getSettings().chordDisplay.map(
    (module) => `chord-display/${module.id}`
  );

  moduleOutputs = moduleOutputs.concat(chordDisplayOutputs);

  return moduleOutputs;
}

export function sortOutputsFn(a: MidiOutput, b: MidiOutput) {
  if (a instanceof InternalOutput && b instanceof InternalOutput) {
    return a.name < b.name ? -1 : 1;
  }

  if (a instanceof InternalOutput) {
    return -1;
  }

  if (b instanceof InternalOutput) {
    return 1;
  }

  return a.name < b.name ? -1 : 1;
}
