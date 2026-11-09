import { MidiRouteRaw } from '../midi/MidiRoute';

export type MidiMessage = number[];

export type MidiMessageHandler = (message: MidiMessage, timestamp: number, device: string) => void;

export type Midi = {
  routes: MidiRouteRaw[];
};
