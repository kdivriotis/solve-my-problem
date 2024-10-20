const { getConnectionInfo } = require("./connectionInfo");

/**
 * Check connection status to Kafka broker.
 *
 * @return {Promise<boolean>} true if connection is ok, otherwise false
 */
exports.check = async () => {
  const kafka = getConnectionInfo();
  const admin = kafka.admin();

  try {
    await admin.connect();
    const topics = await admin.listTopics();
    await admin.disconnect();
    return true;
  } catch (error) {
    console.error("Error Kafka connection status:", error);
    return false;
  }
};
