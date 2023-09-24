import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import MidiMessageManagerProvider from 'renderer/contexts/MidiMessageManager';
import ChordDisplayModule from './ChordDisplayModule';

type Props = {
  source?: React.ComponentProps<typeof MidiMessageManagerProvider>['source'];
};

const ChordDisplay: React.FC<React.PropsWithChildren<Props>> = ({
  source = 'internal',
  children,
}) => {
  const { moduleId } = useParams();

  if (!moduleId) return <Navigate to="/chords" />;

  return (
    <MidiMessageManagerProvider namespace={`chord-display/${moduleId}`} source={source}>
      <ChordDisplayModule moduleId={moduleId} />
      {children}
    </MidiMessageManagerProvider>
  );
};

ChordDisplay.defaultProps = {
  source: 'internal' as const,
};

export default ChordDisplay;
