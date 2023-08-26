import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MidiMessageManagerProvider from 'renderer/contexts/MidiMessageManager';
import SettingsProvider from 'renderer/contexts/Settings';
import SettingsManagerProvider from 'renderer/contexts/SettingsManager';
import { Button, ButtonGroup, Icon } from 'renderer/components';
import ChordDisplay from 'renderer/views/ChordDisplay';
import CircleOfFifths from 'renderer/views/CircleOfFifths';

import icon from '../../assets/icon.svg';

import './App.scss';

const Home = () => {
  return (
    <div className="Home">
      <img className="Home-logo" src={icon} alt="" />
      <h1>MIDI Jar Overlay</h1>
      <p>
        You can use this local website as a BrowserSource in OBS to integrate MIDI Jar as an
        overlay, or load it on another device to use MIDI Jar remotely.
      </p>
      <p>Settings can be edited directly through the main application.</p>
      <ButtonGroup vertical>
        <Button to="chords">
          <Icon name="music" />
          Chord Display
        </Button>
        <Button to="circle-of-fifths">
          <Icon name="circle-of-fifths" />
          Circle of 5th
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default function App() {
  return (
    <SettingsManagerProvider source="websocket">
      <SettingsProvider>
        <Router>
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route
                path="chords"
                element={
                  <MidiMessageManagerProvider namespace="chord-display" source="websocket">
                    <ChordDisplay namespace="overlay" />
                  </MidiMessageManagerProvider>
                }
              />
              <Route
                path="circle-of-fifths"
                element={
                  <MidiMessageManagerProvider namespace="chord-display" source="websocket">
                    <CircleOfFifths disableUpdate />
                  </MidiMessageManagerProvider>
                }
              />
            </Route>
          </Routes>
        </Router>
      </SettingsProvider>
    </SettingsManagerProvider>
  );
}
