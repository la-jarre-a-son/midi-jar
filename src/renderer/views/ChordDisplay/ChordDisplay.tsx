import React from 'react';
import classnames from 'classnames/bind';

import { ChordDisplaySettings, Settings } from 'main/types/Settings';
import { defaults } from 'main/settings/schema';

import { useSettings } from 'renderer/contexts/Settings';
import useNotes from 'renderer/hooks/useNotes';
import ChordName from 'renderer/components/ChordName';
import PianoKeyboard from 'renderer/components/PianoKeyboard';

import { formatSharpsFlats } from 'renderer/helpers/chords';

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
    accidentals,
    colorHighlight,
    colorNoteWhite,
    colorNoteBlack,
    displayKeyboard,
    displayNotes,
    displayChord,
    displayAltChords,
    displayKeyNames,
    displayDegrees,
    displayTonic,
  } = namespaceSettings;

  const { notes, sustainedMidiNotes, playedMidiNotes, chords } = useNotes({
    accidentals,
    midiChannel: 0,
  });

  if (!settings) return null;

  return (
    <div id="chordDisplay" className={cx('base', className)}>
      {displayChord && (
        <div id="chord" className={cx('chord')}>
          <ChordName chord={chords[0]} />
        </div>
      )}
      {displayAltChords && (
        <div id="alternativeChords" className={cx('alternativeChords')}>
          {chords.map((chord, index) =>
            index > 0 ? <ChordName key={index} chord={chord} /> : null
          )}
        </div>
      )}
      {displayNotes && (
        <div id="notes" className={cx('notes')}>
          {notes.map((note, index) => (
            <span key={index} className={cx('note')}>
              {formatSharpsFlats(note)}
            </span>
          ))}
        </div>
      )}
      {displayKeyboard && (
        <PianoKeyboard
          id="keyboard"
          className={cx('keyboard')}
          skin={skin}
          sustained={sustainedMidiNotes}
          midi={playedMidiNotes}
          chord={chords[0] ?? undefined}
          from={from}
          to={to}
          accidentals={accidentals}
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
