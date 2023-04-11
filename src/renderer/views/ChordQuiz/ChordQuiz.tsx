import React, { useMemo } from 'react';
import classnames from 'classnames/bind';

import { defaults } from 'main/settings/schema';

import { useSettings } from 'renderer/contexts/Settings';
import useQuiz, { STATUSES, Game } from 'renderer/hooks/useQuiz';
import ChordIntervals from 'renderer/components/ChordIntervals';
import ChordName from 'renderer/components/ChordName';

import useNotes from 'renderer/hooks/useNotes';
import Reaction from './Reaction';

import styles from './ChordQuiz.module.scss';
import GameList from './GameList';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
};

/**
 *  ChordQuiz page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const ChordQuiz: React.FC<Props> = ({ className }) => {
  const { settings } = useSettings();

  const quizSettings = settings?.chordQuiz ?? defaults.settings.chordQuiz;

  const { mode } = quizSettings;

  const { chords, pitchClasses } = useNotes();

  const { games, gameState } = useQuiz(pitchClasses, chords, {
    mode,
  });

  const chordElements = useMemo(
    () =>
      [
        ...(games[gameState.gameIndex]
          ? games[gameState.gameIndex].chords
          : []),
        ...(games[gameState.gameIndex + 1]
          ? games[gameState.gameIndex + 1].chords
          : []),
      ].reduce(
        (acc, chord, index) => {
          let type = null;
          if (index === gameState.index - 1) {
            type = 'prevChord';
          }

          if (index === gameState.index) {
            type = 'targetChord';
          }

          if (index === gameState.index + 1) {
            type = 'nextChord';
          }

          if (type) {
            return [
              ...acc,
              {
                index: games[gameState.gameIndex]
                  ? index % games[gameState.gameIndex].chords.length
                  : index,
                chord,
                type,
              },
            ];
          }

          return acc;
        },
        [] as Array<{
          index: number;
          chord: Game['chords'][number];
          type: string;
        }>
      ),
    [games, gameState.index, gameState.gameIndex]
  );

  if (!settings) return null;

  if (!games.length)
    return (
      <div id="ChordQuiz" className={cx('base', className)}>
        Game will start
      </div>
    );

  return (
    <div id="ChordQuiz" className={cx('base', className)}>
      <div className={cx('topContainer')}>
        <div className={cx('reactionContainer')}>
          <Reaction gameState={gameState} />
        </div>
        <GameList
          className={cx('gameList')}
          games={games}
          gameIndex={gameState.gameIndex}
        />
      </div>

      <div className={cx('chordContainer')}>
        {chordElements.map((c) => (
          <div
            key={c.index}
            className={cx(
              'chord',
              c.type === 'targetChord' &&
                `status--${STATUSES[gameState.status]}`,
              c.type
            )}
          >
            <ChordName chord={c.chord} />
          </div>
        ))}
      </div>

      <div className={cx('intervalsContainer')}>
        <ChordIntervals
          targets={games[gameState.gameIndex].chords[gameState.index].intervals}
          intervals={gameState.status > 0 ? gameState.chord?.intervals : []}
          pitchClasses={pitchClasses}
          tonic={games[gameState.gameIndex].chords[gameState.index].tonic}
        />
      </div>

      <div className={cx('playedContainer')}>
        <div className={cx('progress')}>
          {gameState.index + 1} / {games[gameState.gameIndex].chords.length}
        </div>
        <div className={cx('score')}>{gameState.score} pts</div>
        <div className={cx('playedChord')}>
          <ChordName chord={gameState.chord} />
        </div>
      </div>
    </div>
  );
};

ChordQuiz.defaultProps = defaultProps;

export default ChordQuiz;
