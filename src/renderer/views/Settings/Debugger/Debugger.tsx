import React, { useRef, useCallback, useState } from 'react';
import classnames from 'classnames/bind';

import { MidiMessage } from 'main/types';

import { getMidiCommand } from 'renderer/helpers';
import useMidiMessages from 'renderer/hooks/useMidiMessages';
import { Toolbar, Button, Icon } from 'renderer/components';

import { formatMidiMessage } from './utils';
import { MIDI_CMD, MIDI_CLOCK_CMD, MIDI_SYSEX_CMD } from './constants';

import styles from './Debugger.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

/**
 *  Debugger settings page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const Debugger: React.FC<Props> = ({ className }) => {
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
    <div className={cx('base', className)}>
      <Toolbar className={cx('header')}>
        <Button onClick={toggleTimingClock} intent={displayTimingClock ? 'primary' : 'default'}>
          <Icon name="clock" />
          MIDI Clock
        </Button>
      </Toolbar>
      <div className={cx('container')}>
        <pre className={cx('output')} ref={preElementRef} />
      </div>
      <Toolbar bottom>
        <Button onClick={clearMessages}>
          <Icon name="trash" />
          Clear messages
        </Button>
      </Toolbar>
    </div>
  );
};

Debugger.defaultProps = defaultProps;

export default Debugger;
