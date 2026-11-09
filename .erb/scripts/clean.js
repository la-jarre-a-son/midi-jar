import { rimrafSync } from 'rimraf';
import fs from 'fs';
import webpackPaths from '../configs/webpack.paths';

const foldersByTarget = {
  dist: webpackPaths.distPath,
  build: webpackPaths.buildPath,
  dll: webpackPaths.dllPath,
};

const requestedTargets = process.argv.slice(2);
const targets = requestedTargets.length > 0 ? requestedTargets : Object.keys(foldersByTarget);

const foldersToRemove = targets.map((target) => {
  if (!Object.prototype.hasOwnProperty.call(foldersByTarget, target)) {
    throw new Error(`Unknown clean target: ${target}`);
  }
  return foldersByTarget[target];
});

foldersToRemove.forEach((folder) => {
  if (fs.existsSync(folder)) rimrafSync(folder);
});
