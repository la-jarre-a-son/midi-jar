import React from 'react';
import { Route, Navigate } from 'react-router-dom';

import { Icon } from 'renderer/components';
import MidiMessageManagerProvider from 'renderer/contexts/MidiMessageManager';

import SettingsLayout from './Layout';

import GeneralSettings from './GeneralSettings';
import Debugger from './Debugger';
import Routing from './Routing';
import ChordDisplaySettings from './ChordDisplaySettings';
import ChordDisplayNamespaceSettings from './ChordDisplaySettings/ChordDisplayModuleSettings';
import ChordDictionarySettings from './ChordDictionarySettings';
import NotationSettings from './NotationSettings';
import CircleOfFifthsSettings from './CircleOfFifthsSettings';
import ChordQuizSettings from './ChordQuizSettings';
import About from './About';
import Licenses from './Licenses';

export const settingsRoutes = () => (
  <Route
    path="settings"
    handle={{ title: 'Settings', icon: <Icon name="settings" /> }}
    element={<SettingsLayout />}
  >
    <Route index element={<Navigate to="general" replace />} />
    <Route path="general" element={<GeneralSettings />} />
    <Route path="routing" element={<Routing />} />
    <Route
      path="notation"
      element={
        <MidiMessageManagerProvider namespace="*" source="internal">
          <NotationSettings />
        </MidiMessageManagerProvider>
      }
    />
    <Route path="circle-of-fifths" element={<CircleOfFifthsSettings />} />
    <Route path="quiz" element={<ChordQuizSettings />} />
    <Route path="chord-dictionary" element={<ChordDictionarySettings />} />
    <Route path="chords" element={<ChordDisplaySettings />}>
      <Route
        path=":moduleId"
        element={
          <MidiMessageManagerProvider namespace="*" source="internal">
            <ChordDisplayNamespaceSettings parentPath=".." />
          </MidiMessageManagerProvider>
        }
      />
    </Route>
    <Route
      path="debug"
      element={
        <MidiMessageManagerProvider namespace="debugger" source="internal">
          <Debugger />
        </MidiMessageManagerProvider>
      }
    />
    <Route path="licenses" element={<Licenses />} />
    <Route path="about" element={<About />} />
  </Route>
);

export default settingsRoutes;
