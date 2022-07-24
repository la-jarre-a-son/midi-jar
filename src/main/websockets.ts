import WebSocket from 'ws';
import http from 'http';
import makeDebug from 'debug';
import { Socket } from 'net';

import { Settings } from './types/Settings';
import { onSettingsChange } from './settings';
import { handleMessage, EventType } from './wsApi';

const debug = makeDebug('app:ws');

const WS_NAMESPACES = ['settings', 'chord-display'];

type ExtendedWebSocket = WebSocket.WebSocket & {
  isAlive?: boolean;
  namespace?: string;
};

const wss = new WebSocket.Server({
  noServer: true,
});

function getWsPathNamespace(url: string): string | null {
  const index = url.indexOf('?');
  const pathname = index !== -1 ? url.slice(0, index) : url;
  const parts = pathname.split('/', 3).filter(Boolean);

  if (parts[0] === 'ws') {
    if (WS_NAMESPACES.includes(parts[1])) return parts[1];
  }

  return null;
}

function abortHandshake(
  socket: Socket,
  code: number,
  message?: string,
  headers?: http.OutgoingHttpHeaders
) {
  const msg = message || http.STATUS_CODES[code] || 'Unknown Error';
  const head: http.OutgoingHttpHeaders = {
    Connection: 'close',
    'Content-Type': 'text/plain',
    'Content-Length': Buffer.byteLength(msg),
    ...headers,
  };

  socket.once('finish', socket.destroy);

  socket.end(
    `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n${Object.keys(head)
      .map((h) => `${h}: ${head[h]}`)
      .join('\r\n')}\r\n\r\n${msg}`
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function send(client: ExtendedWebSocket, eventType: EventType, payload?: any) {
  const data = eventType
    .concat('#')
    .concat(payload ? JSON.stringify(payload) : '');

  client.send(data);
}

export async function broadcast(
  namespace: string,
  eventType: EventType,
  payload?: any // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  wss.clients.forEach(function each(client: ExtendedWebSocket) {
    if (
      client.readyState === WebSocket.OPEN &&
      client.namespace === namespace
    ) {
      send(client, eventType, payload);
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function broadcastRaw(namespace: string, data: any) {
  wss.clients.forEach(function each(client: ExtendedWebSocket) {
    if (
      client.readyState === WebSocket.OPEN &&
      client.namespace === namespace
    ) {
      client.send(data);
    }
  });
}

function heartbeat(this: ExtendedWebSocket) {
  this.isAlive = true;
}

function ping() {
  wss.clients.forEach((ws: ExtendedWebSocket) => {
    if (ws.isAlive === false) {
      debug('Connection lost');
      return ws.terminate();
    }

    ws.isAlive = false;
    return ws.ping();
  });
}

function initHeartbeatLoop() {
  let timeout: ReturnType<typeof setTimeout>;
  function loop() {
    ping();
    timeout = setTimeout(loop, 10000);
  }

  loop();

  wss.on('close', () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });
}

export async function initWSServer(
  server: http.Server
): Promise<WebSocket.Server> {
  wss.on('connection', (ws: ExtendedWebSocket) => {
    ws.isAlive = true;

    ws.on('message', (message) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleMessage(message, (eventType: EventType, payload?: any) =>
        send(ws, eventType, payload)
      );
    });

    ws.on('pong', heartbeat);
  });

  server.on('upgrade', (request, socket, head): void => {
    const namespace = getWsPathNamespace(request.url ?? '');

    if (!namespace) {
      return abortHandshake(socket as Socket, 400, 'Unknown namespace');
    }

    return wss.handleUpgrade(
      request,
      socket,
      head,
      (websocket: ExtendedWebSocket) => {
        websocket.namespace = namespace;

        wss.emit('connection', websocket, request);
      }
    );
  });

  initHeartbeatLoop();

  onSettingsChange((settings?: Settings) => {
    if (settings) {
      broadcast('settings', 'app:settings', settings);
    }
  });

  debug('Server inited');
  return wss;
}
