import { ButtonIntents } from 'renderer/components/Button';

export const fields = {
  scale: {
    choices: [
      {
        value: 'major',
        label: 'Major',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 'minor',
        label: 'Minor',
        intent: 'primary' as ButtonIntents,
      },
    ],
  },
  highlightSector: {
    choices: [
      {
        value: 'chord',
        label: 'On Chord',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 'notes',
        label: 'On Notes',
        intent: 'primary' as ButtonIntents,
      },
    ],
  },
};
