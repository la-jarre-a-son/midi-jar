/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import classnames from 'classnames/bind';
import ReactFlow, {
  ReactFlowProvider,
  useReactFlow,
  PanOnScrollMode,
  getRectOfNodes,
  Node,
  Edge,
  OnConnect,
  OnMove,
} from 'react-flow-renderer';

import { ApiMidiInput, ApiMidiOutput, ApiMidiWire, ApiMidiRoute } from 'main/types/api';

import InputNode from './InputNode';
import OutputNode from './OutputNode';
import Wire from './Wire';

import { NODE_VERTICAL_SPACING, mapDevicesToNodes, mapWiresToEdges } from './utils';

import styles from './Graph.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
  inputs: ApiMidiInput[];
  outputs: ApiMidiOutput[];
  wires: ApiMidiWire[];
  onAddRoute: (route: ApiMidiRoute) => void;
  onDeleteRoute: (route: ApiMidiRoute) => void;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

const reactFlowDefaultProps = {
  nodesDraggable: false,
  elementsSelectable: false,
  fitView: false,
  panOnDrag: false,
  panOnScroll: true,
  panOnScrollMode: PanOnScrollMode.Vertical,
  zoomOnScroll: false,
  zoomOnPinch: false,
  zoomOnDoubleClick: false,
  zoomActivationKeyCode: '',
};

const nodeTypes = {
  midiInput: InputNode,
  midiOutput: OutputNode,
};

const edgeTypes = {
  wire: Wire,
};

/**
 * Routing settings page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const Routing: React.FC<Props> = ({
  className,
  inputs,
  outputs,
  wires,
  onAddRoute,
  onDeleteRoute,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { setViewport, getViewport, project } = useReactFlow();

  const limitViewport = useCallback(
    (currentNodes: Node[]) => {
      const viewport = getViewport();
      if (containerRef.current) {
        const nodeRect = getRectOfNodes(currentNodes);
        const viewportDimensions = containerRef?.current.getBoundingClientRect();

        const canvasSize = {
          x: nodeRect.height + nodeRect.x,
          y: nodeRect.height + nodeRect.y + NODE_VERTICAL_SPACING,
        };

        const viewSize = project({
          x: viewportDimensions.width + viewport.x,
          y: viewportDimensions.height + viewport.y,
        });

        const maxViewportY = viewSize.y - canvasSize.y;

        if (viewport.y > 0) {
          setViewport({ x: 0, y: 0, zoom: 1 });
        } else if (maxViewportY >= 0 && viewport.y !== 0) {
          setViewport({ x: 0, y: 0, zoom: 1 });
        } else if (maxViewportY < 0 && viewport.y < maxViewportY) {
          setViewport({ x: 0, y: maxViewportY, zoom: 1 });
        }
      }
    },
    [getViewport, project, setViewport]
  );

  const handleMove: OnMove = () => {
    limitViewport(nodes);
  };

  const handleConnect: OnConnect = ({ source, target }) => {
    const inputNode = nodes.find((node) => node.id === source);
    const outputNode = nodes.find((node) => node.id === target);

    if (inputNode && outputNode) {
      onAddRoute({
        input: inputNode.data.input.name,
        output: outputNode.data.output.name,
        type: outputNode.data.output.type,
        enabled: true,
      });
    }
  };

  const handleWireDelete = useCallback(
    (wire: ApiMidiWire) => {
      onDeleteRoute(wire.route);
    },
    [onDeleteRoute]
  );

  useEffect(() => {
    const recalculate = () => {
      if (containerRef.current) {
        const viewportWidth = containerRef.current.getBoundingClientRect().width;

        const newNodes = mapDevicesToNodes(inputs, outputs, viewportWidth);
        setNodes(newNodes);
        setEdges(mapWiresToEdges(wires, handleWireDelete));
        limitViewport(newNodes);
      }
    };

    recalculate();

    window.addEventListener('resize', recalculate);

    return () => window.removeEventListener('resize', recalculate);
  }, [inputs, outputs, wires, limitViewport, handleWireDelete]);

  return (
    <div ref={containerRef} className={cx('base', className)}>
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        edges={edges}
        {...reactFlowDefaultProps}
        onMove={handleMove}
        onConnect={handleConnect}
      />
    </div>
  );
};

const RoutingReactFlowProvided: React.FC<Props> = (props) => (
  <ReactFlowProvider>
    <Routing {...props} />
  </ReactFlowProvider>
);

RoutingReactFlowProvided.defaultProps = defaultProps;
Routing.defaultProps = defaultProps;

export default RoutingReactFlowProvided;
