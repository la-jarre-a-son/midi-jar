import { ButtonIntents } from 'renderer/components/Button';

export const fields = {
  accidentals: {
    choices: [
      {
        value: 'flat',
        label: '♭',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 'sharp',
        label: '♯',
        intent: 'primary' as ButtonIntents,
      },
    ],
  },
  staffClef: {
    choices: [
      {
        value: 'both',
        label: 'Bass+Treble',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 'bass',
        label: 'Bass',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 'treble',
        label: 'Treble',
        intent: 'primary' as ButtonIntents,
      },
    ],
  },
};
