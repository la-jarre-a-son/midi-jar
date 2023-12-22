import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import classnames from 'classnames/bind';
import { Chord, Note } from 'tonal';
import { SidebarContainer } from '@la-jarre-a-son/ui';

import { useSettings } from 'renderer/contexts/Settings';
import { NOTE_NAMES, getNoteInKeySignature } from 'renderer/helpers';

import useNotes from 'renderer/hooks/useNotes';
import ChordDictionaryChromaMenu from './ChordDictionaryChromaMenu';
import ChordDictionaryChordMenu from './ChordDictionaryChordMenu';

import styles from './ChordDictionary.module.scss';
import ChordDictionaryToolbar from './ChordDictionaryToolbar';

import ChordDictionaryProvider from './ChordDictionaryProvider';
import { groupValues } from './utils';

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

  const [interactive, setInteractive] = useState<'play' | 'learn'>('play');
  const [hideDisabled, setHideDisabled] = useState<boolean>(true);
  const [group, setGroup] = useState<keyof typeof groupValues>('none');

  const navigate = useNavigate();

  const [chroma, setChroma] = useState<number | null>(null);
  const [chordType, setChordType] = useState<string | null>(null);

  const navigateToChord = useCallback(
    (tonic: string | null, type: string | null) => {
      if (!tonic || type === null) return;
      const name = encodeURIComponent(`${getNoteInKeySignature(tonic, keySignature.notes)}${type}`);
      navigate(`./${name}`);
    },
    [navigate, keySignature]
  );

  const handleChromaChange = (newChroma: number) => {
    setChroma(newChroma);
    navigateToChord(NOTE_NAMES[newChroma], chordType);
  };

  const handleChordTypeChange = (newChordType: string) => {
    setChordType(newChordType);
    navigateToChord(chroma !== null ? NOTE_NAMES[chroma] : null, newChordType);
  };

  useEffect(() => {
    if (interactive === 'learn') {
      if (chords[0] && chords[0].tonic) {
        navigateToChord(chords[0].tonic, chords[0].aliases[0] || 'maj');
      }
    }
  }, [interactive, chords, navigateToChord]);

  useEffect(() => {
    const chord = chordName ? Chord.get(chordName) : null;

    if (chord && chord.tonic) {
      setChroma(Note.chroma(chord.tonic) ?? null);
    }

    if (chord && chord.tonic) {
      setChordType(chord.aliases[0] || 'maj');
    }
  }, [chordName]);

  return (
    <ChordDictionaryProvider
      midiNotes={midiNotes}
      playedMidiNotes={playedMidiNotes}
      sustainedMidiNotes={sustainedMidiNotes}
      pitchClasses={pitchClasses}
    >
      <ChordDictionaryToolbar
        interactive={interactive}
        onChangeInteractive={setInteractive}
        hideDisabled={hideDisabled}
        onChangeHideDisabled={setHideDisabled}
        group={group}
        onChangeGroup={setGroup}
      />
      <SidebarContainer
        className={cx('container')}
        sidebar={
          <ChordDictionaryChromaMenu
            keySignature={keySignature}
            selected={chroma}
            onSelect={handleChromaChange}
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
              selected={chordType}
              onSelect={handleChordTypeChange}
              group={group}
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
