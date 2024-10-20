/**
 * Enumeration describing the status of a problem submission
 */
export const ProblemStatus = {
  NOT_READY: 0, // No input data has been submitted yet
  READY: 1, // Problem is ready to be executed
  PENDING: 2, // Problem is waiting in queue to be executed
  RUNNING: 3, // Problem is currently being executed
  EXECUTED: 4, // Problem has been executed
};

/**
 * Transform a Problem's Status from int to String
 * @param {int} status The problem's status code (as integer)
 *
 * @returns {String} The given status code transformed to the corresponding
 */
export const problemStatusString = (status) => {
  switch (status) {
    case ProblemStatus.NOT_READY:
      return "Not Ready";
    case ProblemStatus.READY:
      return "Ready";
    case ProblemStatus.PENDING:
      return "Pending";
    case ProblemStatus.RUNNING:
      return "Running";
    case ProblemStatus.EXECUTED:
      return "Executed";
    default:
      return "Unknown";
  }
};
