import React, { useCallback, useState, useRef } from 'react';
import classNames from 'classnames/bind';

import { Note } from '@tonaljs/tonal';
import { Input } from '../Input';
import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { MidiLearn } from '../MidiLearn';

import { InputNoteProps } from './types';

import styles from './InputNote.module.scss';

const cx = classNames.bind(styles);

const NOTES = 'A B C D E F G'.split(' ');
const ACCIDENTALS = '# b'.split(' ');
const OCTAVES = '0 1 2 3 4 5 6 7 8 9'.split(' ');

export const InputNote: React.FC<InputNoteProps> = ({
  className,
  id,
  value,
  onChange,
  block,
  withOctave,
  learn,
  ...rest
}) => {
  const [learning, setLearning] = useState(false);
  const learningPromise = useRef<Promise<void> | null>(null);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const currentNote = Note.get(value?.toString() || '');

      if (currentNote.empty && NOTES.includes(event.key)) return;
      if (
        currentNote.letter &&
        (currentNote.oct === undefined || currentNote.oct === null) &&
        !currentNote.acc &&
        ACCIDENTALS.includes(event.key)
      )
        return;

      if (
        currentNote.letter &&
        (currentNote.oct === undefined || currentNote.oct === null) &&
        event.key === currentNote.acc[0]
      )
        return;

      if (
        withOctave &&
        currentNote.letter &&
        (currentNote.oct === undefined || currentNote.oct === null) &&
        OCTAVES.includes(event.key)
      )
        return;

      event.preventDefault();
    },
    [value, withOctave]
  );

  const toggleLearning = () => setLearning((v) => !v);

  const handleLearn = useCallback(
    (midi: number) => {
      const inputNote = Note.fromMidi(midi);
      const note = Note.get(inputNote);
      if (withOctave) {
        onChange(note.name);
      } else {
        onChange(note.pc);
      }
      learningPromise.current = Promise.resolve();
      setLearning(false);
    },
    [onChange, withOctave]
  );

  return (
    <ButtonGroup>
      <Input
        className={cx('base', className)}
        id={id}
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        block={block}
        type="text"
        {...rest}
      />
      {learn ? (
        <Button
          className={cx('learn')}
          onClick={toggleLearning}
          intent={learning ? 'success' : 'default'}
        >
          {learning ? '...' : 'Learn'}
        </Button>
      ) : null}
      {learning ? <MidiLearn type="note" onLearn={handleLearn} /> : null}
    </ButtonGroup>
  );
};

InputNote.defaultProps = {
  className: undefined,
  block: false,
  withOctave: false,
  learn: false,
};

export default InputNote;
