import { Server } from 'http';
import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import os from 'os';
import bodyParser from 'body-parser';
import makeDebug from 'debug';
import { initWSServer } from './websockets';
import { getSettings } from './settings';

type ServerState = {
  started: boolean;
  port: number | null;
  addresses: string[];
  error: string | null;
  httpServer?: Server;
  wsServer?: Awaited<ReturnType<typeof initWSServer>>;
};

const debug = makeDebug('app:http');
const app = express();
const state: ServerState = {
  started: false,
  port: null,
  error: null,
  addresses: [],
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

class ServerError extends Error {
  status: number;

  constructor(msg: string, status: number) {
    super(msg);
    this.status = status || 500;
  }
}

if (process.env.NODE_ENV === 'development') {
  app.use(
    '*',
    createProxyMiddleware({
      target: `http://localhost:${process.env.PORT || 1212}`,
    })
  );
} else {
  app.get('/renderer*', (_req, res) => res.redirect('/'));
  app.get('/main*', (_req, res) => res.redirect('/'));
  app.get('*', express.static(path.join(__dirname, '../')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../overlay.html'));
  });
}

app.use((err: ServerError | Error, _req: Request, res: Response, _next: NextFunction): void => {
  res.status(err instanceof ServerError ? err.status : 500);
  res.send(`${__dirname}: ${err.message}`);
});

function initHttpServer(port: number): Promise<ReturnType<typeof app.listen>> {
  return new Promise((resolve, reject) => {
    try {
      const httpServer = app.listen(port, () => {
        debug(`HTTP server listening on port ${port}`);
        resolve(httpServer);
      });

      httpServer.on('error', (error) => {
        debug(`Failed to start server on port ${port}`);
        reject(error);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function closeHttpServer(): Promise<void> {
  if (state.started && state.httpServer) {
    return new Promise((resolve, reject) => {
      if (!state.httpServer) {
        resolve();
      } else {
        try {
          state.httpServer?.close((err) => {
            if (err) {
              debug(`Failed to stop HTTP server`);
              reject(err);
            } else {
              debug(`Server http stopped`);
              resolve();
            }
          });
        } catch (err) {
          reject(err);
        }
      }
    });
  }
  return Promise.resolve();
}

export function getAddresses(): string[] {
  const nets = os.networkInterfaces();

  const ips = Object.keys(nets).map(
    (name) => nets[name]?.map((net) => (net.family === 'IPv4' ? net.address : null))
  );
  ips.unshift(['localhost']);

  return ips.flatMap((address) => address).filter(Boolean) as string[];
}

export function getState() {
  return {
    started: state.started,
    port: state.port,
    error: state.error,
    addresses: getAddresses(),
  };
}

export async function stopServer() {
  await closeHttpServer();
  state.started = false;
  state.port = null;
  state.addresses = [];
  state.httpServer = undefined;
  state.wsServer = undefined;

  return getState();
}

export async function startServer(): Promise<ServerState | null> {
  const settings = getSettings();
  const { enabled, port } = settings.server;

  if (enabled && port) {
    try {
      if (state.started) {
        await closeHttpServer();
      }

      const httpServer = await initHttpServer(port);
      const wsServer = await initWSServer(httpServer);

      state.started = true;
      state.port = port;
      state.httpServer = httpServer;
      state.wsServer = wsServer;
      state.error = null;
      state.addresses = getAddresses();
    } catch (err) {
      if (err instanceof Error) {
        state.error = err.message;
      } else if (typeof err === 'string') {
        state.error = err;
      } else {
        state.error = 'Unknown error';
      }

      throw err;
    }

    return getState();
  }

  return null;
}
