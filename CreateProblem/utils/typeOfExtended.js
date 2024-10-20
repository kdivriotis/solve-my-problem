/**
 * Extension of the built-in function 'typeof', since the same result 'object'
 * for arrays, dates, null and objects.
 * @param {any} value a JavaScript value of any type (primitive or not)
 * @returns the actual type of the value (undefined, boolean, number, bigint, string, symbol, function, null, array, date, object)
 */
export const typeOfExtended = (value) => {
  const type = typeof value;
  if (type !== "object") return type;
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (value instanceof Date) return "date";
  return "object";
};
