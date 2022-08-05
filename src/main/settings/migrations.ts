import { Migrations } from 'conf/dist/source/types';
import { StoreType } from '../types/Settings';

const migrations: Migrations<StoreType> = {
  '1.0.0': (store) => {
    store.set('version', '1.0.0');
  },
  '1.1.0': (store) => {
    store.set('version', '1.1.0');
    store.set('settings.chordDisplay.internal.key', 'C');
    store.set('settings.chordDisplay.overlay.key', 'C');
  },
};

export default migrations;
