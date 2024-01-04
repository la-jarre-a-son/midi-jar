import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import classnames from 'classnames/bind';
import { Chord, Note } from 'tonal';
import { SidebarContainer } from '@la-jarre-a-son/ui';

import { useSettings } from 'renderer/contexts/Settings';
import useNotes from 'renderer/hooks/useNotes';
import { NOTE_NAMES, getNoteInKeySignature } from 'renderer/helpers';

import ChordDictionaryChromaMenu from './ChordDictionaryChromaMenu';
import ChordDictionaryChordMenu from './ChordDictionaryChordMenu';
import ChordDictionaryToolbar from './ChordDictionaryToolbar';
import ChordDictionaryProvider from './ChordDictionaryProvider';

import styles from './ChordDictionary.module.scss';

const cx = classnames.bind(styles);

const ChordDictionary: React.FC = () => {
  const { settings } = useSettings();
  const { chordName } = useParams();

  const { key, accidentals } = settings.notation;
  const {
    chords,
    midiNotes,
    playedMidiNotes,
    sustainedMidiNotes,
    pitchClasses,
    params: { keySignature },
  } = useNotes({
    key,
    accidentals,
    midiChannel: 0,
    useSustain: true,
    detectOnRelease: false,
  });

  const navigate = useNavigate();

  const [chroma, setChroma] = useState<number | null>(null);
  const [chordType, setChordType] = useState<string | null>(null);

  const navigateToChord = useCallback(
    (tonic: string | null, type: string | null) => {
      if (!tonic || type === null) {
        navigate('./');
      } else {
        const name = encodeURIComponent(
          `${getNoteInKeySignature(tonic, keySignature.notes)}${type}`
        );
        navigate(`./${name}`);
      }
    },
    [navigate, keySignature]
  );

  const handleChromaChange = (newChroma: number) => {
    setChroma(newChroma);
    if (settings.chordDictionary.filterInKey) {
      setChordType(null);
      navigateToChord(NOTE_NAMES[newChroma], null);
    } else {
      navigateToChord(NOTE_NAMES[newChroma], chordType);
    }
  };

  const handleChordTypeChange = (newChordType: string) => {
    setChordType(newChordType);
    navigateToChord(chroma !== null ? NOTE_NAMES[chroma] : null, newChordType);
  };

  useEffect(() => {
    if (settings.chordDictionary.interactive === 'detect') {
      if (chords[0] && chords[0].tonic) {
        navigateToChord(chords[0].tonic, chords[0].aliases[0]);
      }
    }
  }, [settings.chordDictionary.interactive, chords, navigateToChord]);

  useEffect(() => {
    const chord = chordName ? Chord.get(chordName) : null;

    if (chord && chord.tonic) {
      setChroma(Note.chroma(chord.tonic) ?? null);
      setChordType(chord.aliases[0]);
    }
  }, [chordName]);

  return (
    <ChordDictionaryProvider
      midiNotes={midiNotes}
      playedMidiNotes={playedMidiNotes}
      sustainedMidiNotes={sustainedMidiNotes}
      pitchClasses={pitchClasses}
      keySignature={keySignature}
    >
      <ChordDictionaryToolbar />
      <SidebarContainer
        className={cx('container')}
        sidebar={
          <ChordDictionaryChromaMenu
            keySignature={keySignature}
            selected={chroma}
            onSelect={handleChromaChange}
            filterChordsInKey={settings.chordDictionary.filterInKey}
          />
        }
        sidebarProps={{ className: cx('pitchbar') }}
        contentProps={{ className: cx('content') }}
        size="xs"
        open
        inset
      >
        <SidebarContainer
          className={cx('container')}
          sidebar={
            <ChordDictionaryChordMenu
              keySignature={keySignature}
              selected={chordType}
              onSelect={handleChordTypeChange}
              chroma={chroma}
              groupBy={settings.chordDictionary.groupBy}
              disabledChords={settings.chordDictionary.disabled}
              hideDisabled={settings.chordDictionary.hideDisabled}
              filterChordsInKey={settings.chordDictionary.filterInKey}
            />
          }
          sidebarProps={{ className: cx('chordbar') }}
          contentProps={{ className: cx('content') }}
          size="sm"
          open
          inset
        >
          <Outlet />
        </SidebarContainer>
      </SidebarContainer>
    </ChordDictionaryProvider>
  );
};

export default ChordDictionary;
