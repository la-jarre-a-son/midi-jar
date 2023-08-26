export type MidiMessage = [number, number, number];

export type MidiMessageHandler = (message: MidiMessage, timestamp: number, device: string) => void;
