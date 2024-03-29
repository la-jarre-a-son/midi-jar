import React from 'react';

export const ICON_NAMES = [
  'angle-down',
  'angle-left',
  'angle-right',
  'angle-up',
  'bug',
  'copyright',
  'check',
  'circle-of-fifths',
  'clock',
  'controller',
  'cross',
  'dictionary',
  'exclamation',
  'github',
  'heart',
  'hidden',
  'info',
  'loading',
  'midi',
  'midi-error',
  'minimize',
  'minus',
  'maximize',
  'unmaximize',
  'music',
  'overlay',
  'pads',
  'piano',
  'pin',
  'power',
  'plus',
  'quiz',
  'refresh',
  'reset',
  'routing',
  'save',
  'search',
  'server',
  'settings',
  'star',
  'star-filled',
  'trash',
  'visible',
  'window',
] as const;

const ICONS = ICON_NAMES.reduce(
  (obj, name: string) => {
  obj[name] = require(`./${name}.react.svg`).default; // eslint-disable-line
    return obj;
  },
  {} as { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> }
);

export default ICONS;
