import { AppApi, MidiApi, OsApi } from 'main/preload';

declare global {
  interface Window {
    os: typeof OsApi;
    midi: typeof MidiApi;
    app: typeof AppApi;
  }
}
