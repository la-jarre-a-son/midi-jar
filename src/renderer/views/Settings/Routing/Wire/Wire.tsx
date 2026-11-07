import React, { useMemo } from 'react';
import classnames from 'classnames/bind';
import { getBezierPath, EdgeProps } from 'react-flow-renderer';

import { ApiMidiWire } from 'main/types/api';
import { Icon } from 'renderer/components';

import styles from './Wire.module.scss';

const cx = classnames.bind(styles);
const MAP_BUTTON_WIDTH = 36;
const BUTTON_SIZE = 22;

type Props = EdgeProps<{
  wire: ApiMidiWire;
  onDelete: (wire: ApiMidiWire) => void;
  onToggleChannelMap: (wire: ApiMidiWire) => void;
}>;

const CustomEdge: React.FC<Props> = ({
  id,
  data,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
}) => {
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Put the channel-map control close to the input node (the source end).
  // Keep route deletion farther along the wire to avoid crowding the port.
  const { mapPosition, deletePosition } = useMemo(() => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', edgePath);
    const length = path.getTotalLength();
    const map = path.getPointAtLength(length * 0.1);
    const remove = path.getPointAtLength(length * 0.75);
    path.remove();
    return { mapPosition: map, deletePosition: remove };
  }, [edgePath]);

  const onDelete = () => data && data.onDelete && data.onDelete(data.wire);
  const onToggle = () => data && data.onToggleChannelMap && data.onToggleChannelMap(data.wire);
  const mapped = !!data?.wire.route.mapChannel2To1;

  return (
    <>
      <path id={id} style={style} className={cx('react-flow__edge-path', 'path')} d={edgePath} />

      <foreignObject
        width={MAP_BUTTON_WIDTH}
        height={28}
        x={mapPosition.x - MAP_BUTTON_WIDTH / 2}
        y={mapPosition.y - 14}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className={cx('mapContainer')}>
          <button
            type="button"
            className={cx('mapButton', { active: mapped })}
            title={mapped ? 'CH2 → CH1 mapping: ON' : 'CH2 → CH1 mapping: OFF'}
            onClick={onToggle}
          >
            2→1
          </button>
        </div>
      </foreignObject>

      <foreignObject
        width={BUTTON_SIZE}
        height={BUTTON_SIZE}
        x={deletePosition.x - BUTTON_SIZE / 2}
        y={deletePosition.y - BUTTON_SIZE / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className={cx('container')}>
          <button type="button" className={cx('button')} title="Delete route" onClick={onDelete}>
            <Icon name="cross" />
          </button>
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;
