import React, { useMemo } from 'react';
import classnames from 'classnames/bind';
import { getBezierPath, EdgeProps } from 'react-flow-renderer';

import { ApiMidiWire } from 'main/types/api';

import Icon from 'renderer/components/Icon';

import styles from './Wire.module.scss';

const cx = classnames.bind(styles);

const FOREIGN_OBJECT_SIZE = 32;

type Props = EdgeProps<{
  wire: ApiMidiWire;
  onDelete: (wire: ApiMidiWire) => void;
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

  const { x: positionX, y: positionY } = useMemo(() => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', edgePath);
    const position = path.getPointAtLength(path.getTotalLength() * 0.75);
    path.remove();
    return position;
  }, [edgePath]);

  const onClick = () => data && data.onDelete && data.onDelete(data.wire);

  return (
    <>
      <path
        id={id}
        style={style}
        className={cx('react-flow__edge-path', 'path')}
        d={edgePath}
      />
      <foreignObject
        width={FOREIGN_OBJECT_SIZE}
        height={FOREIGN_OBJECT_SIZE}
        x={positionX - FOREIGN_OBJECT_SIZE / 2}
        y={positionY - FOREIGN_OBJECT_SIZE / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className={cx('container')}>
          <button type="button" className={cx('button')} onClick={onClick}>
            <Icon name="cross" />
          </button>
        </div>
      </foreignObject>
    </>
  );
};

export default CustomEdge;
