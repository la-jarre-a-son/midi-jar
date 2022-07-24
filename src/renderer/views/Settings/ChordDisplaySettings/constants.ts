import { ButtonIntents } from 'renderer/components/Button';

export const fields = {
  skin: {
    choices: [
      {
        value: 'classic',
        label: 'Classic',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 'flat',
        label: 'Flat',
        intent: 'primary' as ButtonIntents,
      },
    ],
  },
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
};
