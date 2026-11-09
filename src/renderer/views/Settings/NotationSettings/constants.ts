export const fields = {
  noteNaming: {
    choices: [
      { value: 'auto', label: 'Auto (key signature)' },
      { value: 'sharp', label: 'Sharps (C#, D#, ...)' },
      { value: 'flat', label: 'Flats (Db, Eb, ...)' },
    ],
  },
  accidentals: {
    choices: [
      {
        value: 'flat',
        label: 'flat - ♭',
      },
      {
        value: 'sharp',
        label: 'sharp - ♯',
      },
    ],
  },
  staffClef: {
    choices: [
      {
        value: 'both',
        label: 'Bass 𝄢 + Treble 𝄞',
      },
      {
        value: 'bass',
        label: 'Bass 𝄢',
      },
      {
        value: 'treble',
        label: 'Treble  𝄞',
      },
    ],
  },
  keySignature: {
    choices: [
      {
        value: 'C',
        label: 'C major / A minor',
      },
      {
        value: 'G',
        label: 'G major / E minor (5♯)',
      },
      {
        value: 'D',
        label: 'D major / B minor (2♯)',
      },
      {
        value: 'A',
        label: 'A major / F♯ minor (3♯)',
      },
      {
        value: 'E',
        label: 'E major / C♯ minor (4♯)',
      },
      {
        value: 'B',
        label: 'B major / G♯ minor (5♯)',
      },
      {
        value: 'F#',
        label: 'F♯ major / D♯ minor (6♯)',
      },
      {
        value: 'Db',
        label: 'Db major / B♭ minor (5♭)',
      },
      {
        value: 'Ab',
        label: 'A♭ major / F minor (4♭)',
      },
      {
        value: 'Eb',
        label: 'E♭ major / C minor (3♭)',
      },
      {
        value: 'Bb',
        label: 'B♭ major / G minor (2♭)',
      },
      {
        value: 'F',
        label: 'F major / D minor (1♭)',
      },
    ],
  },
};
