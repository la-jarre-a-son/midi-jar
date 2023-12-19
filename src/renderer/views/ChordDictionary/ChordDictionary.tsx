import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import classnames from 'classnames/bind';
import { Chord, Note } from 'tonal';
import { SidebarContainer } from '@la-jarre-a-son/ui';

import { useSettings } from 'renderer/contexts/Settings';
import { NOTE_NAMES, getKeySignature, getNoteInKeySignature } from 'renderer/helpers';

import ChordDictionaryChromaMenu from './ChordDictionaryChromaMenu';
import ChordDictionaryChordMenu from './ChordDictionaryChordMenu';

import styles from './ChordDictionary.module.scss';

const cx = classnames.bind(styles);

const ChordDictionary: React.FC = () => {
  const { settings } = useSettings();
  const { chordName } = useParams();

  const navigate = useNavigate();
  const { key, accidentals } = settings.notation;
  const keySignature = useMemo(
    () => getKeySignature(key, accidentals === 'sharp'),
    [key, accidentals]
  );

  const [chroma, setChroma] = useState<number | null>(null);
  const [chordType, setChordType] = useState<string | null>(null);

  useEffect(() => {
    if (chroma !== null && chordType !== null) {
      const name = encodeURIComponent(
        `${getNoteInKeySignature(NOTE_NAMES[chroma], keySignature.notes)}${chordType}`
      );

      navigate(`./${name}`);
    }
    return () => {};
  }, [navigate, chroma, chordType, keySignature]);

  useEffect(() => {
    const chord = chordName ? Chord.get(chordName) : null;

    if (chord && chord.tonic) {
      setChroma(Note.chroma(chord.tonic) ?? null);
    }

    if (chord && chord.aliases[0]) {
      setChordType(chord.aliases[0]);
    }
  }, [chordName]);

  return (
    <SidebarContainer
      className={cx('container')}
      sidebar={
        <ChordDictionaryChromaMenu
          keySignature={keySignature}
          selected={chroma}
          onSelect={setChroma}
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
        sidebar={<ChordDictionaryChordMenu selected={chordType} onSelect={setChordType} />}
        sidebarProps={{ className: cx('chordbar') }}
        contentProps={{ className: cx('content') }}
        size="sm"
        open
        inset
      >
        <Outlet />
      </SidebarContainer>
    </SidebarContainer>
  );
};

ChordDictionary.defaultProps = {};

export default ChordDictionary;
