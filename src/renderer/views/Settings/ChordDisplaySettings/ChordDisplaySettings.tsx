import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import ChordDisplayList from './ChordDisplayList';
import ChordDisplayNamespaceSettings from './ChordDisplayNamespaceSettings';

const ChordDisplaySettings: React.FC = () => {
  const { namespace } = useParams();

  if (!namespace) return <Navigate to="/settings/chords/internal" />;

  return (
    <>
      <ChordDisplayList />
      <ChordDisplayNamespaceSettings namespace={namespace} />
    </>
  );
};

export default ChordDisplaySettings;
