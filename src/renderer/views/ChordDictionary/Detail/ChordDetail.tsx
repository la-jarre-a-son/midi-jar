import React, { useEffect, useMemo, useRef } from 'react';
import classnames from 'classnames/bind';
import { Chord, Note } from 'tonal';
import { Badge, Container, Link, List, ListItem } from '@la-jarre-a-son/ui';

import { defaultKeyboardSettings } from 'main/store/defaults';

import { getChordDegrees, getKeySignature, getNoteInKeySignature } from 'renderer/helpers';

import { ChordIntervals, ChordName, NavButton, Notation, PianoKeyboard } from 'renderer/components';
import { KeyboardSettings } from 'main/types';

import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useSettings } from 'renderer/contexts/Settings';
import styles from './ChordDetail.module.scss';
import {
  getAlternativeChords,
  getChordInversion,
  getSubsetChords,
  getSupersetChords,
} from './utils';
import { useChordDictionary } from '../ChordDictionaryProvider';

const KEYBOARD_SETTINGS: KeyboardSettings = {
  ...defaultKeyboardSettings,
  skin: 'classic',
  from: 'C3',
  to: 'B5',
  label: 'chordNote',
  keyName: 'none',
  keyInfo: 'tonicAndInterval',
  textOpacity: 1,
  displaySustained: true,
  wrap: true,
  sizes: {
    radius: 0.4,
    height: 4,
    ratio: 0.6,
    bevel: true,
  },
};

const NOTATION_LABELS = ['long', 'short', 'symbol'];

const cx = classnames.bind(styles);

const ChordDetail: React.FC = () => {
  const { midiNotes, playedMidiNotes, sustainedMidiNotes, pitchClasses } = useChordDictionary();
  const ref = useRef<HTMLDivElement>(null);
  const { chordName } = useParams();
  const navigate = useNavigate();

  const { settings } = useSettings();
  const { key, accidentals, staffClef, staffTranspose } = settings.notation;
  const keySignature = useMemo(
    () => getKeySignature(key, accidentals === 'sharp'),
    [key, accidentals]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView(true);
    }
  }, [chordName]);

  if (!chordName) {
    return 'Select a chord or search';
  }

  const chord = chordName ? Chord.get(chordName) : null;

  if (!chord) {
    return `Cannot find a chord named "${chordName}"`;
  }

  const midi = getChordInversion(chord, 0);
  const alternativeChords = getAlternativeChords(chord, keySignature);
  const subsetChords = getSubsetChords(chord);
  const supersetChords = getSupersetChords(chord);
  const goToChordDetail = (name: string) => {
    navigate(`../${encodeURIComponent(name)}`);
  };

  const playedIntervals = getChordDegrees(chord, pitchClasses ?? []);

  return (
    <Container ref={ref} className={cx('base')} size="xl">
      <h1 className={cx('chordName')}>
        <ChordName chord={chord} notation="long" />
      </h1>
      <div className={cx('name')}>{chord.name}</div>
      <PianoKeyboard
        className={cx('keyboard')}
        targets={midi}
        played={playedMidiNotes}
        sustained={sustainedMidiNotes}
        midi={midiNotes}
        chord={chord}
        keyboard={KEYBOARD_SETTINGS}
      />
      <div className={cx('columns')}>
        <div className={cx('column')}>
          <h2 className={cx('title')}>Intervals</h2>
          <ChordIntervals
            className={cx('intervals')}
            intervals={playedIntervals}
            targets={chord.intervals}
            pitchClasses={pitchClasses}
            tonic={chord.tonic}
          />
        </div>
        <div className={cx('column')}>
          <h2 className={cx('title')}>Notation</h2>
          <Notation
            className={cx('notation')}
            midiNotes={midi}
            keySignature={keySignature}
            staffClef={staffClef}
            staffTranspose={staffTranspose}
          />
        </div>
      </div>

      <div className={cx('columns')}>
        <div className={cx('column')}>
          <h2 className={cx('title')}>Aliases</h2>
          <List className={cx('list')}>
            {chord.aliases.map((alias, index) => (
              <ListItem
                key={index}
                left={
                  index < NOTATION_LABELS.length && (
                    <Badge intent="primary" size="sm">
                      {NOTATION_LABELS[index]}
                    </Badge>
                  )
                }
              >
                <ChordName chord={chord} notation={index} />
              </ListItem>
            ))}
          </List>
        </div>
        {!!alternativeChords.length && (
          <div className={cx('column')}>
            <h2 className={cx('title')}>Other interpretations</h2>
            <List className={cx('list')}>
              {alternativeChords.map((altChord) => (
                <ListItem
                  key={altChord.symbol}
                  interactive
                  onClick={() => goToChordDetail(`${altChord.tonic + altChord.aliases[0]}`)}
                >
                  <ChordName chord={altChord} notation="short" />
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </div>
      <h2 className={cx('title')}>Inversions</h2>
      {chord.intervals.map((_, index) => {
        if (!index) return null;

        const interval = chord.intervals[index].replace('*', '');
        const root = chord.notes[index];
        const slashChord = { ...chord, root, rootDegree: index };
        const inversionMidi = getChordInversion(chord, index);
        const altChord = alternativeChords.find(
          (c) => c.tonic && Note.chroma(c.tonic) === Note.chroma(root)
        );
        const altChordName =
          altChord && altChord.tonic
            ? getNoteInKeySignature(altChord.tonic, keySignature.notes) + altChord.aliases[0]
            : '';

        return (
          <div key={index} className={cx('inversion')}>
            <div className={cx('inversionInfo')}>
              <ChordName className={cx('inversionChord')} chord={slashChord} notation="long" />
              <div className={cx('inversionInterval')}>inversion on {interval}</div>
              {altChord && (
                <div className={cx('inversionAltChord')}>
                  {'see also '}
                  <Link
                    as={NavLink}
                    to={`../${encodeURIComponent(altChord.tonic + altChord.aliases[0])}`}
                  >
                    {altChordName}
                  </Link>
                </div>
              )}
            </div>
            <PianoKeyboard
              className={cx('inversionKeyboard')}
              played={inversionMidi}
              midi={inversionMidi}
              chord={slashChord}
              keyboard={KEYBOARD_SETTINGS}
            />
            <Notation
              className={cx('inversionNotation')}
              midiNotes={inversionMidi}
              keySignature={keySignature}
              staffClef={staffClef}
              staffTranspose={staffTranspose}
            />
          </div>
        );
      })}
      <div className={cx('columns')}>
        {!!subsetChords.length && (
          <div className={cx('column')}>
            <h2 className={cx('title')}>Simplified</h2>
            <div className={cx('chordSet')}>
              {subsetChords.map((c, index) => (
                <NavButton
                  key={index}
                  className={cx('chordButton')}
                  intent="primary"
                  size="sm"
                  hoverIntent
                  rounded
                  to={`../${encodeURIComponent(c.tonic + c.aliases[0])}`}
                >
                  <ChordName chord={c} notation="long" />
                </NavButton>
              ))}
            </div>
          </div>
        )}
        {!!supersetChords.length && (
          <div className={cx('column')}>
            <h2 className={cx('title')}>Extended</h2>
            <div className={cx('chordSet')}>
              {supersetChords.map((c, index) => (
                <NavButton
                  key={index}
                  className={cx('chordButton')}
                  intent="primary"
                  size="sm"
                  hoverIntent
                  rounded
                  to={`../${encodeURIComponent(c.tonic + c.aliases[0])}`}
                >
                  <ChordName chord={c} notation="long" />
                </NavButton>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ChordDetail;
