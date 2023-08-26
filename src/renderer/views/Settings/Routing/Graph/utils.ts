import { Node, Edge, Position } from 'react-flow-renderer';

import { ApiMidiInput, ApiMidiOutput, ApiMidiWire } from 'main/types/api';

export const NODE_VERTICAL_SPACING = 32;
export const NODES_WIDTH = 140;
export const NODES_HEIGHT = 48;

const getNodeInputId = (name: string) => `input:${name}`;
const getNodeOutputId = (type: string, name: string) => `output:${type}:${name}`;
const getEdgeId = (input: string, output: string, type: string) =>
  `${getNodeInputId(input)}->${getNodeOutputId(type, output)}`;

export const mapDevicesToNodes = (
  inputs: ApiMidiInput[],
  outputs: ApiMidiOutput[],
  viewportWidth: number
): Node[] => {
  return [
    ...inputs.map((input, index) => ({
      id: getNodeInputId(input.name),
      type: 'midiInput',
      data: { label: input.name, input },
      position: {
        x: 0,
        y: NODE_VERTICAL_SPACING + index * (NODES_HEIGHT + NODE_VERTICAL_SPACING),
      },
      width: NODES_WIDTH,
      height: NODES_HEIGHT,
      style: { width: NODES_WIDTH, height: NODES_HEIGHT },
    })),
    ...outputs.map((output, index) => ({
      id: getNodeOutputId(output.type, output.name),
      type: 'midiOutput',
      targetPosition: Position.Left,
      data: { label: output.name, output },
      position: {
        x: viewportWidth - NODES_WIDTH,
        y: NODE_VERTICAL_SPACING + index * (NODES_HEIGHT + NODE_VERTICAL_SPACING),
      },
      width: NODES_WIDTH,
      height: NODES_HEIGHT,
      style: { width: NODES_WIDTH, height: NODES_HEIGHT },
    })),
  ];
};

export const mapWiresToEdges = (
  wires: ApiMidiWire[],
  onDelete: (wire: ApiMidiWire) => void
): Edge[] =>
  wires.map((wire) => ({
    id: getEdgeId(wire.route.input, wire.route.output, wire.route.type),
    type: 'wire',
    source: getNodeInputId(wire.route.input),
    target: getNodeOutputId(wire.route.type, wire.route.output),
    data: { onDelete, wire },
  }));
