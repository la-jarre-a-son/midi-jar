import { KeyboardSettings } from 'main/types';

export const BASE_SIZE = 24;
export const LABEL_SIZE = 14;
export const INFO_SIZE = 12;

export type KeyboardSizes = {
  LABEL_HEIGHT: number;
  LABEL_OFFSET: number;
  WIDTH: number;
  HEIGHT: number;
  TONIC_RADIUS: number;
  INFO_OFFSET: number;
  NAME_OFFSET: number;
};

export function getKeyboardSizes(keyboard: KeyboardSettings): KeyboardSizes {
  const WIDTH = BASE_SIZE;
  const HEIGHT = BASE_SIZE * keyboard.sizes.height;

  return {
    LABEL_HEIGHT: LABEL_SIZE,
    LABEL_OFFSET: 4,
    WIDTH,
    HEIGHT,
    TONIC_RADIUS: 4,
    NAME_OFFSET: 8,
    INFO_OFFSET: HEIGHT - 8,
  };
}
