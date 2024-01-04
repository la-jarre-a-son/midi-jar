import React, { useContext, useMemo } from 'react';

import { KeySignatureConfig, getKeySignature } from 'renderer/helpers';

interface ChordDictionaryModuleContextInterface {
  keySignature: KeySignatureConfig;
  filterChordsInKey?: boolean;
  midiNotes?: number[];
  playedMidiNotes?: number[];
  sustainedMidiNotes?: number[];
  pitchClasses?: string[];
  disableUpdate?: boolean;
}

const ChordDictionaryModuleContext =
  React.createContext<ChordDictionaryModuleContextInterface | null>(null);

type Props = {
  children: React.ReactNode;
  keySignature?: KeySignatureConfig;
  midiNotes?: number[];
  playedMidiNotes?: number[];
  sustainedMidiNotes?: number[];
  pitchClasses?: string[];
  filterChordsInKey?: boolean;
  disableUpdate?: boolean;
};

const defaultProps = {
  keySignature: getKeySignature('C'),
  midiNotes: [],
  playedMidiNotes: [],
  sustainedMidiNotes: [],
  pitchClasses: [],
  filterChordsInKey: false,
  disableUpdate: false,
};

const ChordDictionaryModuleProvider: React.FC<Props> = ({
  children,
  keySignature = defaultProps.keySignature,
  midiNotes,
  playedMidiNotes,
  sustainedMidiNotes,
  pitchClasses,
  filterChordsInKey,
  disableUpdate,
}) => {
  const value = useMemo(
    () => ({
      keySignature,
      midiNotes,
      playedMidiNotes,
      sustainedMidiNotes,
      pitchClasses,
      filterChordsInKey,
      disableUpdate,
    }),
    [
      keySignature,
      midiNotes,
      playedMidiNotes,
      sustainedMidiNotes,
      pitchClasses,
      filterChordsInKey,
      disableUpdate,
    ]
  );

  return (
    <ChordDictionaryModuleContext.Provider value={value}>
      {children}
    </ChordDictionaryModuleContext.Provider>
  );
};

ChordDictionaryModuleProvider.defaultProps = defaultProps;

export const useChordDictionaryModule = () => {
  const context = useContext(ChordDictionaryModuleContext);
  if (!context) {
    throw new Error(`useChordDictionaryModule must be used within a ChordDictionaryModuleProvider`);
  }
  return context;
};

export default ChordDictionaryModuleProvider;
