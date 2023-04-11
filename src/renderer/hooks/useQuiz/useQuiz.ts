import { useEffect, useReducer } from 'react';

import { Chord as TChord } from '@tonaljs/chord';

import {
  getGameState,
  GameState,
  Game,
  GameMode,
  STATUSES,
  generateGame,
  GAME_LENGTH,
} from './utils';

interface Parameters {
  mode: 'random';
}

enum QuizActionType {
  CHORD_PLAYED = 'CHORD_PLAYED',
  CHORD_RELEASE = 'CHORD_RELEASE',
}

interface QuizAction {
  type: QuizActionType;
  chords: (TChord | null)[];
  pitchClasses: string[];
}

enum ParametersActionTypes {
  MODE_CHANGED = 'MODE_CHANGED',
}

interface ParametersAction {
  type: ParametersActionTypes;
  value: unknown;
}

type Action = QuizAction | ParametersAction;

interface State {
  mode: GameMode;
  games: Game[];
  gameState: GameState;
}

function reducer(state: State, action: Action): State {
  const { type } = action;

  switch (type) {
    case ParametersActionTypes.MODE_CHANGED: {
      const mode = action.value as typeof state.mode;

      const game = generateGame(mode);

      if (!game) return state;

      return {
        ...state,
        mode,
        games: [game],
        gameState: {
          gameIndex: 0,
          index: 0,
          status: STATUSES.none,
          chord: null,
          score: 0,
        },
      };
    }
    case QuizActionType.CHORD_PLAYED: {
      const { chords, pitchClasses } = action;

      const gameState = chords.reduce<GameState>((best, chord) => {
        const c = getGameState(
          state.gameState.gameIndex,
          state.gameState.index,
          state.games[state.gameState.gameIndex].chords[state.gameState.index],
          chord,
          pitchClasses
        );

        if (
          !best.chord ||
          best.status < c.status ||
          (best.status === c.status && best.score < c.score)
        ) {
          return c;
        }

        return best;
      }, state.gameState);

      return {
        ...state,
        gameState,
      };
    }
    case QuizActionType.CHORD_RELEASE: {
      const gameStateStatus = state.gameState.status;

      if (gameStateStatus > -1) {
        const games = [...state.games];
        const currentGame = games[state.gameState.gameIndex];

        if (gameStateStatus > 1) {
          currentGame.succeeded += 1;
        }
        currentGame.score += state.gameState.score;
        currentGame.played.push(state.gameState.chord);

        if (state.gameState.index + 2 >= GAME_LENGTH) {
          const game = generateGame(state.mode);

          if (game) {
            games.push(game);
          }
        }

        return {
          ...state,
          games,
          gameState: {
            gameIndex:
              state.gameState.index + 1 === GAME_LENGTH
                ? state.gameState.gameIndex + 1
                : state.gameState.gameIndex,
            index:
              state.gameState.index + 1 === GAME_LENGTH
                ? 0
                : state.gameState.index + 1,
            status: STATUSES.none,
            chord: null,
            score: 0,
          },
        };
      }

      return {
        ...state,
        gameState: {
          gameIndex: state.gameState.gameIndex,
          index: state.gameState.index,
          status: STATUSES.none,
          chord: null,
          score: 0,
        },
      };
    }

    default:
      return state;
  }
}

const defaultState: State = {
  mode: 'random',
  games: [],
  gameState: {
    gameIndex: 0,
    index: 0,
    status: STATUSES.none,
    chord: null,
    score: 0,
  },
};

export default function useQuiz(
  pitchClasses: string[],
  chords: (TChord | null)[],
  { mode = 'random' }: Partial<Parameters> = {}
) {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    mode,
  });

  useEffect(() => {
    dispatch({
      type: ParametersActionTypes.MODE_CHANGED,
      value: mode,
    });
  }, [mode]);

  useEffect(() => {
    if (pitchClasses.length === 0) {
      dispatch({
        type: QuizActionType.CHORD_RELEASE,
        chords,
        pitchClasses,
      });
    } else {
      dispatch({ type: QuizActionType.CHORD_PLAYED, chords, pitchClasses });
    }
  }, [pitchClasses, chords]);

  return state;
}
