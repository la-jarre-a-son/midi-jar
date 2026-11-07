export type ApiMidiInput = {
  name: string;
  opened: boolean;
  connected: boolean;
  error: boolean;
};

export type ApiMidiOutput = {
  name: string;
  type: 'physical' | 'internal';
  opened: boolean;
  connected: boolean;
  error: boolean;
};

export type ApiMidiRoute = {
  input: string;
  output: string;
  type: 'physical' | 'internal';
  enabled: boolean;
  mapChannel2To1?: boolean;
  channelMap?: { from: number; to: number };
  channelMapPosition?: { x: number; y: number };
  wireOffset?: number;
};

export type ApiMidiWire = {
  route: ApiMidiRoute;
  connected: boolean;
  currentChannel?: number | null;
};
