import { Kafka } from "kafkajs";

/**
 * Get the connection object to the broker.
 *
 * @returns a Kafka object so a producer/subscriber can connect to the broker
 */
export const getConnectionInfo = () => {
  const kafkaUri = process.env.BROKER_URI;

  const kafka = new Kafka({
    clientId: process.env.APP_ID,
    brokers: [kafkaUri],
  });
  return kafka;
};
