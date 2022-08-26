export const MIDI_CLOCK_CMD = 0xf8;
export const MIDI_SYSEX_CMD = 0xf0;

export const MIDI_CMD = {
  0x80: 'Note Off',
  0x90: 'Note On',
  0xa0: 'Poly Aftertouch',
  0xb0: 'CC',
  0xc0: 'Program Change',
  0xd0: 'Chan Aftertouch',
  0xe0: 'Pitchwheel',
  0xf0: 'SysEx',
  0xf1: 'MIDI Time Code  Qtr. Frame',
  0xf2: 'Song Position Pointer',
  0xf3: 'Song Select',
  0xf4: 'Undefined',
  0xf5: 'Undefined',
  0xf6: 'Tune request',
  0xf7: 'EOX',
  0xf8: 'Timing clock',
  0xf9: 'Undefined',
  0xfa: 'Start',
  0xfb: 'Continue',
  0xfc: 'Stop',
  0xfd: 'Undefined',
  0xfe: 'Active Sensing',
  0xff: 'System Reset',
};

export const MIDI_CC = {
  0x0: 'Bank Select',
  0x1: 'ModWheel',
  0x2: 'Breath Ctrl',
  0x3: 'Undefined',
  0x4: 'Foot Ctrl',
  0x5: 'Portamento Time',
  0x6: 'Data Entry MSB',
  0x7: 'Channel Volume',
  0x8: 'Balance',
  0x9: 'Undefined',
  0x0a: 'Pan',
  0x0b: 'Expression Ctrl',
  0x0c: 'Effect Control 1',
  0x0d: 'Effect Control 2',
  0x0e: 'Undefined',
  0x0f: 'Undefined',
  0x10: 'General Purpose Ctrl 1',
  0x11: 'General Purpose Ctrl 2',
  0x12: 'General Purpose Ctrl 3',
  0x13: 'General Purpose Ctrl 4',
  0x14: 'Undefined',
  0x15: 'Undefined',
  0x16: 'Undefined',
  0x17: 'Undefined',
  0x18: 'Undefined',
  0x19: 'Undefined',
  0x1a: 'Undefined',
  0x1b: 'Undefined',
  0x1c: 'Undefined',
  0x1d: 'Undefined',
  0x1e: 'Undefined',
  0x1f: 'Undefined',
  0x20: 'LSB for Control 0',
  0x21: 'LSB for Control 1',
  0x22: 'LSB for Control 2',
  0x23: 'LSB for Control 3',
  0x24: 'LSB for Control 4',
  0x25: 'LSB for Control 5',
  0x26: 'LSB for Control 6',
  0x27: 'LSB for Control 7',
  0x28: 'LSB for Control 8',
  0x29: 'LSB for Control 9',
  0x2a: 'LSB for Control 10',
  0x2b: 'LSB for Control 11',
  0x2c: 'LSB for Control 12',
  0x2d: 'LSB for Control 13',
  0x2e: 'LSB for Control 14',
  0x2f: 'LSB for Control 15',
  0x30: 'LSB for Control 16',
  0x31: 'LSB for Control 17',
  0x32: 'LSB for Control 18',
  0x33: 'LSB for Control 19',
  0x34: 'LSB for Control 20',
  0x35: 'LSB for Control 21',
  0x36: 'LSB for Control 22',
  0x37: 'LSB for Control 23',
  0x38: 'LSB for Control 24',
  0x39: 'LSB for Control 25',
  0x3a: 'LSB for Control 26',
  0x3b: 'LSB for Control 27',
  0x3c: 'LSB for Control 28',
  0x3d: 'LSB for Control 29',
  0x3e: 'LSB for Control 30',
  0x3f: 'LSB for Control 31',
  0x40: 'Damper Pedal on/off',
  0x41: 'Portamento On/Off',
  0x42: 'Sostenuto On/Off',
  0x43: 'Soft Pedal On/Off',
  0x44: 'Legato Footswitch',
  0x45: 'Hold 2',
  0x46: 'Sound Ctrl 1 ',
  0x47: 'Sound Ctrl 2 ',
  0x48: 'Sound Ctrl 3 ',
  0x49: 'Sound Ctrl 4 ',
  0x4a: 'Sound Ctrl 5 ',
  0x4b: 'Sound Ctrl 6 ',
  0x4c: 'Sound Ctrl 7 ',
  0x4d: 'Sound Ctrl 8 ',
  0x4e: 'Sound Ctrl 9 ',
  0x4f: 'Sound Ctrl 10',
  0x50: 'General Purpose Ctrl 5',
  0x51: 'General Purpose Ctrl 6',
  0x52: 'General Purpose Ctrl 7',
  0x53: 'General Purpose Ctrl 8',
  0x54: 'Portamento Control',
  0x55: 'Undefined',
  0x56: 'Undefined',
  0x57: 'Undefined',
  0x58: 'High Resolution Velocity Prefix',
  0x59: 'Undefined',
  0x5a: 'Undefined',
  0x5b: 'Effects 1 Depth',
  0x5c: 'Effects 2 Depth',
  0x5d: 'Effects 3 Depth',
  0x5e: 'Effects 4 Depth',
  0x5f: 'Effects 5 Depth',
  0x60: 'Data Increment',
  0x61: 'Data Decrement',
  0x62: 'Non-Registered Parameter Number',
  0x63: 'Non-Registered Parameter Number',
  0x64: 'Registered Parameter Number',
  0x65: 'Registered Parameter Number',
  0x66: 'Undefined',
  0x67: 'Undefined',
  0x68: 'Undefined',
  0x69: 'Undefined',
  0x6a: 'Undefined',
  0x6b: 'Undefined',
  0x6c: 'Undefined',
  0x6d: 'Undefined',
  0x6e: 'Undefined',
  0x6f: 'Undefined',
  0x70: 'Undefined',
  0x71: 'Undefined',
  0x72: 'Undefined',
  0x73: 'Undefined',
  0x74: 'Undefined',
  0x75: 'Undefined',
  0x76: 'Undefined',
  0x77: 'Undefined',
  0x78: '[Channel Mode] All Sound Off',
  0x79: '[Channel Mode] Reset All Ctrls',
  0x7a: '[Channel Mode] Local Control On/Off',
  0x7b: '[Channel Mode] All Notes Off',
  0x7c: '[Channel Mode] Omni Mode Off',
  0x7d: '[Channel Mode] Omni Mode On',
  0x7e: '[Channel Mode] Mono Mode On',
  0x7f: '[Channel Mode] Poly Mode On',
};