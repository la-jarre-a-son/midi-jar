/**
 * Rotates a string by n (or -n) steps, e.g. 'ABCD' +2 => 'CDAB'
 * @param str - the string to rotate
 * @param shift - signed number of steps to rotate
 * @returns rotated string
 */
export function stringRotate(str: string, shift: number) {
  const n = shift % str.length;
  const part1 = str.slice(0, n);
  const part2 = str.slice(n);
  return `${part2}${part1}`;
}
