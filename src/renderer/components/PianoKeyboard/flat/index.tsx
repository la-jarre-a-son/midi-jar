import React from 'react';
import { Note } from 'tonal';
import classnames from 'classnames/bind';

import { KeyboardSettings } from 'main/types';
import { defaultKeyboardSettings } from 'main/store/defaults';

import { range } from 'renderer/helpers';
import {
  formatSharpsFlats,
  getKeySignature,
  getNoteInKeySignature,
  KeySignatureConfig,
} from 'renderer/helpers/note';

import { getKeyboardSizes } from './constants';
import { KeyboardKeys, NoteDef } from './types';
import Board from './Board';
import Labels from './Labels';

import styles from './flat.module.scss';

const cx = classnames.bind(styles);

type KeyboardProps = {
  keyboard?: KeyboardSettings;
  keySignature?: KeySignatureConfig;
  withTargets?: boolean;
};

const defaultProps = {
  keyboard: defaultKeyboardSettings,
  keySignature: getKeySignature('C'),
  withTargets: false,
};

const Keyboard: React.FC<KeyboardProps> = ({
  keyboard = defaultProps.keyboard,
  keySignature = defaultProps.keySignature,
  withTargets,
}) => {
  const sizes = getKeyboardSizes(keyboard);

  const fromProps = Note.get(Note.simplify(keyboard.from) || defaultProps.keyboard.from);
  const toProps = Note.get(Note.simplify(keyboard.to) || defaultProps.keyboard.to);

  const noteStart = fromProps.midi as number;
  const noteEnd = toProps.midi as number;

  const start = Math.min(noteStart, noteEnd);
  const end = Math.max(noteStart, noteEnd);
  const keys = range(start, end).reduce<KeyboardKeys>(
    (kb: KeyboardKeys, midi: number) => {
      const note = Note.fromMidi(midi);
      const noteDef = Note.get(note);

      let displayName = '';

      switch (keyboard.keyName) {
        case 'note':
          displayName = formatSharpsFlats(getNoteInKeySignature(note, keySignature.notes));
          break;
        case 'pitchClass':
          displayName = formatSharpsFlats(
            getNoteInKeySignature(Note.pitchClass(note), keySignature.notes)
          );
          break;
        case 'octave':
          displayName =
            noteDef.chroma === 0
              ? formatSharpsFlats(getNoteInKeySignature(note, keySignature.notes))
              : '';
          break;
        default:
      }

      const def: NoteDef = {
        displayName,
        note: noteDef,
        offset: kb.width,
        labelOffset: kb.width + sizes.WIDTH / 2,
        isBlack: !!noteDef.alt,
      };

      return {
        width: kb.width + sizes.WIDTH,
        height: kb.height,
        notes: [...kb.notes, def],
      };
    },
    {
      width: 0,
      height: sizes.HEIGHT,
      notes: [],
    } as KeyboardKeys
  );

  return (
    <svg
      className={cx('keyboard', { '--withTargets': withTargets })}
      viewBox={`0 0 ${keys.width} ${
        keyboard.label !== 'none' ? keys.height + sizes.LABEL_HEIGHT : keys.height
      }`}
    >
      {keyboard.label !== 'none' && <Labels keys={keys} sizes={sizes} />}
      <Board keyboard={keyboard} notes={keys.notes} sizes={sizes} />
    </svg>
  );
};

Keyboard.defaultProps = defaultProps;

export default React.memo(Keyboard);
