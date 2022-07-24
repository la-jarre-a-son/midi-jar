import { useCallback, useEffect, useReducer } from 'react';
import { Note, Chord, Interval } from '@tonaljs/tonal';

import { MidiMessage } from 'main/types';
import {
  getMidiChannel,
  getMidiCommand,
  getMidiNote,
  getMidiValue,
} from 'renderer/helpers';
import useMidiMessage from './useMidiMessage';

const MIDI_CMD_NOTE_OFF = 0x80;
const MIDI_CMD_NOTE_ON = 0x90;
const MIDI_CHANNEL_ALL = 0;
const MIDI_CMD_CC = 0xb0;
const MIDI_CC_SUSTAIN = 0x40;

const getChordInfo = (chord: string) => {
  const match = chord.match(/^([A-G](b|#)?)([^/]+)(\/([A-G](b|#)?))?$/);
  if (match) {
    const tonic = match[1];
    const type = match[3];
    const root = match[5];
    const c = Chord.getChord(type, tonic);
    const rootInterval = Interval.distance(tonic, root);
    const rootDegree = c.intervals.indexOf(rootInterval) + 1;
    return { ...c, symbol: chord, root, rootInterval, rootDegree };
  }
  return null;
};

const getChords = (notes: string[]) => {
  const chords = Chord.detect(notes).map(getChordInfo);

  return chords;
};

interface Parameters {
  accidentals: 'flat' | 'sharp';
  midiChannel: number;
}

// An enum with all the types of actions to use in our reducer
enum MidiActionTypes {
  NOTE_ON = 'NOTE_ON',
  NOTE_OFF = 'NOTE_OFF',
  SUSTAIN_ON = 'SUSTAIN_ON',
  SUSTAIN_OFF = 'SUSTAIN_OFF',
}

interface MidiAction {
  type: MidiActionTypes;
  midi: number;
}

enum ParametersActionTypes {
  ACCIDENTALS_CHANGED = 'ACCIDENTALS_CHANGED',
}
interface ParametersAction {
  type: ParametersActionTypes;
  value: unknown;
}

type Action = MidiAction | ParametersAction;

// An interface for our state
interface State {
  sustainedMidiNotes: number[];
  playedMidiNotes: number[];
  midiNotes: number[];
  notes: string[];
  chords: ReturnType<typeof getChords>;
  sustained: boolean;
  params: {
    accidentals: 'flat' | 'sharp';
  };
}

// Our reducer function that uses a switch statement to handle our actions
function reducer(state: State, action: Action): State {
  const { type } = action;

  const { accidentals } = state.params;

  const fromMidi =
    accidentals === 'sharp' ? Note.fromMidiSharps : Note.fromMidi;

  switch (type) {
    case ParametersActionTypes.ACCIDENTALS_CHANGED: {
      const newAccidentals = action.value as typeof state.params['accidentals'];
      const notes = state.midiNotes.map((m) =>
        Note.pitchClass(
          newAccidentals === 'sharp' ? Note.fromMidiSharps(m) : Note.fromMidi(m)
        )
      );
      const chords = getChords(notes);

      return {
        ...state,
        notes,
        chords,
        params: {
          ...state.params,
          accidentals: newAccidentals,
        },
      };
    }
    case MidiActionTypes.NOTE_ON: {
      const { midi } = action;
      const playedMidiNotes = [...state.playedMidiNotes, midi];
      const sustainedMidiNotes = state.sustainedMidiNotes.filter(
        (m) => m !== midi
      );
      const midiNotes = [...sustainedMidiNotes, ...playedMidiNotes];
      midiNotes.sort();
      const notes = midiNotes.map((m) => Note.pitchClass(fromMidi(m)));
      const chords = getChords(notes);

      return {
        ...state,
        notes,
        midiNotes,
        sustainedMidiNotes,
        playedMidiNotes,
        chords,
      };
    }
    case MidiActionTypes.NOTE_OFF: {
      const { midi } = action;
      const playedMidiNotes = state.playedMidiNotes.filter((m) => m !== midi);
      const sustainedMidiNotes = state.sustained
        ? [...state.sustainedMidiNotes, midi]
        : state.sustainedMidiNotes;
      const midiNotes = [...sustainedMidiNotes, ...playedMidiNotes];
      midiNotes.sort();
      const notes = midiNotes.map((m) => Note.pitchClass(fromMidi(m)));
      const chords = getChords(notes);
      return {
        ...state,
        notes,
        playedMidiNotes,
        midiNotes,
        sustainedMidiNotes,
        chords,
      };
    }

    case MidiActionTypes.SUSTAIN_ON: {
      return {
        ...state,
        sustained: true,
        sustainedMidiNotes: [],
      };
    }

    case MidiActionTypes.SUSTAIN_OFF: {
      const midiNotes = [...state.playedMidiNotes];
      midiNotes.sort();
      const notes = midiNotes.map((m) => Note.pitchClass(Note.fromMidi(m)));
      const chords = getChords(notes);
      return {
        ...state,
        sustained: false,
        sustainedMidiNotes: [],
        midiNotes,
        notes,
        chords,
      };
    }

    default:
      return state;
  }
}

const defaultState: State = {
  sustainedMidiNotes: [],
  playedMidiNotes: [],
  midiNotes: [],
  notes: [],
  chords: [],
  sustained: false,
  params: {
    accidentals: 'flat',
  },
};

export default function useNotes({
  accidentals = 'flat',
  midiChannel = MIDI_CHANNEL_ALL,
}: Partial<Parameters> = {}) {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    params: {
      accidentals,
    },
  });

  useEffect(() => {
    dispatch({
      type: ParametersActionTypes.ACCIDENTALS_CHANGED,
      value: accidentals,
    });
  }, [accidentals]);

  const onMidiMessage = useCallback(
    (message: MidiMessage) => {
      const cmd = getMidiCommand(message);
      const ch = getMidiChannel(message);
      const midi = getMidiNote(message);
      const value = getMidiValue(message);

      if (
        cmd === MIDI_CMD_NOTE_ON &&
        (midiChannel === MIDI_CHANNEL_ALL || midiChannel === ch)
      ) {
        dispatch({ type: MidiActionTypes.NOTE_ON, midi });
      }

      if (
        cmd === MIDI_CMD_NOTE_OFF &&
        (midiChannel === MIDI_CHANNEL_ALL || midiChannel === ch)
      ) {
        dispatch({ type: MidiActionTypes.NOTE_OFF, midi });
      }

      if (
        cmd === MIDI_CMD_CC &&
        midi === MIDI_CC_SUSTAIN &&
        (midiChannel === MIDI_CHANNEL_ALL || midiChannel === ch)
      ) {
        if (value === 0) {
          dispatch({ type: MidiActionTypes.SUSTAIN_OFF, midi });
        }
        if (value === 127) {
          dispatch({ type: MidiActionTypes.SUSTAIN_ON, midi });
        }
      }
    },
    [midiChannel, dispatch]
  );

  useMidiMessage(onMidiMessage);

  return state;
}
