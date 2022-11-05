# 1.2.1 (2022-11-05)

## Fixes

- **Midi**: Consider NOTE_ON with velocity 0 as NOTE_OFF

# 1.2.0 (2022-09-21)

## Features

- **Circle of Fifths:** Added a Circle of Fifths module with customizable rendering
- **Overlay:** Circle of Fifths also available in overlay
- **Settings:** Moved Music Notation settings to its own section (affecting all modules now)
- **Staff Notation:** Added clef and transpose settings for transposing instruments

## Fixes

- **Music Notation:** Fixed notation in C# giving C instead of B#

# 1.1.0 (2022-08-07)

## Features

- **Chord Display:** Added music notation with VexFlow
- **Chord Display:** Added Key Signature with note names in key
- **Settings:** Input for Notes + Midi Learn
- **Debugger:** Filter Midi Clock
- **Overlay:** auto reconnect websocket
- **chore:** Added Linux AppImage build + fix traffic lights

## Fixes

- **Settings:** Fixed Input Color accepting any text
- **Chord Display:** Fixed Keyboard size overflowing in some windows sizes
- **Debugger:** Fixed message manager being disposed in useMidiMessages hook
- **Home:** Wrong link to report issues
- **chore:** upgrade dependencies and Electron v19

# 1.0.0 (2022-07-26)

## Features

- **MIDI:** discover, connect, routing, latency monitoring
- **Chord Display:** Detect chord, display piano with notes with sustain, UI customization
- **Overlay:** HTTP/WS server for external integration
- **Debugger:** Display All MIDI messages received
- **General:** Launch at startup, Always on Top + Window interactions
