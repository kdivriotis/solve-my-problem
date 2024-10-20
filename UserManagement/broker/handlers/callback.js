const blockUserHandler = require('./blockUserHandler');

/**
 * Callback function for messages received from the broker.
 * @param {string} topic The topic where the message was received
 * @param {object} message The received message object
 */
//export const callback = async (topic, message) => {
const callback = (topic, message) => {
  switch (topic) {
    case "block-user":
      blockUserHandler(message);
      break;
    default:
      console.log(topic, message);
  }
};

module.exports = callback;
