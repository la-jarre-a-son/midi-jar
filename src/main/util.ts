/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import path from 'path';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    return `http://localhost:${port}/${htmlFileName}`;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../', htmlFileName)}`;
  };
}
