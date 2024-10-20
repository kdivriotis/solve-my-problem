"use client";

import { useState } from "react";

import HealthcheckDashboard from "./HealthcheckDashboard";
import ServiceHealth from "./ServiceHealth";

const HealthcheckPage = () => {
  // List of all available services
  const availableServices = [
    { name: "Frontend", url: "/api" },
    { name: "User Management", url: "/api/user" },
    { name: "Credit Management", url: "/api/credits" },
    { name: "Transaction Management", url: "/api/transactions" },
    { name: "Model Management", url: "/api/models" },
    { name: "Display Problems", url: "/api/submissions/display" },
    { name: "Create Problem", url: "/api/submissions/create" },
    { name: "Run Problem", url: "/api/submissions/run" },
    { name: "Solvers", url: "/api/solvers" },
  ];
  const [services, setServices] = useState(
    availableServices.map((s) => {
      return { ...s, isHealthy: false };
    })
  );

  /**
   * Change the status of a service
   *
   * @param {string} name the name of the service
   * @param {boolean} isHealthy updated health status of the service - true means healthy
   */
  const handleServiceHealthChange = (name, isHealthy) => {
    setServices((prevStatus) => {
      const serviceIndex = prevStatus.findIndex((s) => s.name === name);
      if (serviceIndex < 0) return prevStatus;

      const newStatus = prevStatus.slice();
      newStatus[serviceIndex].isHealthy = isHealthy;
      return newStatus;
    });
  };

  return (
    <section className="px-2 lg:px-3 xl:px-4 py-4 w-full h-full flex flex-col items-center my-auto min-h-fit">
      <h1 className="mb-4 text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-textBackground dark:text-dark-textBackground">
        Application Health
      </h1>
      <HealthcheckDashboard
        isLoading={false}
        error={null}
        services={services}
      />
      <div className="w-full my-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-3 lg:gap-4 3xl:gap-5">
        {services.map((s) => (
          <ServiceHealth
            key={s.name}
            name={s.name}
            url={s.url}
            onStatusChange={handleServiceHealthChange}
          />
        ))}
      </div>
    </section>
  );
};

export default HealthcheckPage;
