import { useCallback, useEffect, useReducer } from 'react';
import { Note, Chord, Interval } from 'tonal';

import { MidiMessage } from 'main/types';
import {
  getMidiChannel,
  getMidiCommand,
  getMidiNote,
  getMidiValue,
  getKeySignature,
  getNoteInKeySignature,
  KeySignatureConfig,
  tokenizeChord,
} from 'renderer/helpers';

import { detect } from 'renderer/helpers/chord-detect';

import useMidiMessage from './useMidiMessage';

const MIDI_CMD_NOTE_OFF = 0x80;
const MIDI_CMD_NOTE_ON = 0x90;
const MIDI_CHANNEL_ALL = 0;
const MIDI_CMD_CC = 0xb0;
const MIDI_CC_SUSTAIN = 0x40;

const getChordInfo = (chord: string, keySignatureNotes: string[]) => {
  const [tonic, type, root] = tokenizeChord(chord);
  if (tonic) {
    const tonicInKey = getNoteInKeySignature(tonic, keySignatureNotes);
    const rootInKey = getNoteInKeySignature(root, keySignatureNotes);
    const c = Chord.getChord(type, tonicInKey);
    const rootInterval = Interval.distance(tonicInKey, rootInKey);
    const rootDegree = c.intervals.indexOf(rootInterval) + 1;
    return { ...c, symbol: chord, root, rootInterval, rootDegree };
  }

  return null;
};

const getChords = (notes: string[], keySignatureNotes: string[], allowOmissions: boolean) => {
  const chords = detect(notes, { allowOmissions }).map((n) => getChordInfo(n, keySignatureNotes));

  return chords;
};

const midiSortCompareFn = (a: number, b: number) => a - b;

interface Parameters {
  accidentals: 'flat' | 'sharp';
  key: string;
  midiChannel: number;
  allowOmissions: boolean;
}

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
  ALLOW_OMISSIONS_CHANGED = 'ALLOW_OMISSIONS_CHANGED',
}

interface ParametersAction {
  type: ParametersActionTypes;
  value: unknown;
}

type Action = MidiAction | ParametersAction;

interface State {
  sustainedMidiNotes: number[];
  playedMidiNotes: number[];
  midiNotes: number[];
  notes: string[];
  pitchClasses: string[];
  chords: ReturnType<typeof getChords>;
  sustained: boolean;
  keySignature: KeySignatureConfig;
  allowOmissions: boolean;
}

function reducer(state: State, action: Action): State {
  const { type } = action;

  const { notes: keySignatureNotes } = state.keySignature;

  const fromMidi = (m: number) => getNoteInKeySignature(Note.fromMidi(m), keySignatureNotes);

  switch (type) {
    case ParametersActionTypes.KEY_SIGNATURE_CHANGED: {
      const keySignature = action.value as typeof state.keySignature;
      const notes = state.midiNotes.map((m: number) =>
        getNoteInKeySignature(Note.fromMidi(m), keySignature.notes)
      );
      const pitchClasses = notes.map(Note.pitchClass);
      const chords = getChords(notes, keySignature.notes, state.allowOmissions);

      return {
        ...state,
        notes,
        pitchClasses,
        chords,
        keySignature,
      };
    }
    case ParametersActionTypes.ALLOW_OMISSIONS_CHANGED: {
      const allowOmissions = action.value as typeof state.allowOmissions;
      const chords = getChords(state.notes, keySignatureNotes, allowOmissions);

      return {
        ...state,
        allowOmissions,
        chords,
      };
    }
    case MidiActionTypes.NOTE_ON: {
      const { midi } = action;
      const playedMidiNotes = [...state.playedMidiNotes, midi];
      const sustainedMidiNotes = state.sustainedMidiNotes.filter((m) => m !== midi);
      const midiNotes = [...sustainedMidiNotes, ...playedMidiNotes];
      midiNotes.sort(midiSortCompareFn);
      const notes = midiNotes.map(fromMidi);
      const pitchClasses = notes.map(Note.pitchClass);
      const chords = getChords(notes, keySignatureNotes, state.allowOmissions);

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
      const chords = getChords(notes, keySignatureNotes, state.allowOmissions);

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
      const chords = getChords(notes, keySignatureNotes, state.allowOmissions);
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
  allowOmissions: false,
};

export default function useNotes({
  accidentals = 'flat',
  key = 'C',
  midiChannel = MIDI_CHANNEL_ALL,
  allowOmissions = false,
}: Partial<Parameters> = {}) {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    keySignature: getKeySignature(key, accidentals === 'sharp'),
    allowOmissions,
  });

  useEffect(() => {
    dispatch({
      type: ParametersActionTypes.KEY_SIGNATURE_CHANGED,
      value: getKeySignature(key, accidentals === 'sharp'),
    });
  }, [accidentals, key]);

  useEffect(() => {
    dispatch({
      type: ParametersActionTypes.ALLOW_OMISSIONS_CHANGED,
      value: allowOmissions,
    });
  }, [allowOmissions]);

  const onMidiMessage = useCallback(
    (message: MidiMessage) => {
      const cmd = getMidiCommand(message);
      const ch = getMidiChannel(message);
      const midi = getMidiNote(message);
      const value = getMidiValue(message);

      if (
        cmd === MIDI_CMD_NOTE_ON &&
        value !== 0 &&
        (midiChannel === MIDI_CHANNEL_ALL || midiChannel === ch)
      ) {
        dispatch({ type: MidiActionTypes.NOTE_ON, midi });
      }

      if (
        (cmd === MIDI_CMD_NOTE_OFF || (cmd === MIDI_CMD_NOTE_ON && value === 0)) && // MIDI RUNNING MODE => ALWAYS NOTE_ON messages with velocity 0
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
