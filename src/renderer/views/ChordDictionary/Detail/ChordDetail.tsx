/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useMemo, useRef } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import classnames from 'classnames/bind';
import { Chord, Note } from 'tonal';
import {
  Badge,
  Button,
  Container,
  Link,
  List,
  ListItem,
  Switch,
  Tooltip,
} from '@la-jarre-a-son/ui';

import { KeyboardSettings } from 'main/types';
import { defaultKeyboardSettings } from 'main/store/defaults';

import { useSettings } from 'renderer/contexts/Settings';
import { ALIAS_NOTATION, getChordDegrees, getNoteInKeySignature } from 'renderer/helpers';
import {
  ChordIntervals,
  ChordName,
  Icon,
  NavButton,
  Notation,
  PianoKeyboard,
} from 'renderer/components';

import { useChordDictionaryModule } from '../ChordDictionaryModuleProvider';

import {
  getAlternativeChords,
  getChordInversion,
  getSubsetChords,
  getSupersetChords,
} from './utils';
import { EmptyChordDetail } from './EmptyChordDetail';

import styles from './ChordDetail.module.scss';

const cx = classnames.bind(styles);

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

const ChordDetail: React.FC = () => {
  const {
    keySignature,
    midiNotes,
    playedMidiNotes,
    sustainedMidiNotes,
    pitchClasses,
    disableUpdate,
  } = useChordDictionaryModule();

  const ref = useRef<HTMLDivElement>(null);
  const { chordName } = useParams();
  const navigate = useNavigate();

  const { settings, updateSetting } = useSettings();
  const { staffClef, staffTranspose } = settings.notation;

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView(true);
    }
  }, [chordName]);

  const chord = useMemo(() => (chordName ? Chord.get(chordName) : null), [chordName]);
  const isDisabled = useMemo(
    () => chord && settings.chordDictionary.disabled.includes(chord.aliases[0]),
    [chord, settings.chordDictionary.disabled]
  );
  const preferredAlias = useMemo(() => {
    if (!chord) return null;

    const alias = settings.chordDictionary.aliases.find((a) => a[0] === chord.aliases[0]);

    return alias ? alias[1] : null;
  }, [chord, settings.chordDictionary.aliases]);

  if (!chordName) {
    return <EmptyChordDetail />;
  }

  if (!chord) {
    return <EmptyChordDetail chordName={chordName} />;
  }

  const midi = getChordInversion(chord, 0);
  const alternativeChords = getAlternativeChords(
    chord,
    keySignature,
    settings.chordDictionary.disabled,
    settings.chordDictionary.hideDisabled
  );
  const subsetChords = getSubsetChords(
    chord,
    settings.chordDictionary.disabled,
    settings.chordDictionary.hideDisabled
  );
  const supersetChords = getSupersetChords(
    chord,
    keySignature,
    settings.chordDictionary.filterInKey,
    settings.chordDictionary.disabled,
    settings.chordDictionary.hideDisabled
  );
  const goToChordDetail = (name: string) => {
    navigate(`../${encodeURIComponent(name)}`);
  };

  const playedIntervals = getChordDegrees(chord, pitchClasses ?? []);

  const toggleDisabled = (isEnabled: boolean) => {
    const disabled = isEnabled
      ? settings.chordDictionary.disabled.filter((c) => c !== chord.aliases[0])
      : [...settings.chordDictionary.disabled, chord.aliases[0]];

    updateSetting('chordDictionary.disabled', disabled);
  };

  const toggleAlias = (isPreferred: boolean, alias: string) => {
    const aliases = settings.chordDictionary.aliases.filter((a) => a[0] !== chord.aliases[0]);

    if (!isPreferred) {
      updateSetting('chordDictionary.aliases', [...aliases, [chord.aliases[0], alias]]);
    } else {
      updateSetting('chordDictionary.aliases', aliases);
    }
  };

  return (
    <Container ref={ref} className={cx('base')} size="xl">
      <h1 className={cx('header')}>
        <ChordName
          className={cx('chordName', isDisabled && 'chordName--isDisabled')}
          chord={chord}
        />
        {!disableUpdate && (
          <Tooltip title="Disable/enable chord" placement="left" describeAs="label" disablePortal>
            <label>
              <Switch id="toggleChord" checked={!isDisabled} onChange={toggleDisabled} />
            </label>
          </Tooltip>
        )}
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
        <section className={cx('column')}>
          <h2 className={cx('title')}>Intervals</h2>
          <ChordIntervals
            className={cx('intervals')}
            intervals={playedIntervals}
            targets={chord.intervals}
            pitchClasses={pitchClasses}
            tonic={chord.tonic}
          />
        </section>
        <section className={cx('column')}>
          <h2 className={cx('title')}>Notation</h2>
          <Notation
            className={cx('notation')}
            midiNotes={midi}
            keySignature={keySignature}
            staffClef={staffClef}
            staffTranspose={staffTranspose}
          />
        </section>
      </div>

      <div className={cx('columns')}>
        <section className={cx('column')}>
          <h2 className={cx('title')}>Aliases</h2>
          <List className={cx('list')}>
            {chord.aliases.map((alias, index) => {
              const isPreferred = preferredAlias === alias;
              const isDefault =
                preferredAlias === null &&
                index === ALIAS_NOTATION[settings.chordDictionary.defaultNotation || 0];

              return (
                <ListItem
                  className={cx('alias', (isPreferred || isDefault) && 'alias--preferred')}
                  key={index}
                  left={
                    index < NOTATION_LABELS.length && (
                      <Badge intent="primary" size="sm">
                        {NOTATION_LABELS[index]}
                      </Badge>
                    )
                  }
                  right={
                    disableUpdate ? (
                      <Icon
                        intent={isPreferred ? 'warning' : 'neutral'}
                        name={isPreferred || isDefault ? 'star-filled' : 'star'}
                      />
                    ) : (
                      <Tooltip title={isPreferred ? 'Unset as preferred' : 'Set as preferred'}>
                        <Button
                          aria-label={
                            isPreferred
                              ? `Unset ${chord.aliases[index]} as preferred`
                              : `Set ${chord.aliases[index]} as preferred`
                          }
                          icon
                          rounded
                          size="sm"
                          variant={isPreferred ? 'filled' : 'ghost'}
                          intent="warning"
                          onClick={() => toggleAlias(isPreferred, chord.aliases[index])}
                        >
                          <Icon name={isPreferred || isDefault ? 'star-filled' : 'star'} />
                        </Button>
                      </Tooltip>
                    )
                  }
                >
                  <ChordName chord={chord} notation={index} />
                </ListItem>
              );
            })}
          </List>
        </section>
        {!!alternativeChords.length && (
          <section className={cx('column')}>
            <h2 className={cx('title')}>Other interpretations</h2>
            <List className={cx('list')}>
              {alternativeChords.map((altChord) => (
                <ListItem
                  key={altChord.symbol}
                  interactive
                  onClick={() => goToChordDetail(`${altChord.tonic + altChord.aliases[0]}`)}
                >
                  <ChordName chord={altChord} />
                </ListItem>
              ))}
            </List>
          </section>
        )}
      </div>
      <div className={cx('columns')}>
        <section className={cx('column')}>
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
                  <ChordName className={cx('inversionChord')} chord={slashChord} />
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
        </section>
      </div>
      <div className={cx('columns')}>
        {!!subsetChords.length && (
          <section className={cx('column')}>
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
                  <ChordName chord={c} />
                </NavButton>
              ))}
            </div>
          </section>
        )}
        {!!supersetChords.length && (
          <section className={cx('column')}>
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
                  <ChordName chord={c} />
                </NavButton>
              ))}
            </div>
          </section>
        )}
      </div>
    </Container>
  );
};

export default ChordDetail;
