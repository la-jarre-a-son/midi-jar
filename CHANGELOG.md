# 1.6.0 (2023-12-11)

## Features
- **Chord Display:** Fully customizable Piano (sizes, colors and labels above keys)
- **Chord Display:** disable sustain pedal for detection or display
- **Chord Display:** wrap keyboard option

# 1.5.1 (2023-11-21)

## Features
- **window:** retain window maximized, aot and path

## Fixes

- **Chords:** correctly order chord inversion vs omissions on detect
- **Chords:** remove M & maj notation for major chord
- **chore:** Use a published fork of nlf
- **chore:** Add flatpak build target
- disable autoupdate and add an update modal

# 1.5.0 (2023-11-07)

## Features

- **Chords:** Custom chord dictionary with detect omissions and 3 chord notations
- **Settings:** allow chord omissions & change chord notation
- **Chord Display:**: display chord full name & highlight alterations

## Fixes

- **chore:** Upgraded tonal to v5

# 1.4.0 (2023-09-25)

## Features

- **ui:** Rewrite UI entirely
- **ui:** Added settings drawer for all modules
- **Home:** new app launch page with startup changelog modal
- **About:** added Changelog
- **Chord Display:** multiple modules can be added
- **window:** retain window position on close

## Fixes

- **chore:** Upgraded all dependencies and fix security warnings
- **Midi:** Rewrite midi routing with @julusian/midi package
- **Credits:** correctly list all licenses from dependencies

# 1.3.0 (2023-05-04)

## Features

- **ChordQuiz:** Added a quiz module with customizable difficulty, modes, and game infos
- **Chord Display:** Added intervals display

## Fixes

- **Circle of Fifths:** Ensure the current key is highlighted (can happen with strange key signatures)
- **Music Notation:** Fixed parsing for notes with multiple alterations when using strange key signatures (like B## or Ebb)
- **Settings:** Swapped default toggle order (N / Y instead of Y / N)
- **Settings:** Fixed migrations and ensure settings are always defaulted
- **misc**: Double-clicking the task icon opens window directly
- **macos**: Avoid MacOS Ventura to trigger notificatons at startup + start minimized

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
