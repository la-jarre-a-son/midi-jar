import { KeyboardSettings } from 'main/types';

export const BASE_SIZE = 24;
export const LABEL_SIZE = 20;
export const INFO_SIZE = 12;

export type KeyboardSizes = {
  LABEL_HEIGHT: number;
  LABEL_OFFSET: number;
  RADIUS: number;
  WHITE_WIDTH: number;
  WHITE_HEIGHT: number;
  BLACK_WIDTH: number;
  BLACK_HEIGHT: number;
  BLACK_OFFSET: number;
  WHITE_BEVEL: number;
  BLACK_BEVEL: number;
  TONIC_RADIUS: number;
  WHITE_INFO_OFFSET: number;
  WHITE_NAME_OFFSET: number;
  BLACK_INFO_OFFSET: number;
  BLACK_NAME_OFFSET: number;
};

export function getKeyboardSizes(keyboard: KeyboardSettings): KeyboardSizes {
  const RADIUS = (keyboard.sizes.radius * BASE_SIZE) / 2;
  const WHITE_WIDTH = Math.round((12 * BASE_SIZE) / 7);
  const WHITE_HEIGHT = keyboard.sizes.height * BASE_SIZE;
  const BLACK_HEIGHT = keyboard.sizes.ratio * WHITE_HEIGHT;
  const WHITE_BEVEL = keyboard.sizes.bevel ? BASE_SIZE * 0.5 : 0;
  const BLACK_BEVEL = keyboard.sizes.bevel ? BASE_SIZE * 0.75 : 0;

  const BLACK_NAME_HEIGHT =
    keyboard.keyName === 'none' || keyboard.keyName === 'octave' ? 0 : BASE_SIZE * 0.75;
  const WHITE_NAME_HEIGHT = keyboard.keyName === 'none' ? 0 : BASE_SIZE * 0.5;

  return {
    LABEL_HEIGHT: LABEL_SIZE,
    LABEL_OFFSET: 4,
    RADIUS,
    WHITE_WIDTH,
    WHITE_HEIGHT,
    BLACK_WIDTH: BASE_SIZE,
    BLACK_HEIGHT,
    BLACK_OFFSET: (WHITE_WIDTH - BASE_SIZE) / 3,
    WHITE_BEVEL,
    BLACK_BEVEL,
    TONIC_RADIUS: 4,
    WHITE_INFO_OFFSET: WHITE_NAME_HEIGHT
      ? Math.min((WHITE_HEIGHT - BLACK_HEIGHT - WHITE_NAME_HEIGHT) / 2 + WHITE_NAME_HEIGHT, 32)
      : 8,
    WHITE_NAME_OFFSET: 2,
    BLACK_INFO_OFFSET: BLACK_NAME_HEIGHT
      ? Math.min((BLACK_HEIGHT - BLACK_NAME_HEIGHT) / 2 + BLACK_NAME_HEIGHT, 32)
      : 10 + RADIUS / 4,
    BLACK_NAME_OFFSET: 4 + RADIUS / 4,
  };
}

export const getChromaNoteOffset = (chroma?: number) => {
  // black notes
  if (chroma === 1) return -0.5;
  if (chroma === 3) return 0.5;
  if (chroma === 6) return -1;
  if (chroma === 10) return 1;

  // white notes
  if (chroma === 0 || chroma === 5) return -1;
  if (chroma === 7) return -0.25;
  if (chroma === 9) return 0.25;
  if (chroma === 4 || chroma === 11) return 1;
  return 0;
};
