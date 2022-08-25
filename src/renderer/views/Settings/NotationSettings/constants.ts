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
};
