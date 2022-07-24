/* eslint-disable */
declare module 'midi' {
  import { Readable, Writable } from 'stream';

  type MidiMessage = [number, number, number];
  type MidiEventCallback = (deltaTime: number, message: MidiMessage) => void;

  class Input {
    getPortName: (port: number) => string;
    getPortCount: () => number;
    openPort: (port: number) => void;
    openVirtualPort: (name: string) => void;
    closePort: () => void;
    isPortOpen: () => boolean;
    ignoreTypes: (ignoreSysex: boolean, ignoreTiming: boolean, ignoreActiveSensing: boolean) => void;
    on: (eventName: string, callback: MidiEventCallback) => void;
  }

  class Output {
    getPortName: (port: number) => string;
    getPortCount: () => number;
    openPort: (port: number) => void;
    openVirtualPort: (name: string) => void;
    closePort: () => void;
    isPortOpen: () => boolean;
    sendMessage: (message: MidiMessage) => void;
    on: (eventName: string, callback: MidiEventCallback) => void;
  }

  function createReadStream(input?: Input): Readable;
  function createWriteStream(output?: Output): Writable;

  export {
    Input,
    Output,
    createReadStream,
    createWriteStream,
    MidiMessage,
    MidiEventCallback
  }
}
