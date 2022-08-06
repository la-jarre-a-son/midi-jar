import React, { useCallback } from 'react';

import { MidiMessage } from 'main/types';
import useMidiMessage from 'renderer/hooks/useMidiMessage';
import { getMidiChannel, getMidiCommand, getMidiNote } from 'renderer/helpers';

const MIDI_CMD_NOTE_ON = 0x90;
const MIDI_CHANNEL_ALL = 0;

type InputProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'value'>;
type Props = InputProps & {
  type: 'note';
  midiChannel?: number;
  onLearn: (value: number) => unknown;
};

const defaultProps = {
  midiChannel: MIDI_CHANNEL_ALL,
};

const MidiLearn: React.FC<Props> = ({ type, midiChannel, onLearn }) => {
  const handleMessage = useCallback(
    (message: MidiMessage) => {
      const cmd = getMidiCommand(message);
      const ch = getMidiChannel(message);
      const midi = getMidiNote(message);

      if (type === 'note') {
        if (
          cmd === MIDI_CMD_NOTE_ON &&
          (midiChannel === MIDI_CHANNEL_ALL || midiChannel === ch)
        ) {
          if (onLearn) {
            onLearn(midi);
          }
        }
      }
    },
    [type, midiChannel, onLearn]
  );

  useMidiMessage(handleMessage);

  return null;
};

MidiLearn.defaultProps = defaultProps;

export default MidiLearn;
