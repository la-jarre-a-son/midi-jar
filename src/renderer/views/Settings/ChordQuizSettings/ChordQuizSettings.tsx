import React from 'react';
import classnames from 'classnames/bind';
import {
  Button,
  Container,
  Switch,
  FormField,
  FormControlLabel,
  Slider,
  Select,
  Toolbar,
} from '@la-jarre-a-son/ui';

import { useSettings } from 'renderer/contexts/Settings';
import { Icon, ScrollContainer } from 'renderer/components';

import { chordsByComplexity, fields } from './constants';

import styles from './ChordQuizSettings.module.scss';

const cx = classnames.bind(styles);

const ChordQuizSettings: React.FC = () => {
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <>
      <ScrollContainer pad="md">
        <Container size="md">
          <FormField label="Mode" hint="Choose what alorithm is used to generate chords">
            <Select
              options={fields.mode.choices}
              onChange={(value) => updateSetting('chordQuiz.mode', value)}
              value={settings.chordQuiz.mode}
            />
          </FormField>

          <FormField
            label="Difficulty"
            hint="An arbitrary complexity score is given to chords, the more intervals and alterations a chord has, the more it is complex."
          >
            <Select
              options={fields.difficulty.choices}
              onChange={(value: string) => updateSetting('chordQuiz.difficulty', Number(value))}
              value={`${settings.chordQuiz.difficulty}`}
            />
          </FormField>

          <div className={cx('chordList')}>
            {settings.chordQuiz.difficulty > 0 && (
              <span className={cx('previousLevel')}>Previous level +</span>
            )}
            {chordsByComplexity[settings.chordQuiz.difficulty]?.map((chord) => (
              <span className={cx('chord')} key={chord}>
                {chord}
              </span>
            ))}
          </div>

          <FormField
            label="Game Length"
            hint="Number of chords to be generated for a single round (belonging to the same key signature)"
          >
            <Slider
              value={settings.chordQuiz.gameLength}
              onChange={(value: number) => updateSetting('chordQuiz.gameLength', value)}
              min={4}
              max={32}
              step={4}
              marks={[4, 8, 16, 24, 32]}
              valueText={`${settings.chordQuiz.gameLength}`}
            />
          </FormField>

          <FormControlLabel
            label="Gamification"
            hint="Gamifies the quiz by adding scores and game count (no persistence of scoreboard)"
            reverse
          >
            <Switch
              onChange={(value) => updateSetting('chordQuiz.gamification', value)}
              checked={settings.chordQuiz.gamification}
            />
          </FormControlLabel>

          <FormControlLabel
            label="Display Reaction"
            hint="Enables the textual reactions to success and fail"
            reverse
          >
            <Switch
              onChange={(value) => updateSetting('chordQuiz.displayReaction', value)}
              checked={settings.chordQuiz.displayReaction}
            />
          </FormControlLabel>

          <FormControlLabel
            label="Display Intervals"
            hint="Enables the list of intervals expected and currently played"
            reverse
          >
            <Switch
              onChange={(value) => updateSetting('chordQuiz.displayIntervals', value)}
              checked={settings.chordQuiz.displayIntervals}
            />
          </FormControlLabel>
        </Container>
      </ScrollContainer>
      <Toolbar elevation={2} placement="bottom">
        <Button onClick={() => resetSettings('chordQuiz')} intent="neutral">
          <Icon name="reset" />
          Reset to Defaults
        </Button>
      </Toolbar>
    </>
  );
};

export default ChordQuizSettings;
