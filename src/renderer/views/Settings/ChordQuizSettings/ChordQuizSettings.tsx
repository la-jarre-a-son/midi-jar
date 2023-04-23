import React from 'react';
import classnames from 'classnames/bind';

import { useSettings } from 'renderer/contexts/Settings';

import Toolbar from 'renderer/components/Toolbar';
import Button from 'renderer/components/Button';
import Icon from 'renderer/components/Icon';
import FormField from 'renderer/components/FormField';
import Toggle from 'renderer/components/Toggle';

import { chordsByComplexity, fields } from './constants';

import styles from './ChordQuizSettings.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

/**
 *  ChordQuiz settings page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const ChordQuizSettings: React.FC<Props> = ({ className }) => {
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <div className={cx('base', className)}>
      <div className={cx('container')}>
        <div className={cx('group')}>
          <FormField
            fieldId="chord_quiz_settings:mode"
            label="Mode"
            hint="Choose what alorithm is used to generate chords"
            vertical
          >
            <Toggle
              id="chord_quiz_settings:mode"
              choices={fields.mode.choices}
              onChange={(value) => updateSetting('chordQuiz.mode', value)}
              value={settings.chordQuiz.mode}
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="chord_quiz_settings:difficulty"
            label="Difficulty"
            hint="An arbitrary complexity score is given to chords, the more intervals and alterations a chord has, the more it is complex."
            vertical
          >
            <Toggle
              id="chord_quiz_settings:difficulty"
              choices={fields.difficulty.choices}
              onChange={(value) => updateSetting('chordQuiz.difficulty', value)}
              value={settings.chordQuiz.difficulty}
              successIcon="save"
            />
          </FormField>

          <div className={cx('chordList')}>
            {settings.chordQuiz.difficulty > 0 && (
              <span className={cx('previousLevel')}>Previous level +</span>
            )}
            {chordsByComplexity[settings.chordQuiz.difficulty]?.map((chord) => (
              <span className={cx('chord')}>{chord}</span>
            ))}
          </div>

          <FormField
            fieldId="chord_quiz_settings:game_length"
            label="Game Length"
            hint="Number of chords to be generated for a single round (belonging to the same key signature)"
          >
            <Toggle
              id="chord_quiz_settings:gameLength"
              choices={fields.gameLength.choices}
              onChange={(value) => updateSetting('chordQuiz.gameLength', value)}
              value={settings.chordQuiz.gameLength}
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="chord_quiz_settings:gamification"
            label="Gamification"
            hint="Gamifies the quiz by adding scores and game count (no persistence of scoreboard)"
          >
            <Toggle
              id="chord_quiz_settings:gamification"
              onChange={(value) =>
                updateSetting('chordQuiz.gamification', value)
              }
              value={settings.chordQuiz.gamification}
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="chord_quiz_settings:display-reaction"
            label="Display Reaction"
            hint="Enables the textual reactions to success and fail"
          >
            <Toggle
              id="chord_quiz_settings:display-reaction"
              onChange={(value) =>
                updateSetting('chordQuiz.displayReaction', value)
              }
              value={settings.chordQuiz.displayReaction}
              successIcon="save"
            />
          </FormField>

          <FormField
            fieldId="chord_quiz_settings:display-intervals"
            label="Display Intervals"
            hint="Enables the list of intervals expected and currently played"
          >
            <Toggle
              id="chord_quiz_settings:display-intervals"
              onChange={(value) =>
                updateSetting('chordQuiz.displayIntervals', value)
              }
              value={settings.chordQuiz.displayIntervals}
              successIcon="save"
            />
          </FormField>
        </div>
      </div>
      <Toolbar bottom>
        <Button onClick={() => resetSettings('chordQuiz')}>
          <Icon name="trash" />
          Reset to Defaults
        </Button>
      </Toolbar>
    </div>
  );
};

ChordQuizSettings.defaultProps = defaultProps;

export default ChordQuizSettings;
