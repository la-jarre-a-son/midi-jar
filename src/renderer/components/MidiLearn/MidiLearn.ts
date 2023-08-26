import React, { useCallback } from 'react';

import { MidiMessage } from 'main/types';
import useMidiMessage from 'renderer/hooks/useMidiMessage';
import { getMidiChannel, getMidiCommand, getMidiNote } from 'renderer/helpers';

import { MidiLearnProps } from './types';

const MIDI_CMD_NOTE_ON = 0x90;
const MIDI_CHANNEL_ALL = 0;

export const MidiLearn: React.FC<MidiLearnProps> = ({ type, midiChannel, onLearn }) => {
  const handleMessage = useCallback(
    (message: MidiMessage) => {
      const cmd = getMidiCommand(message);
      const ch = getMidiChannel(message);
      const midi = getMidiNote(message);

      if (type === 'note') {
        if (cmd === MIDI_CMD_NOTE_ON && (midiChannel === MIDI_CHANNEL_ALL || midiChannel === ch)) {
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

MidiLearn.defaultProps = {
  midiChannel: MIDI_CHANNEL_ALL,
};

export default MidiLearn;
