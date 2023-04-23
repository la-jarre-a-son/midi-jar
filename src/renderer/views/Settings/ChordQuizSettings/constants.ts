import { ButtonIntents } from 'renderer/components/Button';
import { getDictionaryChordsByComplexity } from 'renderer/hooks/useQuiz';

export const fields = {
  mode: {
    choices: [
      {
        value: 'random',
        label: 'Random',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 'randomInKey',
        label: 'Random in Key',
        intent: 'primary' as ButtonIntents,
      },
    ],
  },
  gameLength: {
    choices: [
      {
        value: 4,
        label: '4',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 8,
        label: '8',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 16,
        label: '16',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 32,
        label: '32',
        intent: 'primary' as ButtonIntents,
      },
    ],
  },
  difficulty: {
    choices: [
      {
        value: 0,
        label: 'Very Easy',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 1,
        label: 'Easy',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 2,
        label: 'Medium',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 3,
        label: 'Hard',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 4,
        label: 'Very Hard',
        intent: 'primary' as ButtonIntents,
      },
      {
        value: 5,
        label: 'All chords',
        intent: 'primary' as ButtonIntents,
      },
    ],
  },
};

export const chordsByComplexity = getDictionaryChordsByComplexity();
