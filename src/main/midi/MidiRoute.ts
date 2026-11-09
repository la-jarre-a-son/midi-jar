import { ApiMidiRoute } from '../types/api';

export interface MidiRouteRaw {
  input: string;
  output: string;
  type: 'physical' | 'internal';
  enabled: boolean;
  // When true, MIDI channel 2 is rewritten to channel 1 on this route.
  mapChannel2To1?: boolean;
  channelMap?: { from: number; to: number };
  channelMapPosition?: { x: number; y: number };
  wireOffset?: number;
}

export class MidiRoute {
  input: string;

  output: string;

  type: 'physical' | 'internal';

  enabled: boolean;

  mapChannel2To1: boolean;

  channelMap?: { from: number; to: number };

  channelMapPosition?: { x: number; y: number };

  wireOffset?: number;

  constructor(raw: MidiRouteRaw) {
    this.input = raw.input;
    this.output = raw.output;
    this.type = raw.type;
    this.enabled = !!raw.enabled;
    this.mapChannel2To1 = !!raw.mapChannel2To1;
    this.channelMap = raw.channelMap || (raw.mapChannel2To1 ? { from: 2, to: 1 } : undefined);
    this.channelMapPosition = raw.channelMapPosition;
    this.wireOffset = raw.wireOffset;
  }

  isSame(route: MidiRoute) {
    return route.type === this.type && route.input === this.input && route.output === this.output;
  }

  static fromStore(json: MidiRouteRaw) {
    return new MidiRoute(json);
  }

  static fromApi(json: MidiRouteRaw) {
    return new MidiRoute(json);
  }

  toStore(): MidiRouteRaw {
    return {
      input: this.input,
      output: this.output,
      type: this.type,
      enabled: this.enabled,
      mapChannel2To1: this.mapChannel2To1,
      channelMap: this.channelMap,
      channelMapPosition: this.channelMapPosition,
      wireOffset: this.wireOffset,
    };
  }

  toApi(): ApiMidiRoute {
    return {
      input: this.input,
      output: this.output,
      type: this.type,
      enabled: this.enabled,
      mapChannel2To1: this.mapChannel2To1,
      channelMap: this.channelMap,
      channelMapPosition: this.channelMapPosition,
      wireOffset: this.wireOffset,
    };
  }
}
