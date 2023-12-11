import React, { useRef, useEffect } from 'react';
import { defaultKeyboardSettings } from 'main/store/defaults';

import { getKeySignature } from 'renderer/helpers/note';
import { getContrastColor } from 'renderer/helpers';
import {
  fadeNotes,
  highlightNotes,
  highlightWrapNotes,
  fadeInfo,
  highlightInfo,
  highlightLabels,
  highlightWrapLabels,
  fadeLabels,
} from './utils';

import { PianoKeyboardProps } from './types';
import ClassicPiano from './classic';
import FlatPiano from './flat';

const defaultProps = {
  id: undefined,
  className: undefined,
  keyboard: defaultKeyboardSettings,
  keySignature: getKeySignature('C'),
  sustained: [],
  midi: [],
  chord: undefined,
};

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({
  id,
  className,
  keyboard = defaultProps.keyboard,
  keySignature = defaultProps.keySignature,
  sustained,
  played,
  midi,
  chord,
}) => {
  const pianoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pianoRef.current) {
      fadeNotes(pianoRef.current, 'played');
      fadeNotes(pianoRef.current, 'sustained');
      fadeNotes(pianoRef.current, 'wrapPlayed');
      fadeNotes(pianoRef.current, 'wrapSustained');

      if (played) {
        highlightNotes(pianoRef.current, played, 'played');
        if (keyboard.wrap) {
          highlightWrapNotes(pianoRef.current, keyboard.from, keyboard.to, played, 'wrapPlayed');
        }
      }

      if (sustained && keyboard.displaySustained) {
        highlightNotes(pianoRef.current, sustained, 'sustained');
        if (keyboard.wrap) {
          highlightWrapNotes(
            pianoRef.current,
            keyboard.from,
            keyboard.to,
            sustained,
            'wrapSustained'
          );
        }
      }

      fadeLabels(pianoRef.current);

      if (midi) {
        if (keyboard.wrap) {
          if (keyboard.displaySustained) {
            highlightWrapLabels(pianoRef.current, keySignature, keyboard, midi, chord);
          } else {
            highlightWrapLabels(pianoRef.current, keySignature, keyboard, midi, chord);
          }
        }

        if (keyboard.displaySustained) {
          highlightLabels(pianoRef.current, keySignature, keyboard, midi, chord);
        } else {
          highlightLabels(pianoRef.current, keySignature, keyboard, played, chord);
        }
      }
    }
  }, [played, sustained, midi, chord, keyboard, keySignature]);

  useEffect(() => {
    if (pianoRef.current) {
      fadeInfo(pianoRef.current);
      highlightInfo(pianoRef.current, keyboard.keyInfo, chord);
    }
  }, [chord, keyboard]);

  const style = {
    '--PianoKeyboard-white_background': keyboard.colors.white,
    '--PianoKeyboard-white_color': getContrastColor(keyboard.colors.white ?? '#ffffff'),
    '--PianoKeyboard-black_background': keyboard.colors.black,
    '--PianoKeyboard-black_color': getContrastColor(keyboard.colors.black ?? '#000000'),
    '--PianoKeyboard--played_background': keyboard.colors.played,
    '--PianoKeyboard--played_color': getContrastColor(keyboard.colors.played ?? '#ff0000'),
    '--PianoKeyboard--sustained_background': keyboard.colors.sustained,
    '--PianoKeyboard--sustained_color': getContrastColor(keyboard.colors.sustained ?? '#777777'),
    '--PianoKeyboard--wrapPlayed_background': keyboard.colors.wrapped ?? '#800000',
    '--PianoKeyboard--wrapPlayed_color': getContrastColor(keyboard.colors.wrapped ?? '#800000'),
    '--PianoKeyboard--wrapSustained_background': keyboard.colors.sustained ?? '#777777',
    '--PianoKeyboard--wrapSustained_color': getContrastColor(
      keyboard.colors.sustained ?? '#777777'
    ),
    '--PianoKeyboard-fadeOut_duration': `${keyboard.fadeOutDuration}s`,
    '--PianoKeyboard-text_opacity': `${keyboard.textOpacity}`,
  } as React.CSSProperties;

  return (
    <div ref={pianoRef} id={id} className={className} style={style}>
      {keyboard.skin === 'classic' && (
        <ClassicPiano keyboard={keyboard} keySignature={keySignature} />
      )}
      {keyboard.skin === 'flat' && <FlatPiano keyboard={keyboard} keySignature={keySignature} />}
    </div>
  );
};

PianoKeyboard.defaultProps = defaultProps;

export default PianoKeyboard;
