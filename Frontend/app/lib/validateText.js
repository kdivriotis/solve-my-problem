/**
 * Check if text field has a valid form
 * @param {string} text The text to be tested
 * @param {number?} maxLength The maximum length for text input
 * @returns {string | null} error message (string) in case of invalid string, otherwise null
 */
export const validateText = (text, maxLength = 0) => {
  if (!text || text.trim().length === 0) return "cannot be empty";

  if (maxLength && text.trim().length > maxLength)
    return `cannot exceed ${maxLength} characters`;

  return null;
};
