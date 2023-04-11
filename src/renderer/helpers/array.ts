/**
 * Returns an array with a range of elements from min to max (included),
 * each elements is an incrementing number in the range.
 *
 * @param min - the minimum
 * @param max - the max (included)
 * @returns {number[]}
 */
export const range = (min: number, max: number) =>
  Array(max - min + 1)
    .fill(null)
    .map((_v, n) => n + min);

/**
 * Returns a random element in array.
 *
 * @param arr - the array to pick from
 * @returns {any}
 */
export const randomPick = <T>(arr: T[]): T =>
  // eslint-disable-next-line no-bitwise
  arr[(Math.random() * arr.length) >> 0];

/**
 * Returns the levenshtein distance between 2 arrays.
 *
 * @link https://gist.github.com/vincentorback/512411439a35aa2d0205aa0fb41633ea
 * @param s - the first array
 * @param t - the second array
 * @returns {number}
 */
export const levenshtein = <T>(s: T[], t: T[]) => {
  const d = [] as number[][]; // 2d matrix

  // Step 1
  const n = s.length;
  const m = t.length;

  if (n === 0) return m;
  if (m === 0) return n;

  // Create an array of arrays in javascript (a descending loop is quicker)
  for (let i = n; i >= 0; i -= 1) d[i] = [];

  // Step 2
  for (let i = n; i >= 0; i -= 1) d[i][0] = i;
  for (let j = m; j >= 0; j -= 1) d[0][j] = j;

  // Step 3
  for (let i = 1; i <= n; i += 1) {
    const sI = s[i - 1];

    // Step 4
    for (let j = 1; j <= m; j += 1) {
      // Check the jagged ld total so far
      if (i === j && d[i][j] > 4) return n;

      const tJ = t[j - 1];
      const cost = sI === tJ ? 0 : 1; // Step 5

      // Calculate the minimum
      let mi = d[i - 1][j] + 1;
      const b = d[i][j - 1] + 1;
      const c = d[i - 1][j - 1] + cost;

      if (b < mi) mi = b;
      if (c < mi) mi = c;

      d[i][j] = mi; // Step 6

      // Damerau transposition
      if (i > 1 && j > 1 && sI === t[j - 2] && s[i - 2] === tJ) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost);
      }
    }
  }

  // Step 7
  return d[n][m];
};
