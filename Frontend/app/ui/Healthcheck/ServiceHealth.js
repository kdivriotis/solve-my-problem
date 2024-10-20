"use client";

import { useState, useEffect, useMemo } from "react";

import { HiRefresh } from "react-icons/hi";

import useHttp from "@/app/hooks/use-http";

const ServiceHealth = ({ name, url: serviceUrl, onStatusChange }) => {
  const { isLoading, error, sendRequest } = useHttp();
  const [serviceInfo, setServiceInfo] = useState({
    status: "Unhealthy",
    uptime: 0,
    components: [],
  });

  // Check status health and update parent (via onStatusChange callback function)
  const isHealthy = useMemo(() => {
    if (!serviceInfo) return false;
    if (error && error.toString().trim() !== "") return false;
    return serviceInfo.status.toLowerCase() === "healthy";
  }, [serviceInfo, error]);

  useEffect(() => onStatusChange(name, isHealthy), [isHealthy]);

  // Translate total uptime from seconds to days, hours, minutes, seconds
  const uptimeStr = useMemo(() => {
    if (!serviceInfo.uptime) return "0 sec";
    const uptime = serviceInfo.uptime;
    let str = "";
    const days = Math.floor(uptime / 86400);
    if (days > 0) str += `${days} day${days > 1 ? "s" : ""} `;
    const hours = Math.floor((uptime % 86400) / 3600);
    if (hours > 0) str += `${hours} hr${hours > 1 ? "s" : ""} `;
    const minutes = Math.floor((uptime % 3600) / 60);
    if (minutes > 0) str += `${minutes} min${minutes > 1 ? "s" : ""} `;
    const seconds = uptime % 60;
    str += `${seconds} sec${seconds > 1 ? "s" : ""}`;
    return str;
  }, [serviceInfo]);

  /**
   * Get the service's health status, by sending request
   */
  const getServiceHealth = () => {
    // send GET request to API's route /{serviceUrl}/healthcheck
    const url = `${serviceUrl}/healthcheck`;
    sendRequest(
      {
        url,
        method: "GET",
      },
      (response) => setServiceInfo({ ...response })
    );
  };

  useEffect(getServiceHealth, []);

  return (
    <div
      className={`w-full col-span-1 flex flex-col items-center p-2 md:p-3 xl:p-4 rounded-md border border-solid ${
        isLoading
          ? "border-disabled dark:border-dark-disabled"
          : (error && error.toString().trim() !== "") || !isHealthy
          ? "border-error dark:border-dark-error"
          : "border-success dark:border-dark-success"
      }
    bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface`}
    >
      <h3 className="text-sm md:text-base xl:text-lg font-semibold text-primary dark:text-dark-primary">
        {name}
      </h3>
      {isLoading ? (
        <div className="w-1/2 mt-1 xl:mt-2 animate-pulse rounded">
          <div className="w-full h-[5px] md:h-[6px] xl:h-[7px] bg-textSurface dark:bg-dark-textSurface rounded"></div>
        </div>
      ) : error && error.toString().trim() !== "" ? (
        <p className="mt-1 xl:mt-2 text-xs md:text-sm xl:text-base font-normal text-error dark:text-dark-error">
          {error}
        </p>
      ) : (
        <>
          <p
            className={`mt-1 xl:mt-2 text-xs md:text-sm xl:text-base font-normal ${
              isHealthy
                ? "text-success dark:text-dark-success"
                : "text-error dark:text-dark-error"
            }`}
          >
            {serviceInfo.status}
          </p>
          <p className="mt-1 xl:mt-2 text-xs md:text-sm xl:text-base font-normal">
            <span className="text-primary dark:text-dark-primary">Uptime:</span>{" "}
            <span className="font-semibold">{uptimeStr}</span>
          </p>

          {/* Components' status */}
          <div className="mt-2 xl:mt-3 flex-grow flex flex-col items-center justify-center gap-1 xl:gap-2">
            {serviceInfo.components.map((component) => (
              <p className="text-xs xl:text-sm font-normal">
                <span className="text-primary dark:text-dark-primary">
                  {component.name}:
                </span>{" "}
                <span className="font-semibold">{component.status}</span>
              </p>
            ))}
          </div>
          <button
            className="mt-1 xl:mt-2 justify-self-end flex items-center gap-1 xl:gap-2 py-1 px-2 md:py-2 md:px-4 text-xs md:text-sm xl:text-base
            rounded transition-colors duration-300 font-bold focus:outline-none focus:shadow-outline cursor-pointer disabled:cursor-not-allowed
            bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover 
            text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover 
            fill-textPrimary dark:fill-dark-textPrimary hover:fill-textPrimary-hover dark:hover:fill-dark-textPrimary-hover 
            disabled:bg-disabled dark:disabled:bg-dark-disabled disabled:text-textDisabled dark:disabled:text-dark-textDisabled
            disabled:fill-textDisabled dark:disabled:fill-dark-textDisabled"
            disabled={isLoading}
            onClick={getServiceHealth}
          >
            <HiRefresh />
            <span>Refresh</span>
          </button>
        </>
      )}
    </div>
  );
};

export default ServiceHealth;
