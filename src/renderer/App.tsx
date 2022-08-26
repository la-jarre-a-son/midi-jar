import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.scss';

import MidiMessageManagerProvider from './contexts/MidiMessageManager';
import SettingsManagerProvider from './contexts/SettingsManager';
import ServerStateProvider from './contexts/ServerState';
import MidiRoutingProvider from './contexts/MidiRouting';
import WindowStateProvider from './contexts/WindowState';
import SettingsProvider from './contexts/Settings';

import Layout from './views/Layout';
import Settings from './views/Settings';
import Home from './views/Home';
import ChordDisplay from './views/ChordDisplay';
import CircleOfFifths from './views/CircleOfFifths';

import GeneralSettings from './views/Settings/GeneralSettings';
import Debugger from './views/Settings/Debugger';
import Routing from './views/Settings/Routing';
import NotationSettings from './views/Settings/NotationSettings';
import ChordDisplaySettings from './views/Settings/ChordDisplaySettings';
import CircleOfFifthsSettings from './views/Settings/CircleOfFifthsSettings';
import ServerSettings from './views/Settings/ServerSettings';
import Credits from './views/Settings/Credits';
import Licenses from './views/Settings/Licenses';

export default function App() {
  return (
    <SettingsManagerProvider source="internal">
      <ServerStateProvider>
        <MidiRoutingProvider>
          <WindowStateProvider>
            <SettingsProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route
                      path="chords"
                      element={
                        <MidiMessageManagerProvider
                          namespace="chord-display"
                          source="internal"
                        >
                          <ChordDisplay namespace="internal" />
                        </MidiMessageManagerProvider>
                      }
                    />
                    <Route
                      path="circle-of-fifths"
                      element={
                        <MidiMessageManagerProvider
                          namespace="chord-display"
                          source="internal"
                        >
                          <CircleOfFifths />
                        </MidiMessageManagerProvider>
                      }
                    />
                    <Route path="settings" element={<Settings />}>
                      <Route
                        index
                        element={<Navigate to="general" replace />}
                      />
                      <Route path="general" element={<GeneralSettings />} />
                      <Route path="routing" element={<Routing />} />
                      <Route
                        path="notation"
                        element={
                          <MidiMessageManagerProvider
                            namespace="chord-display"
                            source="internal"
                          >
                            <NotationSettings />
                          </MidiMessageManagerProvider>
                        }
                      />
                      <Route
                        path="circle-of-fifths"
                        element={<CircleOfFifthsSettings />}
                      />
                      <Route
                        path="debug"
                        element={
                          <MidiMessageManagerProvider
                            namespace="debugger"
                            source="internal"
                          >
                            <Debugger />
                          </MidiMessageManagerProvider>
                        }
                      />
                      <Route path="chords">
                        <Route
                          index
                          element={<Navigate to="internal" replace />}
                        />
                        <Route
                          path=":namespace"
                          element={
                            <MidiMessageManagerProvider
                              namespace="chord-display"
                              source="internal"
                            >
                              <ChordDisplaySettings />
                            </MidiMessageManagerProvider>
                          }
                        />
                      </Route>
                      <Route path="server" element={<ServerSettings />} />
                      <Route path="credits" element={<Credits />} />
                      <Route path="licenses" element={<Licenses />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </Router>
            </SettingsProvider>
          </WindowStateProvider>
        </MidiRoutingProvider>
      </ServerStateProvider>
    </SettingsManagerProvider>
  );
}
