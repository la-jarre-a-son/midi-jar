import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames/bind';

import { randomPick } from 'renderer/helpers';
import { STATUSES, GameState } from 'renderer/hooks/useQuiz';

import { Reaction, REACTIONS, shouldTriggerNewReaction } from './utils';
import styles from './Reaction.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
  gameState: GameState;
};

const defaultProps = {
  className: undefined,
};

const ChordQuizReaction: React.FC<Props> = ({ className, gameState }) => {
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const reactionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (shouldTriggerNewReaction(gameState, reaction)) {
      if (reactionTimeout.current) {
        clearTimeout(reactionTimeout.current);
      }

      setReaction({
        id: `${gameState.index}-${gameState.status}-${gameState.score}`,
        index: gameState.index,
        status: gameState.status,
        score: gameState.score,
        text: randomPick(REACTIONS[gameState.status] ?? []),
        visible: true,
      });

      reactionTimeout.current = setTimeout(() => {
        setReaction((r) => (r ? { ...r, visible: false } : null));
      }, 3000);
    }
  }, [reaction, gameState]);

  return reaction ? (
    <div
      id="ChordQuizReaction"
      className={cx(
        'reaction',
        `reaction--${STATUSES[reaction.status]}`,
        !reaction.visible && 'reaction--hidden',
        className
      )}
      key={reaction.id}
    >
      {reaction.text}
    </div>
  ) : null;
};

ChordQuizReaction.defaultProps = defaultProps;

export default ChordQuizReaction;
