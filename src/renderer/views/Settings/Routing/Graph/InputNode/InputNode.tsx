import React, { useRef, useCallback } from 'react';
import classnames from 'classnames/bind';
import { NodeProps, Handle, Position } from 'react-flow-renderer';

import useMidiActivity from 'renderer/hooks/useMidiActivity';

import { ApiMidiInput } from 'main/types/api';

import Icon from 'renderer/components/Icon';

import styles from './InputNode.module.scss';

const INPUT_STATUS_TIMEOUT = 300;

const cx = classnames.bind(styles);

type Props = NodeProps & {
  data: {
    input: ApiMidiInput;
  };
};

const InputNode: React.FC<Props> = ({ data }) => {
  const statusElementRef = useRef<HTMLDivElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onActivity = useCallback(() => {
    if (statusElementRef.current) {
      if (timeout.current) clearTimeout(timeout.current);
      statusElementRef.current?.classList.add(cx('active'));
      timeout.current = setTimeout(() => {
        statusElementRef.current?.classList.remove(cx('active'));
        timeout.current = null;
      }, INPUT_STATUS_TIMEOUT);
    }
  }, []);

  useMidiActivity(data.input.name, onActivity);

  return (
    <div
      className={cx('container', {
        isOpened: data.input.opened,
        isDisconnected: !data.input.connected,
      })}
    >
      <Handle
        className={cx('handle')}
        type="source"
        position={Position.Right}
      />
      <div className={cx('name')}>
        <Icon name="midi" /> {data.input.name}
      </div>
      <div className={cx('footer')}>
        {data.input.error && (
          <div className={cx('error')}>
            <Icon name="midi-error" /> error
          </div>
        )}
        <div ref={statusElementRef} className={cx('activity')} />
      </div>
    </div>
  );
};

export default InputNode;
