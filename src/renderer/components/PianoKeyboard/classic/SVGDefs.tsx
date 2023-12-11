import React from 'react';
import { KeyboardSettings } from 'main/types';

import { getContrastColor } from 'renderer/helpers/color';

import { KeyboardSizes } from './constants';
import { KeyboardKeys } from './types';

type Props = {
  keyboard: KeyboardSettings;
  keys: KeyboardKeys;
  sizes: KeyboardSizes;
};

const SVGDefs: React.FC<Props> = ({ keyboard, keys, sizes }) => (
  <defs>
    <linearGradient id="whiteKey" gradientTransform="rotate(90)">
      <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
      <stop
        offset={`${((sizes.WHITE_HEIGHT - sizes.WHITE_BEVEL - 2) / sizes.WHITE_HEIGHT) * 100}%`}
        stopColor={getContrastColor(keyboard.colors.white ?? '#ffffff')}
        stopOpacity="0"
      />
      <stop
        offset={`${((sizes.WHITE_HEIGHT - sizes.WHITE_BEVEL) / sizes.WHITE_HEIGHT) * 100}%`}
        stopColor={getContrastColor(keyboard.colors.white ?? '#ffffff')}
        stopOpacity="0.1"
      />
    </linearGradient>
    <linearGradient id="blackKey" gradientTransform="rotate(90)">
      <stop
        offset="0%"
        stopColor={getContrastColor(keyboard.colors.black ?? '#000000')}
        stopOpacity="0"
      />
      <stop
        offset={`${((sizes.BLACK_HEIGHT - sizes.BLACK_BEVEL) / sizes.BLACK_HEIGHT) * 100}%`}
        stopColor={getContrastColor(keyboard.colors.black ?? '#000000')}
        stopOpacity="0.2"
      />
      <stop
        offset={`${((sizes.BLACK_HEIGHT - sizes.BLACK_BEVEL) / sizes.BLACK_HEIGHT) * 100}%`}
        stopColor="#ffffff"
        stopOpacity="0.5"
      />
      <stop
        offset={`${((sizes.BLACK_HEIGHT - sizes.BLACK_BEVEL + 4) / sizes.BLACK_HEIGHT) * 100}%`}
        stopColor={getContrastColor(keyboard.colors.black ?? '#000000')}
        stopOpacity="0.1"
      />
      <stop
        offset="100%"
        stopColor={getContrastColor(keyboard.colors.black ?? '#000000')}
        stopOpacity="0.0"
      />
    </linearGradient>
    <mask id="boardMask">
      <rect x="0" y="0" width={keys.width} height={keys.height} fill="#ffffff" />
    </mask>
  </defs>
);

export default SVGDefs;
