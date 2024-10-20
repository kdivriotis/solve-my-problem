/**
 * Check if date field has a valid form
 * @param {string} date The date to be tested
 * @returns {string | null}, depending on verification success (if not null, value contains the failure message)
 */
export const validateDate = (date) => {
  if (!date || date.trim().length === 0) return "cannot be empty";

  if (isNaN(Date.parse(date))) return "is not in valid form";

  return null;
};
