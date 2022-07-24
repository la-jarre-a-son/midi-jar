export type MidiMessageHandler = (
  message: MidiMessage,
  timestamp: number,
  device: string
) => void;

export type MidiMessage = [number, number, number];
