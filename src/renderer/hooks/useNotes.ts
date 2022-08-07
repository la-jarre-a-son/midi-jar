import { useCallback, useEffect, useReducer } from 'react';
import { Note, Chord, Interval } from '@tonaljs/tonal';

import { MidiMessage } from 'main/types';
import {
  getMidiChannel,
  getMidiCommand,
  getMidiNote,
  getMidiValue,
} from 'renderer/helpers';
import {
  getKeySignature,
  getNoteInKeySignature,
  KeySignatureConfig,
} from 'renderer/helpers/note';
import useMidiMessage from './useMidiMessage';

const MIDI_CMD_NOTE_OFF = 0x80;
const MIDI_CMD_NOTE_ON = 0x90;
const MIDI_CHANNEL_ALL = 0;
const MIDI_CMD_CC = 0xb0;
const MIDI_CC_SUSTAIN = 0x40;

const getChordInfo = (chord: string, keySignatureNotes: string[]) => {
  const match = chord.match(/^([A-G](b|#)?)([^/]+)(\/([A-G](b|#)?))?$/);
  if (match) {
    const tonic = getNoteInKeySignature(match[1], keySignatureNotes);
    const type = match[3];
    const root = getNoteInKeySignature(match[5], keySignatureNotes);
    const c = Chord.getChord(type, tonic);
    const rootInterval = Interval.distance(tonic, root);
    const rootDegree = c.intervals.indexOf(rootInterval) + 1;
    return { ...c, symbol: chord, root, rootInterval, rootDegree };
  }
  return null;
};

const getChords = (notes: string[], keySignatureNotes: string[]) => {
  const chords = Chord.detect(notes).map((n) =>
    getChordInfo(n, keySignatureNotes)
  );

  return chords;
};

const midiSortCompareFn = (a: number, b: number) => a - b;

interface Parameters {
  accidentals: 'flat' | 'sharp';
  key: string;
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
  KEY_SIGNATURE_CHANGED = 'KEY_SIGNATURE_CHANGED',
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
  pitchClasses: string[];
  chords: ReturnType<typeof getChords>;
  sustained: boolean;
  keySignature: KeySignatureConfig;
}

// Our reducer function that uses a switch statement to handle our actions
function reducer(state: State, action: Action): State {
  const { type } = action;

  const { notes: keySignatureNotes } = state.keySignature;

  const fromMidi = (m: number) =>
    getNoteInKeySignature(Note.fromMidi(m), keySignatureNotes);

  switch (type) {
    case ParametersActionTypes.KEY_SIGNATURE_CHANGED: {
      const keySignature = action.value as typeof state.keySignature;
      const notes = state.midiNotes.map((m: number) =>
        getNoteInKeySignature(Note.fromMidi(m), keySignature.notes)
      );
      const pitchClasses = notes.map(Note.pitchClass);
      const chords = getChords(notes, keySignature.notes);

      return {
        ...state,
        notes,
        pitchClasses,
        chords,
        keySignature,
      };
    }
    case MidiActionTypes.NOTE_ON: {
      const { midi } = action;
      const playedMidiNotes = [...state.playedMidiNotes, midi];
      const sustainedMidiNotes = state.sustainedMidiNotes.filter(
        (m) => m !== midi
      );
      const midiNotes = [...sustainedMidiNotes, ...playedMidiNotes];
      midiNotes.sort(midiSortCompareFn);
      const notes = midiNotes.map(fromMidi);
      const pitchClasses = notes.map(Note.pitchClass);
      const chords = getChords(notes, keySignatureNotes);

      return {
        ...state,
        notes,
        pitchClasses,
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
      midiNotes.sort(midiSortCompareFn);
      const notes = midiNotes.map(fromMidi);
      const pitchClasses = notes.map(Note.pitchClass);
      const chords = getChords(notes, keySignatureNotes);

      return {
        ...state,
        notes,
        pitchClasses,
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
      midiNotes.sort(midiSortCompareFn);
      const notes = midiNotes.map(fromMidi);
      const pitchClasses = notes.map(Note.pitchClass);
      const chords = getChords(notes, keySignatureNotes);
      return {
        ...state,
        sustained: false,
        sustainedMidiNotes: [],
        midiNotes,
        notes,
        pitchClasses,
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
  pitchClasses: [],
  chords: [],
  sustained: false,
  keySignature: getKeySignature('C'),
};

export default function useNotes({
  accidentals = 'flat',
  key = 'C',
  midiChannel = MIDI_CHANNEL_ALL,
}: Partial<Parameters> = {}) {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    keySignature: getKeySignature(key, accidentals === 'sharp'),
  });

  useEffect(() => {
    dispatch({
      type: ParametersActionTypes.KEY_SIGNATURE_CHANGED,
      value: getKeySignature(key, accidentals === 'sharp'),
    });
  }, [accidentals, key]);

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
