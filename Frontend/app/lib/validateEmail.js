/**
 * Check if email has a valid form
 * @param {string} email The email to be tested
 * @param {number?} maxLength The maximum length for email input (not checked if ommited)
 * @returns {string | null} error message (string) in case of invalid email, otherwise null
 */
export const validateEmail = (email, maxLength = 0) => {
  if (!email || email.trim().length === 0)
    return "Email address cannot be empty";

  if (maxLength && email.length > maxLength)
    return `Email address cannot exceed ${maxLength} characters`;

  if (
    !email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  )
    return "Invalid email address";

  return null;
};
