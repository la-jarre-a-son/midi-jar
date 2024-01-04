import React, { useContext, useMemo } from 'react';

import { useSettings } from './Settings';

interface ChordDictionaryContextInterface {
  aliases: Map<string, string>;
  defaultNotation: 'long' | 'short' | 'symbol';
}

const ChordDictionaryContext = React.createContext<ChordDictionaryContextInterface | undefined>(
  undefined
);

/**
 * Provides a context with aliases for the <ChordName> component
 */
const ChordDictionaryProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { settings } = useSettings();

  const aliases = useMemo(
    () => new Map(settings.chordDictionary.aliases),
    [settings.chordDictionary.aliases]
  );

  const value = useMemo(
    () => ({
      aliases,
      defaultNotation: settings.chordDictionary.defaultNotation,
    }),
    [aliases, settings.chordDictionary.defaultNotation]
  );

  return (
    <ChordDictionaryContext.Provider value={value}>{children}</ChordDictionaryContext.Provider>
  );
};

export const useChordDictionary = () => {
  const context = useContext(ChordDictionaryContext);
  if (context === undefined) {
    throw new Error(`useChordDictionary must be used within a ChordDictionaryProvider`);
  }
  return context;
};

export default ChordDictionaryProvider;
