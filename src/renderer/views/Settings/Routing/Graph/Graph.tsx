/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import classnames from 'classnames/bind';
import ReactFlow, {
  ReactFlowProvider,
  useReactFlow,
  PanOnScrollMode,
  Node,
  Edge,
  OnConnect,
  OnMove,
} from 'react-flow-renderer';

import { ApiMidiInput, ApiMidiOutput, ApiMidiWire, ApiMidiRoute } from 'main/types/api';

import InputNode from './InputNode';
import OutputNode from './OutputNode';
import Wire from './Wire';

import { NODES_WIDTH, NODES_HEIGHT, mapDevicesToNodes } from './utils';

import styles from './Graph.module.scss';

const cx = classnames.bind(styles);

type Props = {
  inputs: ApiMidiInput[];
  outputs: ApiMidiOutput[];
  wires: ApiMidiWire[];
  onAddRoute: (route: ApiMidiRoute) => void;
  onDeleteRoute: (route: ApiMidiRoute) => void;
};

const nodeTypes = { midiInput: InputNode, midiOutput: OutputNode };
const edgeTypes = { wire: Wire };

const Graph: React.FC<Props> = ({ inputs, outputs, wires, onAddRoute, onDeleteRoute }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [editingWireId, setEditingWireId] = useState<string | null>(null);
  const { setViewport } = useReactFlow();
  const viewportRef = useRef({ x: 0, y: 0, zoom: 1 });
  const initialFitDoneRef = useRef(false);

  const fitGraph = useCallback(
    (items: Node[]) => {
      const element = containerRef.current;
      if (!element || items.length === 0) return;

      const { width, height } = element.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;

      const minX = Math.min(...items.map((node) => node.position.x));
      const minY = Math.min(...items.map((node) => node.position.y));
      const maxX = Math.max(...items.map((node) => node.position.x + NODES_WIDTH));
      const maxY = Math.max(...items.map((node) => node.position.y + NODES_HEIGHT));
      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      // Start at 100% zoom. The larger default window gives the graph more room;
      // users can still pan when a large device list exceeds the visible area.
      const zoom = 1.0;

      const nextViewport = {
        x: width / 2 - ((minX + maxX) / 2) * zoom,
        y: 24 - minY * zoom,
        zoom,
      };

      viewportRef.current = nextViewport;
      setViewport(nextViewport);
    },
    [setViewport]
  );

  // Keep the stored viewport in sync with mouse/touch panning and any ReactFlow movement.
  const handleMove: OnMove = useCallback((_event, viewport) => {
    viewportRef.current = viewport;
  }, []);

  // Ctrl + / Ctrl - controls the Routing graph zoom.
  // Keep the graph center fixed while changing zoom and prevent browser page zoom.
  useEffect(() => {
    const handleZoomKey = (event: KeyboardEvent) => {
      if (!event.ctrlKey || event.altKey || event.metaKey) return;

      const { key } = event;
      // '+' can be reported differently by JIS layouts, browser versions and numpads.
      const zoomIn =
        key === '+' ||
        key === '=' ||
        key === 'Add' ||
        event.code === 'Equal' ||
        event.code === 'NumpadAdd' ||
        event.code === 'Semicolon' ||
        event.keyCode === 187 ||
        event.keyCode === 107 ||
        event.keyCode === 186;
      const zoomOut =
        key === '-' ||
        key === '_' ||
        event.code === 'Minus' ||
        event.code === 'NumpadSubtract' ||
        event.keyCode === 189 ||
        event.keyCode === 109;

      if (!zoomIn && !zoomOut) return;

      event.preventDefault();
      event.stopPropagation();

      const element = containerRef.current;
      if (!element) return;

      const { width, height } = element.getBoundingClientRect();
      const viewport = viewportRef.current;
      const nextZoom = Math.max(0.2, Math.min(2.0, viewport.zoom * (zoomIn ? 1.1 : 1 / 1.1)));
      if (Math.abs(nextZoom - viewport.zoom) < 0.0001) return;

      const centerX = width / 2;
      const centerY = height / 2;
      const ratio = nextZoom / viewport.zoom;
      const nextViewport = {
        x: centerX - (centerX - viewport.x) * ratio,
        y: centerY - (centerY - viewport.y) * ratio,
        zoom: nextZoom,
      };

      viewportRef.current = nextViewport;
      setViewport(nextViewport);
    };

    window.addEventListener('keydown', handleZoomKey, { capture: true });
    return () => window.removeEventListener('keydown', handleZoomKey, { capture: true });
  }, [setViewport]);

  // addRoute is an upsert in the main process. Update the existing route
  // directly instead of deleting/re-adding it; this keeps the edge and its
  // badge mounted at the same position while editing channel mapping.
  const replaceRoute = useCallback(
    (_oldRoute: ApiMidiRoute, newRoute: ApiMidiRoute) => {
      onAddRoute(newRoute);
    },
    [onAddRoute]
  );

  const handleWireDelete = useCallback(
    (wire: ApiMidiWire) => onDeleteRoute(wire.route),
    [onDeleteRoute]
  );

  const handleEnableChannelMap = useCallback(
    (wire: ApiMidiWire, initialChannel = 1, initialFraction = 0.16) => {
      if (!wire.route.channelMap && !wire.route.mapChannel2To1) {
        replaceRoute(wire.route, {
          ...wire.route,
          channelMap: { from: initialChannel, to: 1 },
          mapChannel2To1: false,
          // Lock the badge to its current visual position when the mapping is
          // first enabled. Otherwise a later edge reorder can change the
          // fallback badgeFraction and make the badge appear to jump on click.
          channelMapPosition: {
            ...(wire.route.channelMapPosition || {}),
            x: wire.route.channelMapPosition?.x ?? initialFraction,
            y: wire.route.channelMapPosition?.y ?? 0,
          },
        });
      }
      setEditingWireId(`input:${wire.route.input}->output:${wire.route.type}:${wire.route.output}`);
    },
    [replaceRoute]
  );

  const handleRemoveChannelMap = useCallback(
    (wire: ApiMidiWire) => {
      replaceRoute(wire.route, { ...wire.route, channelMap: undefined, mapChannel2To1: false });
      setEditingWireId(null);
    },
    [replaceRoute]
  );

  const handleMoveChannelMap = useCallback(
    (wire: ApiMidiWire, offset: number) => {
      // Update the route in place. main-process addRoute now upserts an existing
      // route, so dragging does not disconnect/recreate the MIDI wire.
      onAddRoute({ ...wire.route, wireOffset: offset });
    },
    [onAddRoute]
  );

  const handleMoveChannelMapPosition = useCallback(
    (wire: ApiMidiWire, fraction: number) => {
      onAddRoute({
        ...wire.route,
        channelMapPosition: {
          ...(wire.route.channelMapPosition || {}),
          x: fraction,
          y: wire.route.channelMapPosition?.y ?? 0,
        },
      });
    },
    [onAddRoute]
  );

  const handleMoveChannelMapAndPosition = useCallback(
    (wire: ApiMidiWire, offset: number, fraction: number) => {
      // Persist the wire offset and badge fraction atomically. Two independent
      // addRoute calls based on the same stale wire route could overwrite each
      // other's changes and make the wire jump back after dragging.
      onAddRoute({
        ...wire.route,
        wireOffset: offset,
        channelMapPosition: {
          ...(wire.route.channelMapPosition || {}),
          x: fraction,
          y: wire.route.channelMapPosition?.y ?? 0,
        },
      });
    },
    [onAddRoute]
  );

  const handleMapChange = useCallback(
    (wire: ApiMidiWire, from: number, to: number) => {
      replaceRoute(wire.route, {
        ...wire.route,
        channelMap: { from, to },
        mapChannel2To1: from === 2 && to === 1,
      });
    },
    [replaceRoute]
  );

  const handleConnect: OnConnect = ({ source, target }) => {
    const input = inputs.find((item) => `input:${item.name}` === source);
    const output = outputs.find((item) => `output:${item.type}:${item.name}` === target);

    if (input && output) {
      onAddRoute({ input: input.name, output: output.name, type: output.type, enabled: true });
    }
  };

  // Recalculate node positions when devices or routes change. Sorting ports by
  // connection state only changes their visual Y positions; IDs remain stable.
  useEffect(() => {
    const recalculateNodes = () => {
      const element = containerRef.current;
      if (!element) return;

      const { width } = element.getBoundingClientRect();

      // Keep connected ports at the top of each column. Sorting is stable:
      // ports with the same connection state retain the order supplied by the
      // MIDI device manager. The node IDs are still derived from the original
      // device identity in mapDevicesToNodes, so existing edges/routes do not
      // change when the visual order changes.
      const connectedInputs = new Set(wires.map((wire) => wire.route.input));
      const connectedOutputs = new Set(
        wires.map((wire) => `${wire.route.type}:${wire.route.output}`)
      );
      const orderedInputs = [...inputs].sort(
        (a, b) => Number(connectedInputs.has(b.name)) - Number(connectedInputs.has(a.name))
      );
      const orderedOutputs = [...outputs].sort(
        (a, b) =>
          Number(connectedOutputs.has(`${b.type}:${b.name}`)) -
          Number(connectedOutputs.has(`${a.type}:${a.name}`))
      );

      setNodes(mapDevicesToNodes(orderedInputs, orderedOutputs, width));
    };

    recalculateNodes();
    const observer = new ResizeObserver(recalculateNodes);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', recalculateNodes);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recalculateNodes);
    };
  }, [inputs, outputs, wires]);

  // Rebuild edges independently. Changes to wires or the selected editor never reset nodes/zoom.
  useEffect(() => {
    const routeEdges: Edge[] = wires.map((wire, wireIndex) => {
      const wireId = `input:${wire.route.input}->output:${wire.route.type}:${wire.route.output}`;

      return {
        id: wireId,
        source: `input:${wire.route.input}`,
        target: `output:${wire.route.type}:${wire.route.output}`,
        type: 'wire',
        // Keep the selected channel-map editor above every other wire SVG.
        zIndex: editingWireId === wireId ? 10000 : 1000,
        data: {
          wire,
          currentChannel: wire.currentChannel ?? null,
          badgeFraction: 0.12 + (wireIndex % 6) * 0.045,
          onDelete: handleWireDelete,
          onEnableChannelMap: handleEnableChannelMap,
          onRemoveChannelMap: handleRemoveChannelMap,
          onChangeChannelMap: handleMapChange,
          onMoveChannelMap: handleMoveChannelMap,
          onMoveChannelMapPosition: handleMoveChannelMapPosition,
          onMoveChannelMapAndPosition: handleMoveChannelMapAndPosition,
          editing: editingWireId === wireId,
          onToggleEditor: () => setEditingWireId((current) => (current === wireId ? null : wireId)),
        },
      };
    });

    setEdges(routeEdges);
  }, [
    wires,
    editingWireId,
    handleWireDelete,
    handleEnableChannelMap,
    handleRemoveChannelMap,
    handleMapChange,
    handleMoveChannelMap,
    handleMoveChannelMapPosition,
    handleMoveChannelMapAndPosition,
  ]);

  // Fit once, after the initial device nodes have been rendered. Subsequent node/wire
  // updates preserve the user's chosen pan and zoom instead of snapping back to fit.
  useEffect(() => {
    if (initialFitDoneRef.current || nodes.length === 0) return undefined;

    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        if (!initialFitDoneRef.current) {
          fitGraph(nodes);
          initialFitDoneRef.current = true;
        }
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
    };
  }, [nodes, fitGraph]);

  return (
    <div ref={containerRef} className={cx('base')}>
      <div className={cx('zoomHint')}>Zoom: Ctrl + / Ctrl -</div>
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        nodesDraggable={false}
        elementsSelectable={false}
        fitView={false}
        panOnDrag
        panOnScroll
        panOnScrollMode={PanOnScrollMode.Vertical}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        zoomActivationKeyCode=""
        onConnect={handleConnect}
        onMove={handleMove}
      />
    </div>
  );
};

const GraphReactFlowProvided: React.FC<Props> = (props) => (
  <ReactFlowProvider>
    <Graph {...props} />
  </ReactFlowProvider>
);

export default GraphReactFlowProvided;
