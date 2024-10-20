const { check: checkDb } = require("../../config/check");
const { check: checkBroker } = require("../../broker/index");

/**
 * Get service's & child components health status
 *
 * @returns Health status, uptime and status of child components
 */
exports.healthcheck = async (req, res) => {
  const [dbConnected, brokerConnected] = await Promise.all([
    checkDb,
    checkBroker,
  ]);

  console.log({ dbConnected, brokerConnected });

  const status = dbConnected && brokerConnected ? "Healthy" : "Unhealthy";
  const dbStatus = dbConnected ? "Connected" : "Disconnected";
  const brokerStatus = brokerConnected ? "Connected" : "Disconnected";

  let response = { status };
  if (req.user.isAdmin) {
    response = {
      status,
      uptime: Math.floor(process.uptime()),
      components: [
        { name: "Mongo DB", status: dbStatus },
        { name: "Kafka", status: brokerStatus },
      ],
    };
  }
  return res.status(200).json(response);
};
