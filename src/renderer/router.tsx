import {
  createHashRouter,
  createRoutesFromElements,
  Route,
  Navigate,
  Params,
} from 'react-router-dom';

import { DrawerOutlet, Icon } from 'renderer/components';
import MidiMessageManagerProvider from './contexts/MidiMessageManager';

import Layout from './views/Layout';
import Settings from './views/Settings';
import Home from './views/Home';
import ChordDisplay from './views/ChordDisplay';
import ChordQuiz from './views/ChordQuiz';
import CircleOfFifths from './views/CircleOfFifths';

import GeneralSettings from './views/Settings/GeneralSettings';
import Debugger from './views/Settings/Debugger';
import Routing from './views/Settings/Routing';
import ChordDisplaySettings from './views/Settings/ChordDisplaySettings';
import NotationSettings, { QuickChangeKeyToolbar } from './views/Settings/NotationSettings';
import CircleOfFifthsSettings from './views/Settings/CircleOfFifthsSettings';
import ChordQuizSettings from './views/Settings/ChordQuizSettings';
import About from './views/Settings/About';
import Licenses from './views/Settings/Licenses';

import packageJSON from '../../package.json';
import icon from '../../assets/icon.svg';
import ChordDisplayNamespaceSettings from './views/Settings/ChordDisplaySettings/ChordDisplayModuleSettings';

const router = createHashRouter(
  createRoutesFromElements(
    <Route
      path="/"
      handle={{
        title: packageJSON.build.productName,
        icon: <img src={icon} width={32} height={32} alt="" />,
      }}
      element={<Layout />}
    >
      <Route index element={<Home />} />
      <Route
        path="chords/:moduleId"
        handle={{
          title: (params: Params) => `Chord Display (${params.moduleId})`,
          icon: <Icon name="music" />,
          hasSettings: true,
        }}
        element={
          <ChordDisplay source="internal">
            <DrawerOutlet aria-label="Chord Display Settings" placement="right" size="lg" />
          </ChordDisplay>
        }
      >
        <Route
          path="settings"
          element={
            <>
              <QuickChangeKeyToolbar />
              <ChordDisplayNamespaceSettings parentPath="../.." />
            </>
          }
        />
      </Route>
      <Route
        path="circle-of-fifths"
        handle={{
          title: 'Circle of Fifths',
          icon: <Icon name="circle-of-fifths" />,
          hasSettings: true,
        }}
        element={
          <MidiMessageManagerProvider namespace="circle-of-fifths" source="internal">
            <CircleOfFifths />
            <DrawerOutlet aria-label="Circle of fifths Settings" placement="right" size="lg" />
          </MidiMessageManagerProvider>
        }
      >
        <Route
          path="settings"
          element={
            <>
              <QuickChangeKeyToolbar />
              <CircleOfFifthsSettings />
            </>
          }
        />
      </Route>
      <Route
        path="quiz"
        handle={{ title: 'Chord Quiz', icon: <Icon name="quiz" />, hasSettings: true }}
        element={
          <MidiMessageManagerProvider namespace="chord-quiz" source="internal">
            <ChordQuiz />
            <DrawerOutlet aria-label="Chord Quiz Settings" placement="right" size="lg" />
          </MidiMessageManagerProvider>
        }
      >
        <Route
          path="settings"
          element={
            <>
              <QuickChangeKeyToolbar />
              <ChordQuizSettings />
            </>
          }
        />
      </Route>
      <Route
        path="settings"
        handle={{ title: 'Settings', icon: <Icon name="settings" /> }}
        element={<Settings />}
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

export default router;
