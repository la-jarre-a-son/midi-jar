import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@la-jarre-a-son/ui';

import SettingsManagerProvider from './contexts/SettingsManager';
import ServerStateProvider from './contexts/ServerState';
import MidiRoutingProvider from './contexts/MidiRouting';
import WindowStateProvider from './contexts/WindowState';
import SettingsProvider from './contexts/Settings';

import router from './router';

import './App.scss';
import ChordDictionaryProvider from './contexts/ChordDictionary';

const App: React.FC = () => (
  <ThemeProvider theme="jar" variant="dark">
    <SettingsManagerProvider source="internal">
      <ServerStateProvider>
        <MidiRoutingProvider>
          <WindowStateProvider>
            <SettingsProvider>
              <ChordDictionaryProvider>
                <RouterProvider router={router} />
              </ChordDictionaryProvider>
            </SettingsProvider>
          </WindowStateProvider>
        </MidiRoutingProvider>
      </ServerStateProvider>
    </SettingsManagerProvider>
  </ThemeProvider>
);

export default App;
