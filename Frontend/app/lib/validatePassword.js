/**
 * Check if password matches the following criteria:
 * 1. No whitespaces
 * 2. Has to be between 8 and 16 characters length
 * 3. Has at least 1 character
 * 4. Has at least 1 digit
 * 5. Has at least 1 special character (symbol)
 *
 * @param {string} password The password to be tested
 * @param {object} skipChecks true/false for: { length: refers to 2, character: refers to 3, digit: refers to 4, symbol: refers to 5 }
 * @returns {string | null} error message (string) in case of invalid password, otherwise null
 */
export const validatePassword = (
  password,
  skipChecks = {
    length: false,
    character: false,
    digit: false,
    symbol: false,
  }
) => {
  const isWhitespace = /^(?=.*\s)/;
  if (isWhitespace.test(password)) return "Password cannot contain whitespaces";

  const isValidLength = /^.{8,16}$/;
  if (!skipChecks.length && !isValidLength.test(password))
    return "Password has to be between 8 and 16 characters.";

  const containsValidCharacters = /^[a-zA-Z0-9!@#$%^&*()_\-+=]+$/;
  if (!containsValidCharacters.test(password))
    return "Password can only contain latin characters, digits and the symbols !@#$%^&*()_-+=";

  const containsCharacter = /^(?=.*[A-Za-z])/;
  if (!skipChecks.character && !containsCharacter.test(password))
    return "Password has to contain at least one latin character.";

  const containsNumber = /^(?=.*[0-9])/;
  if (!skipChecks.digit && !containsNumber.test(password))
    return "Password has to contain at least one latin digit.";

  const containsSymbol = /^(?=.*[!@#$%^&*()_\-+=])/;
  if (!skipChecks.symbol && !containsSymbol.test(password))
    return "Password has to contain at least one of the following symbols !@#$%^&*()_-+=";

  return null;
};
