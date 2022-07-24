import React from 'react';
import classnames from 'classnames/bind';
import { NodeProps, Handle, Position } from 'react-flow-renderer';

import { ApiMidiOutput } from 'main/types/api';

import Icon from 'renderer/components/Icon';

import styles from './OutputNode.module.scss';

const cx = classnames.bind(styles);

type Props = NodeProps & {
  data: {
    output: ApiMidiOutput;
  };
};

const OutputNode: React.FC<Props> = ({ data }) => {
  return (
    <div
      className={cx('container', {
        isInternal: data.output.type === 'internal',
        isPhysical: data.output.type === 'physical',
        isWebsocket: data.output.type === 'websocket',
        isOpened: data.output.opened,
        isDisconnected: !data.output.connected,
      })}
    >
      <Handle className={cx('handle')} type="target" position={Position.Left} />
      <div className={cx('name')}>
        {data.output.type === 'internal' && <Icon name="window" />}
        {data.output.type === 'physical' && <Icon name="midi" />}
        {data.output.type === 'websocket' && <Icon name="overlay" />}
        &nbsp;
        {data.output.name}
      </div>
      {data.output.type === 'physical' && (
        <div className={cx('footer')}>
          {data.output.error && (
            <div className={cx('error')}>
              <Icon name="midi-error" /> error
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OutputNode;
