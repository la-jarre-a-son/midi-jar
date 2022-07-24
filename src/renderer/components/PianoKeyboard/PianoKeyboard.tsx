import React, { useRef, useEffect } from 'react';
import { chroma as getChroma } from '@tonaljs/note';
import { Chord } from '@tonaljs/chord';

import {
  fadeNotes,
  highlightNotes,
  fadeIntervals,
  highlightInterval,
} from './Utils';

import ClassicPiano from './classic';
import FlatPiano from './flat';

type Props = {
  id?: string;
  className?: string;
  skin?: 'classic' | 'flat';
  from?: string;
  to?: string;
  accidentals?: 'flat' | 'sharp';
  colorNoteWhite?: string;
  colorNoteBlack?: string;
  colorHighlight?: string;
  displayKeyNames?: boolean;
  displayDegrees?: boolean;
  displayTonic?: boolean;
  sustained?: number[];
  midi?: number[];
  chord?: Chord;
};

const defaultProps = {
  id: undefined,
  className: undefined,
  skin: 'classic' as Props['skin'],
  from: 'C2',
  to: 'C7',
  accidentals: 'flat' as const,
  colorHighlight: '#315bce',
  colorNoteWhite: '#ffffff',
  colorNoteBlack: '#000000',
  displayKeyNames: true,
  displayDegrees: true,
  displayTonic: true,
  sustained: [],
  midi: [],
  chord: undefined,
};

const PianoKeyboard: React.FC<Props> = ({
  id,
  className,
  skin,
  from,
  to,
  accidentals,
  colorNoteWhite,
  colorNoteBlack,
  colorHighlight,
  displayKeyNames,
  displayDegrees,
  displayTonic,
  sustained,
  midi,
  chord,
}) => {
  const pianoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pianoRef.current) {
      fadeNotes(pianoRef.current);
      fadeNotes(pianoRef.current, 'sustained');
      if (midi) {
        highlightNotes(pianoRef.current, midi);
      }
      if (sustained) {
        highlightNotes(pianoRef.current, sustained, 'sustained');
      }
    }
  }, [midi, sustained]);

  useEffect(() => {
    if (pianoRef.current) {
      fadeIntervals(pianoRef.current);

      if (chord && chord.intervals.length) {
        for (let i = 0; i < chord.intervals.length; i += 1) {
          highlightInterval(
            pianoRef.current,
            getChroma(chord.notes[i]) as number,
            chord.intervals[i],
            displayTonic
          );
        }
      }
    }
  }, [chord, displayTonic]);

  return (
    <div ref={pianoRef} id={id} className={className}>
      {skin === 'classic' && (
        <ClassicPiano
          from={from}
          to={to}
          accidentals={accidentals}
          colorHighlight={colorHighlight}
          colorNoteWhite={colorNoteWhite}
          colorNoteBlack={colorNoteBlack}
          displayKeyNames={displayKeyNames}
          displayDegrees={displayDegrees}
          displayTonic={displayTonic}
        />
      )}
      {skin === 'flat' && (
        <FlatPiano
          from={from}
          to={to}
          accidentals={accidentals}
          colorHighlight={colorHighlight}
          colorNoteWhite={colorNoteWhite}
          colorNoteBlack={colorNoteBlack}
          displayKeyNames={displayKeyNames}
          displayDegrees={displayDegrees}
          displayTonic={displayTonic}
        />
      )}
    </div>
  );
};

PianoKeyboard.defaultProps = defaultProps;

export default PianoKeyboard;
