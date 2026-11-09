import React, { useEffect, useMemo, useRef, useState } from 'react';
import classnames from 'classnames/bind';
import { getBezierPath, EdgeProps } from 'react-flow-renderer';
import { ApiMidiWire } from 'main/types/api';
import { Icon } from 'renderer/components';
import styles from './Wire.module.scss';

const cx = classnames.bind(styles);
const BADGE_WIDTH = 46;
const BADGE_HEIGHT = 30;
const DELETE_SIZE = 28;
const DEFAULT_POSITION = 0.16;
const DEFAULT_WIRE_OFFSET = 0;

const shiftBezierPath = (pathData: string, normalX: number, normalY: number, offset: number) => {
  const values = pathData.match(/-?\d+(?:\.\d+)?/g)?.map(Number);
  if (!values || values.length < 8) return pathData;
  const [sx, sy, c1x, c1y, c2x, c2y, tx, ty] = values;
  return `M${sx},${sy} C${c1x + normalX * offset},${c1y + normalY * offset} ${
    c2x + normalX * offset
  },${c2y + normalY * offset} ${tx},${ty}`;
};

const getPathPointAtFraction = (pathData: string, fraction: number) => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttributeNS(null, 'd', pathData);
  const length = path.getTotalLength();
  const point = path.getPointAtLength(length * fraction);
  path.remove();
  return point;
};

type Props = EdgeProps<{
  wire: ApiMidiWire;
  onDelete: (wire: ApiMidiWire) => void;
  onEnableChannelMap: (
    wire: ApiMidiWire,
    initialChannel?: number,
    initialFraction?: number
  ) => void;
  onRemoveChannelMap: (wire: ApiMidiWire) => void;
  onChangeChannelMap: (wire: ApiMidiWire, from: number, to: number) => void;
  onMoveChannelMap: (wire: ApiMidiWire, offset: number) => void;
  onMoveChannelMapPosition: (wire: ApiMidiWire, fraction: number) => void;
  onMoveChannelMapAndPosition: (wire: ApiMidiWire, offset: number, fraction: number) => void;
  editing: boolean;
  badgeFraction?: number;
  currentChannel?: number | null;
  onToggleEditor: () => void;
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
  const pathRef = useRef<SVGPathElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startLocalX: number;
    startLocalY: number;
    startOffset: number;
    offset: number;
    moved: boolean;
    inverse: DOMMatrix;
    normalX: number;
    normalY: number;
    pathData: string;
    startFraction: number;
    badgeGain: number;
    tangentX: number;
    tangentY: number;
    pathLength: number;
    fraction: number;
  } | null>(null);
  const previewFrameRef = useRef<number | null>(null);
  const pendingOffsetRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const [previewOffset, setPreviewOffset] = useState<number | null>(null);
  const [previewFraction, setPreviewFraction] = useState<number | null>(null);
  const route = data?.wire.route;
  const mapping = route?.channelMap || (route?.mapChannel2To1 ? { from: 2, to: 1 } : undefined);
  const currentChannel = data?.currentChannel ?? data?.wire.currentChannel ?? null;
  const channelMark = (channel: number | null | undefined) =>
    channel ? String.fromCharCode(0x2460 + channel - 1) : '';
  const badgeText = mapping
    ? `${channelMark(mapping.from)}>>>${channelMark(mapping.to)}`
    : channelMark(currentChannel);
  const savedFraction =
    typeof route?.channelMapPosition?.x === 'number'
      ? route.channelMapPosition.x
      : data?.badgeFraction ?? DEFAULT_POSITION;
  const activeFraction = previewFraction ?? savedFraction;
  const savedOffset =
    typeof route?.wireOffset === 'number' ? route.wireOffset : DEFAULT_WIRE_OFFSET;
  const directionX = targetX - sourceX;
  const directionY = targetY - sourceY;
  const directionLength = Math.max(1, Math.hypot(directionX, directionY));
  const normal = { x: -directionY / directionLength, y: directionX / directionLength };
  const activeOffset = previewOffset ?? savedOffset;

  // Keep the optimistic preview visible until the route update comes back from
  // the main process. Clearing it on a timer makes the wire jump back briefly.
  useEffect(() => {
    const pending = pendingOffsetRef.current;
    if (pending !== null && Math.abs(savedOffset - pending) < 0.5) {
      pendingOffsetRef.current = null;
      setPreviewOffset(null);
    }
  }, [savedOffset]);
  useEffect(() => {
    if (previewFraction !== null && Math.abs(savedFraction - previewFraction) < 0.002) {
      setPreviewFraction(null);
    }
  }, [savedFraction, previewFraction]);
  // Keep both endpoints attached to their ports; shift the two Bézier control points
  // perpendicular to the connection so the complete wire fans away from overlapping wires.
  const shiftedPath = useMemo(
    () => shiftBezierPath(edgePath, normal.x, normal.y, activeOffset),
    [edgePath, normal.x, normal.y, activeOffset]
  );

  const positions = useMemo(() => {
    return {
      badge: getPathPointAtFraction(shiftedPath, activeFraction),
      remove: getPathPointAtFraction(shiftedPath, 0.78),
    };
  }, [shiftedPath, activeFraction]);

  const onDelete = () => data?.onDelete?.(data.wire);
  const onBadgeClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    if (!mapping) data?.onEnableChannelMap?.(data.wire, currentChannel || 1, savedFraction);
    else data?.onToggleEditor?.();
  };
  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    const matrix = pathRef.current?.getScreenCTM();
    const svg = pathRef.current?.ownerSVGElement;
    if (!svg || !matrix) return;

    const inverse = matrix.inverse();
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(inverse);

    // Work out the local path tangent at the badge. Motion along the tangent
    // moves the badge along the wire; motion perpendicular to it bends the wire.
    const epsilon = 0.005;
    const before = getPathPointAtFraction(shiftedPath, Math.max(0, activeFraction - epsilon));
    const after = getPathPointAtFraction(shiftedPath, Math.min(1, activeFraction + epsilon));
    const tangentLength = Math.max(1, Math.hypot(after.x - before.x, after.y - before.y));
    const tangentX = (after.x - before.x) / tangentLength;
    const tangentY = (after.y - before.y) / tangentLength;
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttributeNS(null, 'd', shiftedPath);
    const pathLength = pathElement.getTotalLength();
    pathElement.remove();

    const offsetPath = shiftBezierPath(edgePath, normal.x, normal.y, activeOffset + 1);
    const offsetPoint = getPathPointAtFraction(offsetPath, activeFraction);
    const currentPoint = getPathPointAtFraction(shiftedPath, activeFraction);
    const badgeGain = Math.max(
      0.1,
      Math.abs(
        (offsetPoint.x - currentPoint.x) * normal.x + (offsetPoint.y - currentPoint.y) * normal.y
      )
    );

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    suppressClickRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startLocalX: local.x,
      startLocalY: local.y,
      startOffset: activeOffset,
      offset: activeOffset,
      moved: false,
      inverse,
      normalX: normal.x,
      normalY: normal.y,
      pathData: shiftedPath,
      startFraction: activeFraction,
      badgeGain,
      tangentX,
      tangentY,
      pathLength,
      fraction: activeFraction,
    };
  };

  const onPointerMove = (event: PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.moved && Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) < 3)
      return;

    drag.moved = true;
    const svg = pathRef.current?.ownerSVGElement;
    if (!svg) return;

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const local = point.matrixTransform(drag.inverse);
    const deltaX = local.x - drag.startLocalX;
    const deltaY = local.y - drag.startLocalY;

    // One continuous gesture: perpendicular movement moves the wire itself,
    // while movement along the wire repositions the channel badge on it.
    // Project the pointer movement onto the local wire tangent and the wire's
    // perpendicular offset axis independently. Solving a 2x2 basis here becomes
    // unstable when a curved wire's tangent approaches the global offset axis;
    // those wires used to feel locked depending on their angle.
    const tangentDelta = deltaX * drag.tangentX + deltaY * drag.tangentY;
    const normalDelta = deltaX * drag.normalX + deltaY * drag.normalY;
    drag.offset = drag.startOffset + normalDelta / drag.badgeGain;
    drag.fraction = Math.max(
      0.02,
      Math.min(0.98, drag.startFraction + tangentDelta / Math.max(1, drag.pathLength))
    );

    if (previewFrameRef.current === null) {
      previewFrameRef.current = window.requestAnimationFrame(() => {
        previewFrameRef.current = null;
        const { current } = dragRef;
        if (current?.moved) {
          setPreviewOffset(current.offset);
          setPreviewFraction(current.fraction);
        }
      });
    }
  };

  const finishDrag = (event: PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (previewFrameRef.current !== null) {
      window.cancelAnimationFrame(previewFrameRef.current);
      previewFrameRef.current = null;
    }

    dragRef.current = null;
    if (!drag.moved) return;

    suppressClickRef.current = true;
    setPreviewFraction(drag.fraction);
    const offsetChanged = Math.abs(drag.offset - drag.startOffset) > 0.5;
    const fractionChanged = Math.abs(drag.fraction - drag.startFraction) > 0.002;

    if (offsetChanged) {
      setPreviewOffset(drag.offset);
      pendingOffsetRef.current = drag.offset;
    } else {
      setPreviewOffset(null);
    }

    // Commit both values in one route update. Sending separate updates built
    // from the same stale wire object caused the second update to overwrite
    // the new wireOffset, making the wire snap back after pointer release.
    if (offsetChanged || fractionChanged) {
      data?.onMoveChannelMapAndPosition?.(data.wire, drag.offset, drag.fraction);
    }
  };

  const cancelDrag = (event: PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (previewFrameRef.current !== null) {
      window.cancelAnimationFrame(previewFrameRef.current);
      previewFrameRef.current = null;
    }

    dragRef.current = null;
    setPreviewOffset(pendingOffsetRef.current ?? savedOffset);
    setPreviewFraction(null);
  };
  // Pointer capture inside foreignObject is inconsistent across browsers.
  // Listen on window so dragging continues even when the pointer leaves the badge.
  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', finishDrag);
    window.addEventListener('pointercancel', cancelDrag);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', finishDrag);
      window.removeEventListener('pointercancel', cancelDrag);
    };
  });

  const onChange = (from: number, to: number) => data?.onChangeChannelMap?.(data.wire, from, to);

  const badgeWidth = mapping ? 88 : BADGE_WIDTH;
  const badgeHeight = BADGE_HEIGHT;

  return (
    <>
      <path
        ref={pathRef}
        id={id}
        style={{ ...style, pointerEvents: 'none' }}
        className={cx('react-flow__edge-path', 'path')}
        d={shiftedPath}
      />
      <foreignObject
        width={badgeWidth}
        height={badgeHeight}
        x={positions.badge.x - badgeWidth / 2}
        y={positions.badge.y - 20}
        requiredExtensions="http://www.w3.org/1999/xhtml"
        style={{ overflow: 'visible' }}
      >
        <div className={cx('badgeWrap', 'nodrag', 'nopan')}>
          <div className={cx('mapEditor', 'nodrag', 'nopan')}>
            <button
              type="button"
              className={cx('channelBadge', mapping && 'mapped')}
              title="ドラッグで位置を移動／クリックでCH変換を設定"
              style={{ touchAction: 'none', cursor: 'grab', position: 'relative', zIndex: 2 }}
              onClick={onBadgeClick}
              onPointerDown={onPointerDown}
            >
              {badgeText}
            </button>
            {mapping && data?.editing && (
              <div
                className={cx('editorPanel', 'nodrag', 'nopan')}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <span>IN</span>
                <select
                  id={`${id}-channel-from`}
                  className="nodrag nopan"
                  aria-label="Input channel"
                  value={mapping.from}
                  onChange={(event) => onChange(Number(event.target.value), mapping.to)}
                >
                  {Array.from({ length: 16 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <span>→</span>
                <span>OUT</span>
                <select
                  id={`${id}-channel-to`}
                  className="nodrag nopan"
                  aria-label="Output channel"
                  value={mapping.to}
                  onChange={(event) => onChange(mapping.from, Number(event.target.value))}
                >
                  {Array.from({ length: 16 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={cx('removeMap')}
                  title="Remove channel mapping"
                  aria-label="Remove channel mapping"
                  onClick={() => data?.onRemoveChannelMap?.(data.wire)}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      </foreignObject>
      <foreignObject
        width={DELETE_SIZE}
        height={DELETE_SIZE}
        x={positions.remove.x - DELETE_SIZE / 2}
        y={positions.remove.y - DELETE_SIZE / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className={cx('deleteWrap')}>
          <button
            type="button"
            className={cx('button')}
            title="Delete connection"
            aria-label="Delete connection"
            onClick={onDelete}
          >
            <Icon name="cross" />
          </button>
        </div>
      </foreignObject>
    </>
  );
};
export default CustomEdge;
