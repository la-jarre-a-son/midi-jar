import React, { useContext, useEffect, useCallback, useMemo, useReducer } from 'react';

import { ApiMidiInput, ApiMidiOutput, ApiMidiWire, ApiMidiRoute } from 'main/types/api';

interface MidiRoutingContextInterface {
  inputs: ApiMidiInput[];
  outputs: ApiMidiOutput[];
  wires: ApiMidiWire[];
  refreshDevices: () => void;
  clearRoutes: () => void;
  addRoute: (route: ApiMidiRoute) => void;
  deleteRoute: (route: ApiMidiRoute) => void;
}

const MidiRoutingContext = React.createContext<MidiRoutingContextInterface | null>(null);

type InputsChangedAction = {
  type: 'INPUTS_CHANGED';
  value: ApiMidiInput[];
};
type OutputsChangedAction = {
  type: 'OUTPUTS_CHANGED';
  value: ApiMidiOutput[];
};
type WiresChangedAction = {
  type: 'WIRES_CHANGED';
  value: ApiMidiWire[];
};

type Action = InputsChangedAction | OutputsChangedAction | WiresChangedAction;

// An interface for our state
interface State {
  inputs: ApiMidiInput[];
  outputs: ApiMidiOutput[];
  wires: ApiMidiWire[];
}

// Our reducer function that uses a switch statement to handle our actions
function reducer(state: State, action: Action): State {
  const { type } = action;
  switch (type) {
    case 'INPUTS_CHANGED': {
      const inputs = action.value;

      return {
        ...state,
        inputs,
      };
    }
    case 'OUTPUTS_CHANGED': {
      const outputs = action.value;

      return {
        ...state,
        outputs,
      };
    }
    case 'WIRES_CHANGED': {
      const wires = action.value;

      return {
        ...state,
        wires,
      };
    }

    default:
      return state;
  }
}

const defaultState: State = {
  inputs: [],
  outputs: [],
  wires: [],
};

type Props = {
  children: React.ReactNode;
};

const MidiRoutingProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const onMIDIInputs = useCallback(
    (i: ApiMidiInput[]) => {
      dispatch({ type: 'INPUTS_CHANGED', value: i });
    },
    [dispatch]
  );

  const onMIDIOutputs = useCallback(
    (o: ApiMidiOutput[]) => {
      dispatch({ type: 'OUTPUTS_CHANGED', value: o });
    },
    [dispatch]
  );

  const onMIDIWires = useCallback(
    (w: ApiMidiWire[]) => {
      dispatch({ type: 'WIRES_CHANGED', value: w });
    },
    [dispatch]
  );

  const refreshDevices = useCallback(() => window.midi.refreshDevices(), []);
  const clearRoutes = useCallback(() => window.midi.clearRoutes(), []);
  const addRoute = useCallback((route: ApiMidiRoute) => window.midi.addRoute(route), []);
  const deleteRoute = useCallback((route: ApiMidiRoute) => window.midi.deleteRoute(route), []);

  useEffect(() => {
    window.midi.getInputs();
    window.midi.getOutputs();
    window.midi.getWires();
    const offInputs = window.midi.onInputs(onMIDIInputs);
    const offOutputs = window.midi.onOutputs(onMIDIOutputs);
    const offWires = window.midi.onWires(onMIDIWires);

    return () => {
      offInputs();
      offOutputs();
      offWires();
    };
  }, [onMIDIInputs, onMIDIOutputs, onMIDIWires]);

  const value = useMemo(
    () => ({
      ...state,
      refreshDevices,
      clearRoutes,
      addRoute,
      deleteRoute,
    }),
    [state, refreshDevices, addRoute, deleteRoute, clearRoutes]
  );

  return <MidiRoutingContext.Provider value={value}>{children}</MidiRoutingContext.Provider>;
};

export const useMidiRouting = () => {
  const context = useContext(MidiRoutingContext);
  if (!context) {
    throw new Error(`useMidiRouting must be used within a MidiRoutingProvider`);
  }
  return context;
};

export default MidiRoutingProvider;
