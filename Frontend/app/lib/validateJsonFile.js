/**
 * Check if a JSON file contains all required fields
 * @param {string} file The JSON file to be checked
 * @param {array<string>?} fields The required fields that this file needs to contain
 * @returns {string | Object} error message (string) in case of invalid file, otherwise the parsed JSON object
 */
export const validateJsonFile = async (file, fields = []) => {
  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = () => {
        reject("File reading has failed");
      };
      reader.readAsText(file);
    });
  };

  try {
    const fileContents = await readFile(file);
    const json = JSON.parse(fileContents);
    const missingFields = fields.filter((field) => !(field in json));
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }
    return json;
  } catch (e) {
    return e.message || "Invalid JSON file";
  }
};
