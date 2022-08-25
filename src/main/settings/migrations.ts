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
  '1.2.0': (store) => {
    store.set('version', '1.2.0');

    const settings = store.get('settings');

    settings.notation = {
      key: settings.chordDisplay.internal.key || 'C',
      accidentals: settings.chordDisplay.internal.accidentals || 'flat',
    };

    delete settings.chordDisplay.internal.key;
    delete settings.chordDisplay.internal.accidentals;

    store.set('settings', settings);
  },
};

export default migrations;
