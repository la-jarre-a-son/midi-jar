import React from 'react';
import classnames from 'classnames/bind';
import { NavLink } from 'react-router-dom';

import {
  Button,
  Grid,
  Card,
  CardThumbnail,
  CardThumbnailOverlay,
  CardThumbnailItem,
  CardHeader,
  Container,
  Modal,
  ModalContent,
  ModalHeader,
} from '@la-jarre-a-son/ui';

import { ServerState } from 'main/types';

import { Icon, NavButton } from 'renderer/components';
import About from 'renderer/views/Settings/About';
import ThumbnaildChordDisplay from 'renderer/assets/thumbnails/chord-display.jpg';
import ThumbnaildChordQuiz from 'renderer/assets/thumbnails/chord-quiz.jpg';
import ThumbnaildCircleOfFifths from 'renderer/assets/thumbnails/circle-of-fifths.jpg';
import ThumbnailRouting from 'renderer/assets/thumbnails/routing.jpg';
import ThumbnailDebugger from 'renderer/assets/thumbnails/debugger.jpg';
import { useServerState } from 'renderer/contexts/ServerState';
import { useSettings } from 'renderer/contexts/Settings';
import { useWindowState } from 'renderer/contexts/WindowState';
import styles from './Home.module.scss';

const getOverlayUrl = (state: ServerState, path: string) =>
  `http://${state.addresses[0]}:${state.port}${path}`;

const cx = classnames.bind(styles);

const Home: React.FC = () => {
  const { settings } = useSettings();
  const { isChangelogDismissed, dismissChangelog } = useWindowState();
  const { state } = useServerState();
  const overlayEnabled = state.started && !!state.addresses.length;

  const closeAboutModalOpen = () => {
    dismissChangelog();
  };

  return (
    <>
      <Container size="xl" className={cx('base')}>
        <Grid size="md" gap="md">
          {settings.chordDisplay.map((module) => (
            <Card key={`chord-display/${module.id}`} outlined elevation={1}>
              <CardThumbnail alt="Chord Display preview" src={ThumbnaildChordDisplay}>
                <CardThumbnailOverlay as={NavLink} to={`/chords/${module.id}`} interactive />
                {overlayEnabled && (
                  <CardThumbnailItem position="top-left">
                    <Button
                      as="a"
                      href={getOverlayUrl(state, `/chords/${module.id}`)}
                      target="_blank"
                      aria-label="overlay"
                      icon
                      intent="primary"
                      variant="ghost"
                      hoverIntent
                    >
                      <Icon name="overlay" />
                    </Button>
                  </CardThumbnailItem>
                )}
              </CardThumbnail>
              <CardHeader
                left={<Icon name="music" />}
                right={
                  <NavButton
                    aria-label="edit"
                    icon
                    variant="ghost"
                    intent="neutral"
                    to={`/settings/chords/${module.id}`}
                  >
                    <Icon name="settings" />
                  </NavButton>
                }
              >
                Chord Display ({module.id})
              </CardHeader>
            </Card>
          ))}
          <Card outlined elevation={1}>
            <CardThumbnail alt="Chord Quiz preview" src={ThumbnaildChordQuiz}>
              <CardThumbnailOverlay as={NavLink} to="/quiz" interactive />
              {overlayEnabled && (
                <CardThumbnailItem position="top-left">
                  <Button
                    as="a"
                    href={getOverlayUrl(state, '/quiz')}
                    target="_blank"
                    aria-label="overlay"
                    icon
                    intent="primary"
                    variant="ghost"
                    hoverIntent
                  >
                    <Icon name="overlay" />
                  </Button>
                </CardThumbnailItem>
              )}
            </CardThumbnail>
            <CardHeader
              left={<Icon name="quiz" />}
              right={
                <NavButton
                  aria-label="edit"
                  icon
                  variant="ghost"
                  intent="neutral"
                  to="/settings/quiz"
                >
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
              {overlayEnabled && (
                <CardThumbnailItem position="top-left">
                  <Button
                    as="a"
                    href={getOverlayUrl(state, '/circle-of-fifths')}
                    target="_blank"
                    aria-label="overlay"
                    icon
                    intent="primary"
                    variant="ghost"
                    hoverIntent
                  >
                    <Icon name="overlay" />
                  </Button>
                </CardThumbnailItem>
              )}
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
          <Card outlined elevation={1}>
            <CardThumbnail alt="Settings preview" src={ThumbnailRouting}>
              <CardThumbnailOverlay as={NavLink} to="/settings/routing" interactive />
            </CardThumbnail>
            <CardHeader left={<Icon name="routing" />}>Routing</CardHeader>
          </Card>
          <Card outlined elevation={1}>
            <CardThumbnail alt="Debugger preview" src={ThumbnailDebugger}>
              <CardThumbnailOverlay as={NavLink} to="/settings/debug" interactive />
            </CardThumbnail>
            <CardHeader left={<Icon name="bug" />}>Debugger</CardHeader>
          </Card>
        </Grid>
      </Container>
      <Modal onClose={closeAboutModalOpen} open={!isChangelogDismissed} size="lg">
        <ModalHeader title="MIDI Jar" />
        <ModalContent>
          <About />
        </ModalContent>
      </Modal>
    </>
  );
};

export default Home;
