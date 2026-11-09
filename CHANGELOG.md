# Unreleased

## Features

- **MIDI Routing: Flexible Connections**: Added a flexible MIDI routing editor that allows users to connect MIDI input and output devices in different combinations. Channel mapping is also supported, making it possible to remap incoming MIDI channels to different output channels.

- **MIDI Routing: Improved Visual Layout**: Improved the visual presentation of MIDI connections using a graph-based interface. Users can zoom in and out to inspect the routing layout in more detail, and automatically arrange nodes to keep connections organized. These features make it easier to understand and manage complex routing configurations, even when many devices and connections are involved. Zoom can be controlled using the mouse or keyboard shortcuts: `Ctrl + +` to zoom in and `Ctrl + -` to zoom out.

- **MIDI Routing: Save and Load Presets**: Added the ability to save and load MIDI routing configurations as presets. Complete routing setups, including device connections and channel mappings, can be saved for different purposes or equipment configurations. Saved presets can be loaded at any time, making it easy to switch between different routing setups without having to configure all connections again.

- **Note Naming: Display Preferences**: Added a global preference for choosing how musical note names are displayed. Users can select from three options:
  - **Auto**: Automatically chooses sharp or flat notation based on the current key signature. When neither spelling is clearly preferred, flat notation is used by default.
  - **Sharps**: Always uses sharp notation (C#, D#, F#, G#, A#).
  - **Flats**: Always uses flat notation (Db, Eb, Gb, Ab, Bb).

  This setting provides consistent note naming across chord names, the Chord Dictionary, note input fields, and music notation.

## Fixes

- **Chord Dictionary**: Improved handling of chords with no defined root note (tonic). Operations that require a valid root note are now handled safely, preventing invalid links and navigation errors.

- **Build**: Fixed an issue where the cleanup process removed renderer DLL files required for development when creating an installer. The cleanup process now removes only the specified build output directories while preserving development DLL files. This allows developers to run `npm start` after packaging without having to rebuild the renderer DLLs.


# 1.7.0 (2024-01-05)

## Features
- **ChordDictionary**: added a new module for displaying all available chords
- **PianoKeyboard**: added target notes (for future use & dictionary)
- **ChordDisplay**: detect on release option
- **ChordDisplay**: added chord link to dictionary
- **Layout**: added a bottom bar with key signature and latency

## Fixes
- **Notation**: adapt centering when single stave
- **CircleOfFifths**: dominant sector not correclty detected


# 1.6.2 (2023-12-19)

## Fixes
- **Chord Display:** increase keyboard label font-size
- **Chord Display:** added chordNote as a label (note name in chord with correct alteration instead of keysignature)
- **chord-dictionary:** fix some issue in tonal chord dictionary
- **Home:** correct card aspect ratio and chord-display icon
- **Settings:** correctly reflect startup minimized option

# 1.6.1 (2023-12-11)

## Fixes
- **Chord Display:** allow keyboard key height up to 16

# 1.6.0 (2023-12-23)

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
