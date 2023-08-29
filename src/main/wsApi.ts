import { RawData } from 'ws';
import makeDebug from 'debug';
import { getSettings } from './settings';

const debug = makeDebug('app:ws:api');

export type EventType = 'app:settings' | 'app:settings:getSettings';

function parseMessage(message: RawData) {
  const str = message.toString();
  const index = str.indexOf('#');
  const eventType = index !== -1 ? str.slice(0, index) : str;
  const rawPayload = index !== -1 ? str.slice(index + 1) : undefined;

  const payload = rawPayload ? JSON.parse(rawPayload) : undefined;

  return [eventType, payload];
}

export function handleMessage(
  message: RawData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reply: (eventType: EventType, payload: any) => void
) {
  try {
    const [eventType /* , payload */] = parseMessage(message);

    switch (eventType as EventType) {
      case 'app:settings:getSettings': {
        const settings = getSettings();
        reply('app:settings', settings);
        break;
      }
      default:
    }
  } catch (err) {
    debug('cannot handle message', message.toString());
  }
}
