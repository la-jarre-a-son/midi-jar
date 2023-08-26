import { ApiMidiRoute } from './api';

export interface MidiRouteRaw {
  input: string;
  output: string;
  type: 'physical' | 'internal';
  enabled: boolean;
}

export class MidiRoute {
  input: string;

  output: string;

  type: 'physical' | 'internal';

  enabled: boolean;

  constructor(raw: MidiRouteRaw) {
    this.input = raw.input;
    this.output = raw.output;
    this.type = raw.type;
    this.enabled = !!raw.enabled;
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
    };
  }

  toApi(): ApiMidiRoute {
    return {
      input: this.input,
      output: this.output,
      type: this.type,
      enabled: this.enabled,
    };
  }
}
