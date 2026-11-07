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
  viewportWidth: number,
  wires: ApiMidiWire[] = []
): Node[] => {
  // Connected ports first; preserve the original device order within each group.
  const connectedInputs = new Set(wires.map((wire) => wire.route.input));
  const connectedOutputs = new Set(
    wires.map((wire) => `${wire.route.type}:${wire.route.output}`)
  );

  const orderedInputs = inputs
    .map((input, index) => ({ input, index }))
    .sort(
      (a, b) =>
        Number(connectedInputs.has(b.input.name)) -
          Number(connectedInputs.has(a.input.name)) ||
        a.index - b.index
    )
    .map(({ input }) => input);

  const orderedOutputs = outputs
    .map((output, index) => ({ output, index }))
    .sort(
      (a, b) =>
        Number(connectedOutputs.has(`${b.output.type}:${b.output.name}`)) -
          Number(connectedOutputs.has(`${a.output.type}:${a.output.name}`)) ||
        a.index - b.index
    )
    .map(({ output }) => output);

  return [
    ...orderedInputs.map((input, index) => ({
      id: getNodeInputId(input.name),
      type: 'midiInput',
      data: { label: input.name, input },
      position: { x: 0, y: NODE_VERTICAL_SPACING + index * (NODES_HEIGHT + NODE_VERTICAL_SPACING) },
      width: NODES_WIDTH,
      height: NODES_HEIGHT,
      style: { width: NODES_WIDTH, height: NODES_HEIGHT },
    })),
    ...orderedOutputs.map((output, index) => ({
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
  onDelete: (wire: ApiMidiWire) => void,
  onToggleChannelMap: (wire: ApiMidiWire) => void
): Edge[] =>
  wires.map((wire) => ({
    id: getEdgeId(wire.route.input, wire.route.output, wire.route.type),
    type: 'wire',
    source: getNodeInputId(wire.route.input),
    target: getNodeOutputId(wire.route.type, wire.route.output),
    data: { onDelete, onToggleChannelMap, wire },
  }));
