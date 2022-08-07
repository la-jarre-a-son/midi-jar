import { MidiMessage } from 'main/types';
import {
  getMidiCommand,
  getMidiChannel,
  getMidiNote,
  getMidiValue,
  getMidiMultiWordValue,
} from 'renderer/helpers';
import { MIDI_CMD, MIDI_CC } from './constants';

// eslint-disable-next-line import/prefer-default-export
export function formatMidiMessage(m: MidiMessage) {
  const cmd = getMidiCommand(m) as keyof typeof MIDI_CMD;
  const ch = getMidiChannel(m);
  const note = getMidiNote(m);
  const value = getMidiValue(m);

  if (cmd === 0xb0) {
    const cc = note as keyof typeof MIDI_CC;
    return `channel ${ch} - ${cmd}:${MIDI_CMD[cmd]}  - CC ${cc} ${MIDI_CC[cc]} - ${value}`;
  }
  if (cmd === 0xc0) {
    return `channel ${ch} - ${cmd}:${MIDI_CMD[cmd]}  - program ${note}`;
  }
  if (cmd === 0xd0) {
    return `channel ${ch} - ${cmd}:${MIDI_CMD[cmd]}  - pressure ${note}`;
  }
  if (cmd === 0xe0) {
    const pitch = getMidiMultiWordValue(m);
    return `channel ${ch} - ${cmd}:${MIDI_CMD[cmd]}  - pitch ${pitch}`;
  }
  if (cmd === 0xf0) {
    const fCmd = m[0] as keyof typeof MIDI_CMD;
    if (m[0] === 0xf2) {
      return `${m[0]}:${MIDI_CMD[fCmd]} - position ${getMidiMultiWordValue(m)}`;
    }
    return `${m[0]}:${MIDI_CMD[fCmd]}${note ? ` - ${note}` : ''}${
      value ? ` - ${value}` : ''
    }`;
  }

  return `channel ${ch} - ${cmd}:${MIDI_CMD[cmd]} - note ${note} - ${value} `;
}
