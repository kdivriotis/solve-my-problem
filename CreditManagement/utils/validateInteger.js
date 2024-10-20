/**
 * Check if number string has a valid form
 * @param {string} text The number string to be tested
 * @param {number?} min Minimum allowed number (not checked if ommited)
 * @param {number?} max Maximum allowed number (not checked if ommited)
 * @returns error message (string) in case of invalid string, otherwise null
 */
export const validateInteger = (text, min = null, max = null) => {
  if (!text) return "cannot be empty";
  const number = parseInt(text);
  if (isNaN(number)) return "has to be a valid integer";
  if (min !== null && number < min) return `has to be greater than ${min}`;
  if (max !== null && number > max) return `has to be less than ${max}`;

  return null;
};
