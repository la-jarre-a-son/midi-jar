// eslint-disable-next-line import/prefer-default-export
export const range = (min: number, max: number) =>
  Array(max - min + 1)
    .fill(null)
    .map((_v, n) => n + min);
