import React, { useContext, useMemo } from 'react';

import { KeySignatureConfig, getKeySignature } from 'renderer/helpers';

interface ChordDictionaryContextInterface {
  keySignature: KeySignatureConfig;
  filterChordsInKey?: boolean;
  midiNotes?: number[];
  playedMidiNotes?: number[];
  sustainedMidiNotes?: number[];
  pitchClasses?: string[];
}

const ChordDictionaryContext = React.createContext<ChordDictionaryContextInterface | null>(null);

type Props = {
  children: React.ReactNode;
  keySignature?: KeySignatureConfig;
  midiNotes?: number[];
  playedMidiNotes?: number[];
  sustainedMidiNotes?: number[];
  pitchClasses?: string[];
  filterChordsInKey?: boolean;
};

const defaultProps = {
  keySignature: getKeySignature('C'),
  midiNotes: [],
  playedMidiNotes: [],
  sustainedMidiNotes: [],
  pitchClasses: [],
  filterChordsInKey: false,
};

const ChordDictionaryProvider: React.FC<Props> = ({
  children,
  keySignature = defaultProps.keySignature,
  midiNotes,
  playedMidiNotes,
  sustainedMidiNotes,
  pitchClasses,
  filterChordsInKey,
}) => {
  const value = useMemo(
    () => ({
      keySignature,
      midiNotes,
      playedMidiNotes,
      sustainedMidiNotes,
      pitchClasses,
      filterChordsInKey,
    }),
    [keySignature, midiNotes, playedMidiNotes, sustainedMidiNotes, pitchClasses, filterChordsInKey]
  );

  return (
    <ChordDictionaryContext.Provider value={value}>{children}</ChordDictionaryContext.Provider>
  );
};

ChordDictionaryProvider.defaultProps = defaultProps;

export const useChordDictionary = () => {
  const context = useContext(ChordDictionaryContext);
  if (!context) {
    throw new Error(`useChordDictionary must be used within a ChordDictionaryProvider`);
  }
  return context;
};

export default ChordDictionaryProvider;
