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

const getChords = (
  notes: string[],
  keySignatureNotes: string[],
  allowOmissions: boolean,
  disabledChords: string[] = []
) => {
  const chords = detect(notes, { allowOmissions, disabledChords }).map((n) =>
    getChordInfo(n, keySignatureNotes)
  );

  return chords;
};

const midiSortCompareFn = (a: number, b: number) => a - b;

interface Parameters {
  accidentals: 'flat' | 'sharp';
  key: string;
  midiChannel: number;
  allowOmissions: boolean;
  useSustain: boolean;
  detectOnRelease: boolean;
  disabledChords: string[];
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
  USE_SUSTAIN_CHANGED = 'USE_SUSTAIN_CHANGED',
  DETECT_ON_RELEASE_CHANGED = 'DETECT_ON_RELEASE_CHANGED',
  DISABLED_CHORDS_CHANGED = 'DISABLED_CHORDS_CHANGED',
}

interface ParametersAction {
  type: ParametersActionTypes;
  value: unknown;
}

type Action = MidiAction | ParametersAction;

interface State {
  params: {
    keySignature: KeySignatureConfig;
    allowOmissions: boolean;
    useSustain: boolean;
    detectOnRelease: boolean;
    disabledChords?: string[];
  };
  sustainedMidiNotes: number[];
  playedMidiNotes: number[];
  midiNotes: number[];
  notes: string[];
  pitchClasses: string[];
  chords: ReturnType<typeof getChords>;
  sustained: boolean;
}

function reducer(state: State, action: Action): State {
  const { type } = action;

  const { notes: keySignatureNotes } = state.params.keySignature;

  const fromMidi = (m: number) => getNoteInKeySignature(Note.fromMidi(m), keySignatureNotes);

  switch (type) {
    case ParametersActionTypes.KEY_SIGNATURE_CHANGED: {
      const keySignature = action.value as typeof state.params.keySignature;
      const notes = state.midiNotes.map((m: number) =>
        getNoteInKeySignature(Note.fromMidi(m), keySignature.notes)
      );
      const pitchClasses = notes.map(Note.pitchClass);
      const chords = getChords(
        notes,
        keySignature.notes,
        state.params.allowOmissions,
        state.params.disabledChords
      );

      return {
        ...state,
        params: {
          ...state.params,
          keySignature,
        },
        notes,
        pitchClasses,
        chords,
      };
    }
    case ParametersActionTypes.ALLOW_OMISSIONS_CHANGED: {
      const allowOmissions = action.value as typeof state.params.allowOmissions;
      const chords = getChords(
        state.notes,
        keySignatureNotes,
        allowOmissions,
        state.params.disabledChords
      );

      return {
        ...state,
        params: {
          ...state.params,
          allowOmissions,
        },
        chords,
      };
    }
    case ParametersActionTypes.DISABLED_CHORDS_CHANGED: {
      const disabledChords = action.value as typeof state.params.disabledChords;
      const chords = getChords(
        state.notes,
        keySignatureNotes,
        state.params.allowOmissions,
        disabledChords
      );

      return {
        ...state,
        params: {
          ...state.params,
          disabledChords,
        },
        chords,
      };
    }
    case ParametersActionTypes.USE_SUSTAIN_CHANGED: {
      const useSustain = action.value as typeof state.params.useSustain;

      if (!useSustain) {
        const midiNotes = state.playedMidiNotes;
        midiNotes.sort(midiSortCompareFn);
        const notes = midiNotes.map(fromMidi);
        const pitchClasses = notes.map(Note.pitchClass);
        const chords = getChords(
          notes,
          keySignatureNotes,
          state.params.allowOmissions,
          state.params.disabledChords
        );

        return {
          ...state,
          params: {
            ...state.params,
            useSustain,
          },
          notes,
          pitchClasses,
          midiNotes,
          sustainedMidiNotes: [],
          sustained: false,
          chords,
        };
      }

      return {
        ...state,
        params: {
          ...state.params,
          useSustain,
        },
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
      const chords = getChords(
        notes,
        keySignatureNotes,
        state.params.allowOmissions,
        state.params.disabledChords
      );

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
      const chords = state.params.detectOnRelease
        ? getChords(
            notes,
            keySignatureNotes,
            state.params.allowOmissions,
            state.params.disabledChords
          )
        : state.chords;

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
      if (!state.params.useSustain) {
        return state;
      }

      return {
        ...state,
        sustained: true,
        sustainedMidiNotes: [],
      };
    }

    case MidiActionTypes.SUSTAIN_OFF: {
      if (!state.params.useSustain) {
        return state;
      }

      const midiNotes = [...state.playedMidiNotes];
      midiNotes.sort(midiSortCompareFn);
      const notes = midiNotes.map(fromMidi);
      const pitchClasses = notes.map(Note.pitchClass);
      const chords = state.params.detectOnRelease
        ? getChords(
            notes,
            keySignatureNotes,
            state.params.allowOmissions,
            state.params.disabledChords
          )
        : state.chords;

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
  params: {
    keySignature: getKeySignature('C'),
    allowOmissions: false,
    useSustain: true,
    detectOnRelease: true,
    disabledChords: undefined,
  },
  sustainedMidiNotes: [],
  playedMidiNotes: [],
  midiNotes: [],
  notes: [],
  pitchClasses: [],
  chords: [],
  sustained: false,
};

export default function useNotes({
  accidentals = 'flat',
  key = 'C',
  midiChannel = MIDI_CHANNEL_ALL,
  allowOmissions = false,
  disabledChords = undefined,
  useSustain = true,
  detectOnRelease = true,
}: Partial<Parameters> = {}) {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    params: {
      keySignature: getKeySignature(key, accidentals === 'sharp'),
      allowOmissions,
      useSustain,
      detectOnRelease,
      disabledChords,
    },
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

  useEffect(() => {
    dispatch({
      type: ParametersActionTypes.DISABLED_CHORDS_CHANGED,
      value: disabledChords,
    });
  }, [disabledChords]);

  useEffect(() => {
    dispatch({
      type: ParametersActionTypes.USE_SUSTAIN_CHANGED,
      value: useSustain,
    });
  }, [useSustain]);

  useEffect(() => {
    dispatch({
      type: ParametersActionTypes.DETECT_ON_RELEASE_CHANGED,
      value: detectOnRelease,
    });
  }, [detectOnRelease]);

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
