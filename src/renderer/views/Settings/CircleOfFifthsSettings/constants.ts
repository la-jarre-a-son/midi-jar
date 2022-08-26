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
};
