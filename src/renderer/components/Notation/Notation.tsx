import React, { useEffect, useRef } from 'react';
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

import { formatSharpsFlats, KeySignatureConfig } from '../../helpers/note';

import { getVoice } from './utils';

import styles from './Notation.module.scss';

const NOTATION_HEIGHT = 300;
const STAVE_NOTE_WIDTH = 200;
const ALTERATION_WIDTH = 8;

const cx = classnames.bind(styles);

type Props = {
  id?: string;
  className?: string;
  notes?: string[];
  keySignature: KeySignatureConfig;
};

const defaultProps = {
  id: undefined,
  className: undefined,
  notes: [],
};

const Notation: React.FC<Props> = ({ id, className, notes, keySignature }) => {
  const container = useRef<HTMLDivElement | null>(null);
  const renderer = useRef<Renderer | null>(null);

  useEffect(() => {
    if (!renderer.current && container.current) {
      renderer.current = new Renderer(container.current, Renderer.Backends.SVG);
    }

    if (renderer.current) {
      const keySignatureWidth =
        ALTERATION_WIDTH * Math.abs(keySignature.alteration);
      const staveWidth = STAVE_NOTE_WIDTH + keySignatureWidth;
      renderer.current.resize(staveWidth, NOTATION_HEIGHT);

      const context = renderer.current.getContext();
      context.setFont('Arial', 10, '').setBackgroundFillStyle('#f00');

      context.clear();

      const staveTreble = new Stave(0, 70, staveWidth);
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

      const staveBass = new Stave(0, 130, staveWidth);
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
    }
  }, [notes, keySignature]);

  return <div id={id} ref={container} className={cx('base', className)} />;
};

Notation.defaultProps = defaultProps;

export default Notation;
