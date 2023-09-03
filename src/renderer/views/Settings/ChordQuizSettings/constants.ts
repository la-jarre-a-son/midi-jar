import { getDictionaryChordsByComplexity } from 'renderer/hooks/useQuiz';

export const fields = {
  mode: {
    choices: [
      {
        value: 'random',
        label: 'Random',
      },
      {
        value: 'randomInKey',
        label: 'Random in Key',
      },
    ],
  },
  difficulty: {
    choices: [
      {
        value: '0',
        label: 'Very Easy',
      },
      {
        value: '1',
        label: 'Easy',
      },
      {
        value: '2',
        label: 'Medium',
      },
      {
        value: '3',
        label: 'Hard',
      },
      {
        value: '4',
        label: 'Very Hard',
      },
      {
        value: '5',
        label: 'All chords',
      },
    ],
  },
};

export const chordsByComplexity = getDictionaryChordsByComplexity();
