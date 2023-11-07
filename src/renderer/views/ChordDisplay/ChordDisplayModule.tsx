import React from 'react';
import classnames from 'classnames/bind';

import { useModuleSettings, useSettings } from 'renderer/contexts/Settings';
import useNotes from 'renderer/hooks/useNotes';
import { ChordName, Notation, PianoKeyboard, ChordIntervals } from 'renderer/components';

import { formatSharpsFlats } from 'renderer/helpers/note';

import styles from './ChordDisplay.module.scss';

const cx = classnames.bind(styles);

type Props = {
  moduleId: string;
};

const ChordDisplayModule: React.FC<Props> = ({ moduleId }) => {
  const { settings } = useSettings();
  const { moduleSettings } = useModuleSettings('chordDisplay', moduleId);

  const { key, accidentals, staffClef, staffTranspose } = settings.notation;
  const { midiNotes, pitchClasses, sustainedMidiNotes, playedMidiNotes, chords, keySignature } =
    useNotes({
      accidentals,
      key,
      midiChannel: 0,
      allowOmissions: moduleSettings.allowOmissions,
    });

  if (!settings || !moduleSettings) return null;

  const {
    skin,
    from,
    to,
    chordNotation,
    highlightAlterations,
    colorHighlight,
    colorNoteWhite,
    colorNoteBlack,
    displayKeyboard,
    displayNotes,
    displayChord,
    displayName,
    displayNotation,
    displayAltChords,
    displayKeyNames,
    displayDegrees,
    displayTonic,
    displayIntervals,
  } = moduleSettings;

  return (
    <div id="chordDisplay" className={cx('base')}>
      {displayAltChords && (
        <div id="alternativeChords" className={cx('alternativeChords')}>
          {chords.map((chord, index) =>
            index > 0 ? (
              <ChordName
                key={index}
                chord={chord}
                notation={chordNotation}
                highlightAlterations={highlightAlterations}
              />
            ) : null
          )}
        </div>
      )}
      <div id="container" className={cx('container')}>
        {displayNotation && (
          <Notation
            id="notation"
            className={cx('notation', { 'notation--withChord': displayChord })}
            midiNotes={midiNotes}
            keySignature={keySignature}
            staffClef={staffClef}
            staffTranspose={staffTranspose}
          />
        )}
        <div id="display" className={cx('display')}>
          {displayChord && (
            <div id="chord" className={cx('chord', { 'chord--withNotation': displayNotation })}>
              <ChordName
                chord={chords[0]}
                notation={chordNotation}
                highlightAlterations={highlightAlterations}
              />
            </div>
          )}
          {displayName && (
            <div id="name" className={cx('name')}>
              {chords[0] && chords[0].name}
            </div>
          )}
          {displayIntervals && (
            <div id="intervals" className={cx('intervals')}>
              <ChordIntervals
                intervals={chords[0]?.intervals}
                pitchClasses={pitchClasses}
                tonic={chords[0]?.tonic}
              />
            </div>
          )}
        </div>
      </div>
      {displayNotes && (
        <div id="notes" className={cx('notes')}>
          {pitchClasses.map((note, index) => (
            <span key={index} className={cx('note')}>
              {formatSharpsFlats(note)}
            </span>
          ))}
        </div>
      )}
      {displayKeyboard && (
        <PianoKeyboard
          id="keyboard"
          className={cx('keyboard', {
            'keyboard--withNotation': displayNotation,
            'keyboard--withChord': displayChord,
          })}
          skin={skin}
          sustained={sustainedMidiNotes}
          midi={playedMidiNotes}
          chord={chords[0] ?? undefined}
          from={from}
          to={to}
          keySignature={keySignature}
          colorHighlight={colorHighlight ?? undefined}
          colorNoteWhite={colorNoteWhite ?? undefined}
          colorNoteBlack={colorNoteBlack ?? undefined}
          displayKeyNames={displayKeyNames}
          displayDegrees={displayDegrees}
          displayTonic={displayTonic}
        />
      )}
    </div>
  );
};

export default ChordDisplayModule;
