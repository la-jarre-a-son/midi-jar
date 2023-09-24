/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebSocket, WebSocketServer, RawData } from 'ws';
import http from 'http';
import makeDebug from 'debug';
import { Socket } from 'net';

const debug = makeDebug('app:ws');

const WS_NAMESPACES = ['settings', 'chord-display', 'chord-quiz', 'circle-of-fifths'];

export type WebsocketMessageReply = (eventType: string, payload: any) => void;

export type WebsocketMessageHandler = (
  namespace: string[],
  payload: any,
  reply: WebsocketMessageReply
) => void;

const handlers: {
  [eventType: string]: WebsocketMessageHandler;
} = {};

type ExtendedWebSocket = WebSocket & {
  isAlive?: boolean;
  namespace?: string[];
};

const wss = new WebSocketServer({
  noServer: true,
});

function getWsPathNamespace(url: string): string[] | null {
  const index = url.indexOf('?');
  const pathname = index !== -1 ? url.slice(0, index) : url;
  const [rootPath, ...namespace] = pathname.split('/').filter(Boolean);

  if (rootPath === 'ws') {
    if (WS_NAMESPACES.includes(namespace[0])) return namespace;
  }

  return null;
}

function namespaceMatch(namespace?: string[], mask?: string[]) {
  if (!mask?.length || !namespace?.length) return false;

  for (let i = 0; i < mask.length; i += 1) {
    if (namespace[i] !== mask[i]) return false;
  }

  return true;
}

function parseMessage(message: RawData) {
  const str = message.toString();
  const index = str.indexOf('#');
  const eventType = index !== -1 ? str.slice(0, index) : str;
  const rawPayload = index !== -1 ? str.slice(index + 1) : undefined;

  const payload = rawPayload ? JSON.parse(rawPayload) : undefined;

  return [eventType, payload];
}

function formatMessage(eventType: string, payload: any) {
  const data = eventType.concat('#').concat(payload !== undefined ? JSON.stringify(payload) : '');

  return data;
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

function send(client: ExtendedWebSocket, eventType: string, payload?: any) {
  client.send(formatMessage(eventType, payload));
}

export async function broadcast(namespaceMask: string[], eventType: string, payload?: any) {
  wss.clients.forEach(function each(client: ExtendedWebSocket) {
    if (client.readyState === WebSocket.OPEN && namespaceMatch(client.namespace, namespaceMask)) {
      send(client, eventType, payload);
    }
  });
}

export async function broadcastRaw(namespaceMask: string[], data: any) {
  wss.clients.forEach(function each(client: ExtendedWebSocket) {
    if (client.readyState === WebSocket.OPEN && namespaceMatch(client.namespace, namespaceMask)) {
      client.send(data);
    }
  });
}

export function registerHandler(eventType: string, handler: WebsocketMessageHandler) {
  handlers[eventType] = handler;
}

export function handleMessage(namespace: string[], message: RawData, reply: WebsocketMessageReply) {
  try {
    const [eventType, payload] = parseMessage(message);

    if (handlers[eventType]) {
      handlers[eventType](namespace, payload, reply);
    } else {
      debug(`no handler for ${eventType}`);
    }
  } catch (err) {
    debug('cannot handle message', message.toString());
  }
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

export async function initWSServer(server: http.Server): Promise<WebSocketServer> {
  wss.on('connection', (ws: ExtendedWebSocket) => {
    ws.isAlive = true;

    ws.on('message', (message) => {
      if (ws.namespace) {
        const reply = (eventType: string, payload?: any) => send(ws, eventType, payload);

        handleMessage(ws.namespace, message, reply);
      }
    });

    ws.on('pong', () => {
      ws.isAlive = true;
    });
  });

  server.on('upgrade', (request, socket, head): void => {
    const namespace = getWsPathNamespace(request.url ?? '');

    if (!namespace) {
      return abortHandshake(socket as Socket, 400, 'Unknown namespace');
    }

    return wss.handleUpgrade(request, socket, head, (websocket: ExtendedWebSocket) => {
      websocket.namespace = namespace;

      wss.emit('connection', websocket, request);
    });
  });

  initHeartbeatLoop();

  debug('Server inited');
  return wss;
}
