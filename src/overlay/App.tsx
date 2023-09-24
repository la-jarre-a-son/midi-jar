import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MidiMessageManagerProvider from 'renderer/contexts/MidiMessageManager';
import SettingsProvider from 'renderer/contexts/Settings';
import SettingsManagerProvider from 'renderer/contexts/SettingsManager';

import { ThemeProvider } from '@la-jarre-a-son/ui';

import ChordDisplay from 'renderer/views/ChordDisplay';
import ChordQuiz from 'renderer/views/ChordQuiz/ChordQuiz';
import CircleOfFifths from 'renderer/views/CircleOfFifths';

import './App.scss';

import Home from './Home';

export default function App() {
  return (
    <ThemeProvider theme="jar" variant="dark">
      <SettingsManagerProvider source="websocket">
        <SettingsProvider>
          <Router>
            <Routes>
              <Route path="/">
                <Route index element={<Home />} />
                <Route path="chords/:moduleId" element={<ChordDisplay source="websocket" />} />
                <Route
                  path="quiz"
                  element={
                    <MidiMessageManagerProvider namespace="chord-quiz" source="websocket">
                      <ChordQuiz />
                    </MidiMessageManagerProvider>
                  }
                />
                <Route
                  path="circle-of-fifths"
                  element={
                    <MidiMessageManagerProvider namespace="circle-of-fifths" source="websocket">
                      <CircleOfFifths disableUpdate />
                    </MidiMessageManagerProvider>
                  }
                />
              </Route>
            </Routes>
          </Router>
        </SettingsProvider>
      </SettingsManagerProvider>
    </ThemeProvider>
  );
}
