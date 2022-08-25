import React from 'react';
import classnames from 'classnames/bind';

import { ChordDisplaySettings, Settings } from 'main/types/Settings';
import { defaults } from 'main/settings/schema';

import { useSettings } from 'renderer/contexts/Settings';
import useNotes from 'renderer/hooks/useNotes';
import ChordName from 'renderer/components/ChordName';
import Notation from 'renderer/components/Notation';
import PianoKeyboard from 'renderer/components/PianoKeyboard';

import { formatSharpsFlats } from 'renderer/helpers/note';

import styles from './ChordDisplay.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
  namespace?: keyof Settings['chordDisplay'];
};

const defaultProps = {
  className: undefined,
  namespace: 'internal' as const,
};

/**
 *  ChordDisplay page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const ChordDisplay: React.FC<Props> = ({
  className,
  namespace = 'internal',
}) => {
  const { settings } = useSettings();

  const { key, accidentals } = settings?.notation ?? defaults.settings.notation;

  let namespaceSettings = settings?.chordDisplay?.[namespace];

  if (!namespaceSettings || namespaceSettings.useInternal) {
    namespaceSettings =
      settings?.chordDisplay?.internal ||
      (defaults.settings.chordDisplay.internal as ChordDisplaySettings);
  }

  const {
    skin,
    from,
    to,
    colorHighlight,
    colorNoteWhite,
    colorNoteBlack,
    displayKeyboard,
    displayNotes,
    displayChord,
    displayNotation,
    displayAltChords,
    displayKeyNames,
    displayDegrees,
    displayTonic,
  } = namespaceSettings;

  const {
    notes,
    pitchClasses,
    sustainedMidiNotes,
    playedMidiNotes,
    chords,
    keySignature,
  } = useNotes({
    accidentals,
    key,
    midiChannel: 0,
  });

  if (!settings) return null;

  return (
    <div id="chordDisplay" className={cx('base', className)}>
      {displayAltChords && (
        <div id="alternativeChords" className={cx('alternativeChords')}>
          {chords.map((chord, index) =>
            index > 0 ? <ChordName key={index} chord={chord} /> : null
          )}
        </div>
      )}
      <div id="chordDisplayContainer" className={cx('container')}>
        {displayNotation && (
          <Notation
            id="notation"
            className={cx('notation', { 'notation--withChord': displayChord })}
            notes={notes}
            keySignature={keySignature}
          />
        )}
        {displayChord && (
          <div
            id="chord"
            className={cx('chord', { 'chord--withNotation': displayNotation })}
          >
            <ChordName chord={chords[0]} />
          </div>
        )}
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

ChordDisplay.defaultProps = defaultProps;

export default ChordDisplay;
