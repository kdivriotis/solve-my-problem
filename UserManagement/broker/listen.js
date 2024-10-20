const { getConnectionInfo } = require('./connectionInfo');
const callback = require('./handlers/callback');

/**
 * Listen to messages on given topics.
 *
 * @param {string[]} topics The array of topic names to listen to for messages
 *
 * @return {Promise<boolean>} true if the message was sent, otherwise false
 */
//export const listen = async (topics) => {
const listen = async (topics) => {
  // Create a new message consumer
  const kafka = getConnectionInfo();
  console.log(process.env.APP_ID);
  const consumer = kafka.consumer({ groupId: process.env.APP_ID });

  try {
    // Connect to the broker and subscribe to topics
    await consumer.connect();
    for (let topic of topics) {
      await consumer.subscribe({ topic });
    }

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const messageValue = JSON.parse(message.value.toString());
        callback(topic, messageValue);
      },
    });
    console.log(`Listening to messages on topics: ${topics.join(", ")}`);
  } catch (e) {
    console.log(`Error occured: ${e}`);
    // Try to restart the consumer
    await listen(topics);
  }
};

module.exports = { listen };