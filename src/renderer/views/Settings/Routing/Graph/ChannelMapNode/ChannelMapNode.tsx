import React from 'react';
import classnames from 'classnames/bind';
import { NodeProps, Handle, Position } from 'react-flow-renderer';
import { ApiMidiRoute } from 'main/types/api';
import styles from './ChannelMapNode.module.scss';

const cx = classnames.bind(styles);
type Data = { route: ApiMidiRoute; onChange: (route: ApiMidiRoute) => void };
const ChannelMapNode: React.FC<NodeProps<Data>> = ({ data }) => {
  const mapping = data.route.channelMap || { from: 2, to: 1 };
  const update = (from: number, to: number) =>
    data.onChange({
      ...data.route,
      channelMap: { from, to },
      mapChannel2To1: from === 2 && to === 1,
    });
  return (
    <div className={cx('container')}>
      <Handle type="target" position={Position.Left} className={cx('handle')} />
      <div className={cx('title')}>MIDI CH</div>
      <div className="nodrag">
        <div className={cx('selectors', 'nodrag')}>
          <select
            className="nodrag"
            aria-label="Source channel"
            value={mapping.from}
            onMouseDown={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onChange={(event) => update(Number(event.target.value), mapping.to)}
          >
            {Array.from({ length: 16 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <span>→</span>
          <select
            className="nodrag"
            aria-label="Destination channel"
            value={mapping.to}
            onMouseDown={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onChange={(event) => update(mapping.from, Number(event.target.value))}
          >
            {Array.from({ length: 16 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className={cx('handle')} />
    </div>
  );
};
export default ChannelMapNode;
