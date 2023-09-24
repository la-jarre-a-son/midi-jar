import React from 'react';
import { Outlet } from 'react-router-dom';

import ChordDisplayList from './ChordDisplayList';

const ChordDisplaySettings: React.FC = () => {
  return (
    <>
      <ChordDisplayList />
      <Outlet />
    </>
  );
};

export default ChordDisplaySettings;
