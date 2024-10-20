"use client";

import { useMemo } from "react";

const ProblemResultSubtitle = ({ executionTime, cost, model }) => {
  // Translate total execution time from seconds to hours, minutes, seconds
  const { hours, minutes, seconds } = useMemo(() => {
    if (!executionTime) return { hours: 0, minutes: 0, seconds: 0 };
    const hours = Math.floor(executionTime / 3600);
    const minutes = Math.floor((executionTime % 3600) / 60);
    const seconds = executionTime % 60;
    return { hours, minutes, seconds };
  }, [executionTime]);

  // Define values of classes
  const titleClass =
    "text-center text-sm lg:text-base 2xl:text-lg text-textBackground dark:text-dark-textBackground";
  const valueClass = "text-primary dark:text-dark-primary font-semibold";
  const costClass =
    "text-center text-xs md:text-sm xl:text-base text-textBackground dark:text-dark-textBackground";

  return (
    <div className="w-full my-2 xl:my-3 flex flex-col items-center">
      <h4 className={titleClass}>
        Executed in{" "}
        {hours > 0 ? (
          <span className={valueClass}>{hours} hours, </span>
        ) : (
          <></>
        )}
        {minutes > 0 ? (
          <span className={valueClass}>{minutes} minutes &amp; </span>
        ) : (
          <></>
        )}
        <span className={valueClass}>{seconds.toFixed(3)} seconds </span>
        using model{" "}
        <span className={valueClass}>
          {model.name} ({model.id})
        </span>
      </h4>
      <p className={`my-2 ${costClass}`}>
        Total cost for execution:{" "}
        <span className={valueClass}>{cost} credits</span>
      </p>
    </div>
  );
};

export default ProblemResultSubtitle;
