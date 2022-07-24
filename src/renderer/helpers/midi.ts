/* eslint-disable no-bitwise */
import { MidiMessage } from 'main/types';

export const getMidiCommand = (m: MidiMessage) => (m[0] >> 4) << 4;

export const getMidiChannel = (m: MidiMessage) => (m[0] & 0xf) + 1;

export const getMidiNote = (m: MidiMessage) => m[1];

export const getMidiValue = (m: MidiMessage) => m[2];

// MSB and LSB values
export const getMidiMultiWordValue = (m: MidiMessage) => m[2] * 128 + m[1];
