import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MidiMessageManagerProvider from 'renderer/contexts/MidiMessageManager';
import SettingsProvider from 'renderer/contexts/Settings';
import SettingsManagerProvider from 'renderer/contexts/SettingsManager';
import ChordDisplay from 'renderer/views/ChordDisplay';
import icon from '../../assets/icon.svg';
import './App.scss';

const Home = () => {
  return (
    <div className="Home">
      <img className="Home-logo" src={icon} alt="" />
      <h1>MIDI Jar Overlay</h1>
      <p>
        You can use this local website as a BrowserSource in OBS to integrate
        MIDI Jar as an overlay, or load it on another device to use MIDI Jar
        remotely.
      </p>
      <p>Settings can be edited directly through the main application.</p>
      <a href="chords">Go to Chord Display</a>
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
                  <MidiMessageManagerProvider
                    namespace="chord-display"
                    source="websocket"
                  >
                    <ChordDisplay namespace="overlay" />
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
