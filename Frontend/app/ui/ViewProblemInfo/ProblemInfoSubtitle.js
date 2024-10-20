"use client";

import Link from "next/link";

import { ProblemStatus, problemStatusString } from "@/app/lib/problemStatus";

const ProblemInfoSubtitle = ({ submissionId, modelId, modelName, status }) => {
  // Define base values of classes
  const innerDivClass =
    "w-full md:max-w-[40%] flex flex-col gap-0 overflow-hidden rounded-md border border-solid border-surface dark:border-dark-surface";
  const titleClass =
    "px-4 py-2 text-center text-sm lg:text-base 2xl:text-lg bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary font-semibold";
  const valueClass =
    "px-4 py-2 text-center text-sm lg:text-base 2xl:text-lg bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface";
  return (
    <div className="w-full mt-2 xl:mt-3 flex items-start justify-around">
      <div className={innerDivClass}>
        <h4 className={titleClass}>Model</h4>
        <p className={valueClass}>
          {modelName} ({modelId})
        </p>
      </div>
      <div className={innerDivClass}>
        <h4 className={titleClass}>Status</h4>
        <p className={valueClass}>{problemStatusString(status)}</p>
        {status === ProblemStatus.EXECUTED ? (
          <Link
            href={`/submissions/results/${submissionId}`}
            className="w-full px-4 py-2 text-center text-sm lg:text-base 2xl:text-lg transition-colors duration-300
          bg-secondary dark:bg-dark-secondary hover:bg-secondary-hover dark:hover:bg-dark-secondary-hover font-semibold
          text-textPrimary dark:text-dark-textSecondary hover:text-textSecondary-hover dark:hover:text-dark-textSecondary-hover"
          >
            View Results
          </Link>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ProblemInfoSubtitle;
