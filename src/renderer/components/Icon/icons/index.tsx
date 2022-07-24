import React from 'react';

export const ICON_NAMES = [
  'angle-down',
  'angle-up',
  'bug',
  'check',
  'controller',
  'cross',
  'exclamation',
  'github',
  'heart',
  'info',
  'loading',
  'midi',
  'midi-error',
  'minimize',
  'maximize',
  'unmaximize',
  'overlay',
  'pads',
  'piano',
  'pin',
  'power',
  'routing',
  'save',
  'server',
  'settings',
  'trash',
  'window',
];

const ICONS = ICON_NAMES.reduce((obj, name: string) => {
  obj[name] = require(`./${name}.react.svg`).default; // eslint-disable-line
  return obj;
}, {} as { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> });

export default ICONS;
