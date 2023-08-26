import React, { useEffect, useRef, useMemo } from 'react';
import classnames from 'classnames/bind';
import {
  Accidental,
  Formatter,
  Renderer,
  Stave,
  StaveConnector,
  Modifier,
  Voice,
  BarlineType,
} from 'vexflow';

import { formatSharpsFlats } from 'renderer/helpers/note';

import { NotationProps } from './types';
import { getTransposedNotes, getVoice } from './utils';

import styles from './Notation.module.scss';

const cx = classnames.bind(styles);

const NOTATION_HEIGHT = 300;
const STAVE_NOTE_WIDTH = 200;
const STAVE_TREBLE_Y = 70;
const STAVE_BASS_Y = 130;
const ALTERATION_WIDTH = 8;

export const Notation: React.FC<NotationProps> = ({
  id,
  className,
  midiNotes,
  keySignature,
  staffClef,
  staffTranspose,
}) => {
  const notes = useMemo(
    () => getTransposedNotes(midiNotes ?? [], keySignature.notes, staffTranspose),
    [midiNotes, keySignature, staffTranspose]
  );

  const container = useRef<HTMLDivElement | null>(null);
  const renderer = useRef<Renderer | null>(null);

  useEffect(() => {
    if (!renderer.current && container.current) {
      renderer.current = new Renderer(container.current, Renderer.Backends.SVG);
    }

    if (renderer.current) {
      const keySignatureWidth = ALTERATION_WIDTH * Math.abs(keySignature.alteration);
      const staveWidth = STAVE_NOTE_WIDTH + keySignatureWidth;
      renderer.current.resize(staveWidth, NOTATION_HEIGHT);

      const context = renderer.current.getContext();
      context.setFont('Arial', 10, '').setBackgroundFillStyle('#f00');

      context.clear();

      if (staffClef === 'both') {
        const staveTreble = new Stave(0, STAVE_TREBLE_Y, staveWidth);
        staveTreble.addClef('treble');
        staveTreble.addKeySignature(keySignature.tonic);
        staveTreble.setText(
          `Key: ${formatSharpsFlats(keySignature.tonic)}`,
          Modifier.Position.ABOVE,
          {
            justification: 0,
          }
        );
        staveTreble.setBegBarType(BarlineType.NONE);
        staveTreble.setNoteStartX(60 + keySignatureWidth);
        staveTreble.setContext(context).draw();

        const staveBass = new Stave(0, STAVE_BASS_Y, staveWidth);
        staveBass.addClef('bass');
        staveBass.addKeySignature(keySignature.tonic);
        staveBass.setBegBarType(BarlineType.NONE);
        staveBass.setNoteStartX(60 + keySignatureWidth);
        staveBass.setContext(context).draw();

        const connector = new StaveConnector(staveTreble, staveBass);
        connector.setType('single');
        connector.setContext(context).draw();

        if (notes && notes.length) {
          const voiceTreble = getVoice(notes, 'treble');
          const voiceBass = getVoice(notes, 'bass');

          const formatter = new Formatter();

          if (voiceTreble) {
            Accidental.applyAccidentals([voiceTreble], keySignature.tonic);
            formatter.joinVoices([voiceTreble]);
            //   .formatToStave([voiceTreble], staveTreble);
          }
          if (voiceBass) {
            Accidental.applyAccidentals([voiceBass], keySignature.tonic);
            formatter.joinVoices([voiceBass]);
            //   .formatToStave([voiceBass], staveBass);
          }

          if (voiceTreble || voiceBass) {
            const v = [voiceTreble, voiceBass].filter(Boolean) as Voice[];
            formatter.createTickContexts(v);
            formatter.preFormat(STAVE_NOTE_WIDTH, context, v);
          }

          if (voiceTreble) {
            voiceTreble.draw(context, staveTreble);
          }
          if (voiceBass) {
            voiceBass.draw(context, staveBass);
          }
        }
      } else if (staffClef === 'bass' || staffClef === 'treble') {
        const stave = new Stave(
          0,
          staffClef === 'bass' ? STAVE_BASS_Y : STAVE_TREBLE_Y,
          staveWidth
        );
        stave.addClef(staffClef);
        stave.addKeySignature(keySignature.tonic);
        stave.setText(`Key: ${formatSharpsFlats(keySignature.tonic)}`, Modifier.Position.ABOVE, {
          justification: 0,
        });
        stave.setBegBarType(BarlineType.NONE);
        stave.setNoteStartX(60 + keySignatureWidth);
        stave.setContext(context).draw();

        if (notes && notes.length) {
          const voice = getVoice(notes, staffClef, false);

          const formatter = new Formatter();

          if (voice) {
            Accidental.applyAccidentals([voice], keySignature.tonic);
            formatter.joinVoices([voice]).formatToStave([voice], stave);

            voice.draw(context, stave);
          }
        }
      }
    }
  }, [notes, staffClef, keySignature]);

  return <div id={id} ref={container} className={cx('base', className)} />;
};

Notation.defaultProps = {
  id: undefined,
  className: undefined,
  midiNotes: [],
  staffClef: 'both' as const,
  staffTranspose: 0,
};

export default Notation;
