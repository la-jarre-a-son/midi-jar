import React, { useMemo } from 'react';
import classnames from 'classnames/bind';

import { useSettings } from 'renderer/contexts/Settings';
import useQuiz, { STATUSES, Game } from 'renderer/hooks/useQuiz';
import useNotes from 'renderer/hooks/useNotes';
import { ChordIntervals, ChordName } from 'renderer/components';

import Reaction from './Reaction';
import GameList from './GameList';

import styles from './ChordQuiz.module.scss';

const cx = classnames.bind(styles);

const ChordQuiz: React.FC = () => {
  const { settings } = useSettings();

  const quizSettings = settings.chordQuiz;
  const notationSettings = settings.notation;

  const { chords, pitchClasses } = useNotes();

  const { games, gameState } = useQuiz(pitchClasses, chords, quizSettings, notationSettings);

  const chordElements = useMemo(
    () =>
      [
        ...(games[gameState.gameIndex] ? games[gameState.gameIndex].chords : []),
        ...(games[gameState.gameIndex + 1] ? games[gameState.gameIndex + 1].chords : []),
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
      <div id="ChordQuiz" className={cx('base')}>
        Game will start
      </div>
    );

  return (
    <div id="ChordQuiz" className={cx('base')}>
      <div className={cx('topContainer')}>
        {quizSettings.displayReaction && (
          <div className={cx('reactionContainer')}>
            <Reaction gameState={gameState} />
          </div>
        )}
        {quizSettings.gamification && (
          <GameList className={cx('gameList')} games={games} gameIndex={gameState.gameIndex} />
        )}
      </div>

      <div className={cx('chordContainer')}>
        {chordElements.map((c) => (
          <div
            key={c.index}
            className={cx(
              'chord',
              c.type === 'targetChord' && `status--${STATUSES[gameState.status]}`,
              c.type
            )}
          >
            <ChordName chord={c.chord} notation={quizSettings.chordNotation} />
          </div>
        ))}
      </div>
      {quizSettings.displayName && (
        <div className={cx('chordName')}>
          {games[gameState.gameIndex].chords[gameState.index].name}
        </div>
      )}
      {quizSettings.displayIntervals && (
        <div className={cx('intervalsContainer')}>
          <ChordIntervals
            targets={games[gameState.gameIndex].chords[gameState.index].intervals}
            intervals={gameState.status > 0 ? gameState.chord?.intervals : []}
            pitchClasses={pitchClasses}
            tonic={games[gameState.gameIndex].chords[gameState.index].tonic}
          />
        </div>
      )}
      <div className={cx('playedContainer')}>
        <div className={cx('progress')}>
          {gameState.index + 1} / {games[gameState.gameIndex].chords.length}
        </div>
        {quizSettings.gamification && <div className={cx('score')}>{gameState.score} pts</div>}
        <div className={cx('playedChord')}>
          <ChordName chord={gameState.chord} notation={quizSettings.chordNotation} />
        </div>
      </div>
    </div>
  );
};

export default ChordQuiz;
