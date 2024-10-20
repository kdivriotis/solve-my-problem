import { check as checkDb } from "../database/index.js";

/**
 * Get service's & child components health status
 *
 * @returns Health status, uptime and status of child components
 */
export const healthcheck = async (req, res) => {
  const dbConnected = await checkDb();

  const status = dbConnected ? "Healthy" : "Unhealthy";
  const dbStatus = dbConnected ? "Connected" : "Disconnected";

  let response = { status };
  if (req.user.isAdmin) {
    response = {
      status,
      uptime: Math.floor(process.uptime()),
      components: [{ name: "Mongo DB", status: dbStatus }],
    };
  }
  return res.status(200).json(response);
};
