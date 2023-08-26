export type MidiLearnProps = {
  type: 'note';
  midiChannel?: number;
  onLearn: (value: number) => unknown;
};
