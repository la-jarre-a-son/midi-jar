export type ApiMidiInput = {
  name: string;
  opened: boolean;
  connected: boolean;
  error: boolean;
};

export type ApiMidiOutput = {
  name: string;
  type: 'physical' | 'internal' | 'websocket';
  opened: boolean;
  connected: boolean;
  error: boolean;
};

export type ApiMidiRoute = {
  input: string;
  output: string;
  type: 'physical' | 'internal' | 'websocket';
  enabled: boolean;
};

export type ApiMidiWire = {
  route: ApiMidiRoute;
  connected: boolean;
};
