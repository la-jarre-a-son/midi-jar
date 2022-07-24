const path = require('path');

const rootPath = path.join(__dirname, '../..');

const dllPath = path.join(__dirname, '../dll');
const nodeModulesPath = path.join(rootPath, 'node_modules');

const srcPath = path.join(rootPath, 'src');
const srcMainPath = path.join(srcPath, 'main');
const srcRendererPath = path.join(srcPath, 'renderer');
const srcOverlayPath = path.join(srcPath, 'overlay');
const srcStylePath = path.join(srcPath, 'renderer', 'style');

const releasePath = path.join(rootPath, 'release');
const appPath = path.join(releasePath, 'app');
const appPackagePath = path.join(appPath, 'package.json');
const appNodeModulesPath = path.join(appPath, 'node_modules');
const srcNodeModulesPath = path.join(srcPath, 'node_modules');

const distPath = path.join(appPath, 'dist');
const distMainPath = path.join(distPath, 'main');
const distRendererPath = distPath;
const distOverlayPath = distPath;

const buildPath = path.join(releasePath, 'build');

export default {
  rootPath,
  dllPath,
  nodeModulesPath,
  srcPath,
  srcMainPath,
  srcRendererPath,
  srcStylePath,
  srcOverlayPath,
  releasePath,
  appPath,
  appPackagePath,
  appNodeModulesPath,
  srcNodeModulesPath,
  distPath,
  distMainPath,
  distRendererPath,
  distOverlayPath,
  buildPath,
};
