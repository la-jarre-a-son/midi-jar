import { GameState, STATUSES } from 'renderer/hooks/useQuiz';

export type Reaction = {
  id: string;
  status: STATUSES;
  index: number;
  score: number;
  text: string;
  visible: boolean;
};

/**
 * A list of reaction for each game state status.
 *
 * NOTE: don't take it personally, it's the funny part of the software.
 */
export const REACTIONS: { [key in STATUSES]?: string[] } = {
  [STATUSES.different]: [
    'No',
    'Not even close',
    'Nope',
    '???',
    'Try again',
    'Wut ?',
    'Come on...',
    'Incorrect',
    '👎',
  ],
  [STATUSES.subset]: [
    'Almost',
    'Not so far',
    'Not quite my chord',
    'Kinda',
    'Close',
    'Close one',
    '🤏',
  ],
  [STATUSES.equal]: ['Yeah', 'Right', 'Correct', 'Good', 'Perfect', 'OK', '👍'],
  [STATUSES.superset]: [
    'Wow !',
    'Super !',
    'Awesome !',
    'Impressive !',
    'Even Better !',
    'JAZZY !!',
    'Smooth !',
    'Ooh !',
    '👌',
  ],
};

/**
 * Returns true if the current game state should trigger a new reaction
 */
export const shouldTriggerNewReaction = (
  gameState: GameState,
  reaction?: Reaction | null
) => {
  return (
    gameState.status >= 0 &&
    (!reaction ||
      reaction.index !== gameState.index ||
      reaction.status < gameState.status ||
      (reaction.status === gameState.status &&
        reaction.score < gameState.score))
  );
};
