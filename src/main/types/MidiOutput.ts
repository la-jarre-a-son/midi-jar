import { InternalOutput } from './InternalOutput';
import { MidiOutputDevice } from './MidiOutputDevice';

export type MidiOutput = MidiOutputDevice | InternalOutput;

export { InternalOutput, MidiOutputDevice };
