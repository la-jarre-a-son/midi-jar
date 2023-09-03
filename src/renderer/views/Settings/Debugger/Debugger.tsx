import React, { useRef, useCallback, useState } from 'react';
import classnames from 'classnames/bind';

import { Button, ToggleButton, Box, Toolbar } from '@la-jarre-a-son/ui';

import { MidiMessage } from 'main/types';

import { getMidiCommand } from 'renderer/helpers';
import useMidiMessages from 'renderer/hooks/useMidiMessages';
import { Icon } from 'renderer/components';

import { formatMidiMessage } from './utils';
import { MIDI_CMD, MIDI_CLOCK_CMD, MIDI_SYSEX_CMD } from './constants';

import styles from './Debugger.module.scss';

const cx = classnames.bind(styles);

const Debugger: React.FC = () => {
  const [displayTimingClock, setDisplayTimingClock] = useState(false);

  const preElementRef = useRef<HTMLPreElement>(document.createElement('pre'));

  const shouldDisplayMessage = useCallback(
    (m: MidiMessage) => {
      const cmd = getMidiCommand(m);

      if (cmd === MIDI_SYSEX_CMD) {
        const fCmd = m[0] as keyof typeof MIDI_CMD;

        if (!displayTimingClock && fCmd === MIDI_CLOCK_CMD) {
          return false;
        }
      }

      return true;
    },
    [displayTimingClock]
  );

  const onMessages = useCallback(
    (messages: Array<[MidiMessage, number, string]>) => {
      if (preElementRef.current) {
        const formatted = messages.reduce(
          (out, [message, timestamp, device]) =>
            shouldDisplayMessage(message)
              ? out
                  .concat('[')
                  .concat(timestamp.toFixed(4))
                  .concat('] ')
                  .concat(device)
                  .concat(': ')
                  .concat(formatMidiMessage(message))
                  .concat('\n')
              : out,
          ''
        );
        preElementRef.current.append(formatted);
        preElementRef.current.scrollTop = preElementRef.current.scrollHeight;
      }
    },
    [shouldDisplayMessage]
  );

  const clearMessages = useCallback(() => {
    if (preElementRef.current) {
      preElementRef.current.innerHTML = '';
    }
  }, []);

  const toggleTimingClock = () => setDisplayTimingClock((v) => !v);

  useMidiMessages(onMessages);

  return (
    <>
      <Toolbar elevation={2}>
        <ToggleButton onClick={toggleTimingClock} selected={displayTimingClock}>
          <Icon name="clock" />
          MIDI Clock
        </ToggleButton>
      </Toolbar>
      <Box pad="md" className={cx('container')}>
        <Box
          as="pre"
          elevation={1}
          pad="md"
          className={cx('output')}
          ref={preElementRef}
          outlined
        />
      </Box>
      <Toolbar elevation={2} placement="bottom">
        <Button onClick={clearMessages} intent="neutral" left={<Icon name="trash" />}>
          Clear messages
        </Button>
      </Toolbar>
    </>
  );
};

export default Debugger;
