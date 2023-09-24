type ObjectType = Record<string, unknown>;

/**
 * Returns true if argument is an instance of Object
 *
 * @param obj - the object to test
 * @returns {boolean}
 */
export const isObject = (obj: unknown): obj is ObjectType =>
  !!obj && typeof obj === 'object' && obj.constructor === Object;

/**
 * Creates a deep copy of a value.
 *
 * @param obj - the value to clone (possibly an object)
 * @returns copy of the passed value
 */
export const deepClone = (obj: unknown) => {
  let cloneObj;
  try {
    cloneObj = JSON.parse(JSON.stringify(obj));
  } catch (err) {
    cloneObj = isObject(obj) ? { ...obj } : cloneObj;
  }
  return cloneObj;
};

/**
 * Merges into a target object values from a source object.
 * It does not mutate the target object (target is deep cloned before merging source values).
 *
 * @param target - the target object (e.g. the default values)
 * @param source - the source object (e.g. the overrides / additional values)
 * @param isMergingArrays - if true, arrays are merged by overriding values by their index, otherwise values are concatenated.
 * @todo add different strategies for arrays, a function ?
 *
 * @returns merged object
 */
export function mergeDeep<T extends ObjectType, S extends ObjectType>(
  target: T,
  source: S,
  isMergingArrays = false
): T | S {
  const t = deepClone(target);

  if (!isObject(target) || !isObject(source)) return source;

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue))
      if (isMergingArrays) {
        t[key] = targetValue.map((x, i) =>
          sourceValue.length <= i ? x : mergeDeep(x, sourceValue[i], isMergingArrays)
        );
        if (sourceValue.length > targetValue.length)
          t[key] = t[key].concat(sourceValue.slice(targetValue.length));
      } else {
        // t[key] = targetValue.concat(sourceValue);
        t[key] = sourceValue;
      }
    else if (isObject(targetValue) && isObject(sourceValue))
      t[key] = mergeDeep({ ...targetValue }, sourceValue, isMergingArrays);
    else t[key] = sourceValue;
  });

  return t;
}
