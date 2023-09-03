import React from 'react';
import classnames from 'classnames/bind';
import { NavLink } from 'react-router-dom';

import {
  Grid,
  Card,
  CardThumbnail,
  CardThumbnailOverlay,
  CardHeader,
  Container,
} from '@la-jarre-a-son/ui';

import logo from 'renderer/assets/logo.svg';
import { Icon, NavButton } from 'renderer/components';
import ThumbnaildChordDisplay from 'renderer/assets/thumbnails/chord-display.jpg';
import ThumbnaildChordQuiz from 'renderer/assets/thumbnails/chord-quiz.jpg';
import ThumbnaildCircleOfFifths from 'renderer/assets/thumbnails/circle-of-fifths.jpg';

const Home: React.FC = () => (
  <Container size="xl" className="Home">
    <img className="Home-logo" src={logo} alt="MIDI Jar" />
    <h1>MIDI Jar Overlay</h1>
    <p>
      You can use this local website as a BrowserSource in OBS to integrate MIDI Jar as an overlay,
      or load it on another device to use MIDI Jar remotely.Settings can be edited directly through
      the main application.
    </p>
    <Grid size="md" gap="md">
      <Card outlined elevation={1}>
        <CardThumbnail alt="Chord Display preview" src={ThumbnaildChordDisplay}>
          <CardThumbnailOverlay as={NavLink} to="/chords" interactive />
        </CardThumbnail>
        <CardHeader
          left={<Icon name="music" />}
          right={
            <NavButton
              aria-label="edit"
              icon
              variant="ghost"
              intent="neutral"
              to="/settings/chords"
            >
              <Icon name="settings" />
            </NavButton>
          }
        >
          Chord Display
        </CardHeader>
      </Card>
      <Card outlined elevation={1}>
        <CardThumbnail alt="Chord Quiz preview" src={ThumbnaildChordQuiz}>
          <CardThumbnailOverlay as={NavLink} to="/quiz" interactive />
        </CardThumbnail>
        <CardHeader
          left={<Icon name="quiz" />}
          right={
            <NavButton aria-label="edit" icon variant="ghost" intent="neutral" to="/settings/quiz">
              <Icon name="settings" />
            </NavButton>
          }
        >
          Chord Quiz
        </CardHeader>
      </Card>
      <Card outlined elevation={1}>
        <CardThumbnail alt="Circle of Fifths preview" src={ThumbnaildCircleOfFifths}>
          <CardThumbnailOverlay as={NavLink} to="/circle-of-fifths" interactive />
        </CardThumbnail>
        <CardHeader
          left={<Icon name="circle-of-fifths" />}
          right={
            <NavButton
              aria-label="edit"
              icon
              variant="ghost"
              intent="neutral"
              to="/settings/circle-of-fifths"
            >
              <Icon name="settings" />
            </NavButton>
          }
        >
          Circle of Fifths
        </CardHeader>
      </Card>
    </Grid>
  </Container>
);

export default Home;
