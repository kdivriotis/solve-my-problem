"use client";

import { useMemo } from "react";

import { IoIosSend } from "react-icons/io";
import { FaCheck } from "react-icons/fa";

import { ProblemStatus } from "@/app/lib/problemStatus";

const SubmissionsDashboard = ({ isLoading, error, submissions, allProblems }) => {

  const submissionsCount = useMemo(() => allProblems.length, [allProblems]);
  const executedSubmissionsCount = useMemo(
    () => allProblems.filter((s) => s.status === ProblemStatus.EXECUTED).length,
    [allProblems]
  );
  
  
  const cards = [
    {
      name: "Submitted",
      Icon: IoIosSend,
      value: submissionsCount,
      error,
      hasError: error && error.trim() !== "",
      isLoading,
    },
    {
      name: "Executed",
      Icon: FaCheck,
      value: executedSubmissionsCount,
      error,
      hasError: error && error.trim() !== "",
      isLoading,
    },
  ];

  return (
    <div className="w-full grid grid-cols-2 gap-2 md:gap-3 lg:gap-4 xl:gap-5">
      {cards.map((card) => (
        <div
          key={card.name}
          className="w-full px-1 py-2 sm:p-2 lg:p-3 flex flex-col md:flex-row gap-3 justify-start md:justify-center items-center 
          bg-surface dark:bg-dark-surface rounded-md
          shadow-md shadow-primary"
        >
          {/* Icon */}
          <div className="p-4 bg-surface-hover dark:bg-dark-surface-hover rounded-full">
            <card.Icon className="w-[32px] h-[32px] text-textSurface-hover dark:text-dark-textSurface-hover" />
          </div>

          {/* Info */}
          <div className="md:flex-grow flex flex-col gap-1 justify-center items-center md:items-start rounded-md">
            <span className="text-sm md:text-base xl:text-lg font-bold text-textSurface dark:text-dark-textSurface">
              {card.name}
            </span>
            {card.isLoading ? (
              <div className="w-4/5 md:w-1/3 lg:w-1/4 animate-pulse rounded">
                <div className="w-full h-[5px] md:h-[6px] xl:h-[7px] bg-textSurface dark:bg-dark-textSurface rounded"></div>
              </div>
            ) : card.hasError ? (
              <span className="text-xs md:text-sm xl:text-base font-normal text-error dark:text-dark-error">
                {card.error}
              </span>
            ) : (
              <span className="text-base md:text-lg xl:text-xl font-semibold text-textSurface-hover dark:text-dark-textSurface-hover">
                {card.value}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionsDashboard;
