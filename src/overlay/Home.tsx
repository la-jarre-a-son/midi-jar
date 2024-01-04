import React from 'react';
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
import { Icon } from 'renderer/components';
import ThumbnaildChordDisplay from 'renderer/assets/thumbnails/chord-display.jpg';
import ThumbnaildChordQuiz from 'renderer/assets/thumbnails/chord-quiz.jpg';
import ThumbnaildCircleOfFifths from 'renderer/assets/thumbnails/circle-of-fifths.jpg';
import ThumbnaildChordDictionary from 'renderer/assets/thumbnails/chord-dictionary.jpg';
import { useSettings } from 'renderer/contexts/Settings';

const Home: React.FC = () => {
  const { settings } = useSettings();

  return (
    <Container size="xl" className="Home">
      <img className="Home-logo" src={logo} alt="MIDI Jar" />
      <h1>MIDI Jar Overlay</h1>
      <p>
        You can use this local website as a BrowserSource in OBS to integrate MIDI Jar as an
        overlay, or load it on another device to use MIDI Jar remotely.Settings can be edited
        directly through the main application.
      </p>
      <Grid size="md" gap="md">
        {settings.chordDisplay.map((module) => (
          <Card outlined elevation={1}>
            <CardThumbnail alt="Chord Display preview" src={ThumbnaildChordDisplay}>
              <CardThumbnailOverlay as={NavLink} to={`/chords/${module.id}`} interactive />
            </CardThumbnail>
            <CardHeader left={<Icon name="music" />}>Chord Display ({module.id})</CardHeader>
          </Card>
        ))}
        <Card outlined elevation={1}>
          <CardThumbnail alt="Chord Quiz preview" src={ThumbnaildChordQuiz}>
            <CardThumbnailOverlay as={NavLink} to="/quiz" interactive />
          </CardThumbnail>
          <CardHeader left={<Icon name="quiz" />}>Chord Quiz</CardHeader>
        </Card>
        <Card outlined elevation={1}>
          <CardThumbnail alt="Circle of Fifths preview" src={ThumbnaildCircleOfFifths}>
            <CardThumbnailOverlay as={NavLink} to="/circle-of-fifths" interactive />
          </CardThumbnail>
          <CardHeader left={<Icon name="circle-of-fifths" />}>Circle of Fifths</CardHeader>
        </Card>
        <Card outlined elevation={1}>
          <CardThumbnail alt="Chord Dictionary preview" src={ThumbnaildChordDictionary}>
            <CardThumbnailOverlay as={NavLink} to="/chord-dictionary" interactive />
          </CardThumbnail>
          <CardHeader left={<Icon name="dictionary" />}>Chord Dictionary</CardHeader>
        </Card>
      </Grid>
    </Container>
  );
};

export default Home;
