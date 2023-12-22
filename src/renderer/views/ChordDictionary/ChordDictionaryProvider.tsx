import React, { useContext, useMemo } from 'react';

interface ChordDictionaryContextInterface {
  midiNotes?: number[];
  playedMidiNotes?: number[];
  sustainedMidiNotes?: number[];
  pitchClasses?: string[];
}

const ChordDictionaryContext = React.createContext<ChordDictionaryContextInterface | null>(null);

type Props = {
  children: React.ReactNode;
  midiNotes?: number[];
  playedMidiNotes?: number[];
  sustainedMidiNotes?: number[];
  pitchClasses?: string[];
};

const defaultProps = {
  midiNotes: [],
  playedMidiNotes: [],
  sustainedMidiNotes: [],
  pitchClasses: [],
};

const ChordDictionaryProvider: React.FC<Props> = ({
  children,
  midiNotes,
  playedMidiNotes,
  sustainedMidiNotes,
  pitchClasses,
}) => {
  const value = useMemo(
    () => ({
      midiNotes,
      playedMidiNotes,
      sustainedMidiNotes,
      pitchClasses,
    }),
    [midiNotes, playedMidiNotes, sustainedMidiNotes, pitchClasses]
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
