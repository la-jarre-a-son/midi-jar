import path from 'path';
import { app } from 'electron';

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export function resolveHtmlPath(htmlFileName: string, hash?: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    return `http://localhost:${port}/${htmlFileName}#${hash}`;
  }
  return `file://${path.resolve(__dirname, '../', htmlFileName)}#${hash}`;
}

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

export const getURLHash = (url: string) => {
  const index = url.indexOf('#');

  if (index !== -1) {
    return url.substring(index + 1);
  }
  return '/';
};
