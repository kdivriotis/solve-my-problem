const { getConnectionInfo } = require("./connectionInfo.js");

/**
 * Produce & Send a new message to the broker.
 *
 * @param {string} topic The topic name where the message should be sent
 * @param {any} message Any JavaScript object, array etc. that will be sent to the broker (will be turned to JSON before sending)
 *
 * @return {Promise<boolean>} true if the message was sent, otherwise false
 */
exports.sendMessage = async (topic, message) => {
  // Create a new message producer
  const kafka = getConnectionInfo();
  const producer = kafka.producer();

  try {
    // Connect to the broker and send message
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    await producer.disconnect();
    return true;
  } catch (e) {
    console.log(`Error occured: ${e}`);
    return false;
  }
};
