import React, { useRef, useCallback } from 'react';
import classnames from 'classnames/bind';

import { MidiMessage } from 'main/types';

import useMidiMessages from 'renderer/hooks/useMidiMessages';
import Toolbar from 'renderer/components/Toolbar';
import Button from 'renderer/components/Button';

import Icon from 'renderer/components/Icon';
import { formatMidiMessage } from './utils';

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
  const preElementRef = useRef<HTMLPreElement>(document.createElement('pre'));

  const onMessages = useCallback(
    (messages: Array<[MidiMessage, number, string]>) => {
      if (preElementRef.current) {
        const formatted = messages.reduce(
          (out, [message, timestamp, device]) =>
            out
              .concat('[')
              .concat(timestamp.toFixed(4))
              .concat('] ')
              .concat(device)
              .concat(': ')
              .concat(formatMidiMessage(message))
              .concat('\n'),
          ''
        );
        preElementRef.current.append(formatted);
        preElementRef.current.scrollTop = preElementRef.current.scrollHeight;
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    if (preElementRef.current) {
      preElementRef.current.innerHTML = '';
    }
  }, []);

  useMidiMessages(onMessages);

  return (
    <div className={cx('base', className)}>
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
