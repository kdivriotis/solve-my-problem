import { updateUser } from "./updateUser.js";
import { deleteUser } from "./deleteUser.js";

/**
 * Callback function for messages received from the broker.
 * @param {string} topic The topic where the message was received
 * @param {object} message The received message object
 */
export const callback = async (topic, message) => {
  switch (topic) {
    case "credits-changed":
    case "user-created":
      updateUser(message.id, message.name, message.credits);
      break;
    case "user-deleted":
      deleteUser(message.id);
      break;
    default:
      console.log(topic, message);
  }
};
