"use client";

import { useMemo } from "react";

import useHttp from "@/app/hooks/use-http";

import DisplayResult from "./DisplayResult";
import DisplayResultLP from "./DisplayResultLP";
import DisplayResultVRP from "./DisplayResultVRP";

const ProblemResultData = ({
  submissionId,
  modelId,
  dataJson,
  cost,
  isAvailable,
  onRefresh,
}) => {
  const { isLoading, error, sendRequest } = useHttp();

  const data = useMemo(() => {
    try {
      return JSON.parse(dataJson);
    } catch (e) {
      return null;
    }
  }, [dataJson]);

  /**
   * Programmatically create a downloadable JSON file from the
   * given result data
   */
  const downloadJson = () => {
    if (!data) return;

    // Create a Blob from the JSON string
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a link element
    const link = document.createElement("a");

    // Set the download attribute with a filename
    link.download = `result-${submissionId}.json`;

    // Create a URL for the Blob and set it as the href attribute
    link.href = URL.createObjectURL(blob);

    // Append the link to the body (necessary for Firefox)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up by removing the link from the document
    document.body.removeChild(link);
  };

  // Unlock Submission Results
  const unlockSubmissionResults = () => {
    // send PUT request to API's route /api/submissions/run/delayedpayment/:problemId
    const url = `/api/submissions/run/delayedpayment/${submissionId}`;
    sendRequest(
      {
        url,
        method: "PUT",
      },
      onRefresh
    );
  };

  return (
    <div className="w-full my-2 xl:my-3">
      <h3 className="text-center text-base md:text-lg xl:text-xl 2xl:text-2xl font-bold text-textBackground dark:text-dark-textBackground">
        Result Data
      </h3>
      {isAvailable && data !== null ? (
        <>
          <div className="w-fit max-w-full mt-1 xl:mt-2 mx-auto">
            {modelId === "LP" &&
            data.objective &&
            data.objective !==
              "No solution found for the provided parameters" ? (
              <DisplayResultLP result={data} />
            ) : modelId === "VRP" &&
              data.objective &&
              data.objective !==
                "No solution found for the provided parameters" ? (
              <DisplayResultVRP result={data} />
            ) : (
              <DisplayResult name={null} value={data} />
            )}
          </div>
          <div className="w-full my-2 flex justify-center">
            <button
              className="w-fit px-4 py-2 text-base lg:text-lg rounded-md transition-colors duration-300
          bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover
        text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover font-semibold"
              onClick={downloadJson}
            >
              Download Result File
            </button>
          </div>
        </>
      ) : isAvailable && data == null ? (
        <>
          <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-error dark:text-dark-error">
            No data was found in the result
          </p>
        </>
      ) : (
        <>
          <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-textBackground dark:text-dark-textBackground">
            The results for this submission have been locked.
          </p>
          <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-textBackground dark:text-dark-textBackground">
            Make sure you have at least{" "}
            <span className="text-primary dark:text-dark-primary font-semibold">
              {cost}
            </span>{" "}
            credits in your account and click on the button below
          </p>
          {error && error.toString().trim() !== "" ? (
            <p className="mt-3 mb-1 text-sm md:text-base xl:text-lg font-normal text-center text-error dark:text-dark-error">
              {error}
            </p>
          ) : (
            <></>
          )}
          <div className="w-full my-2 flex justify-center">
            <button
              className="w-fit px-4 py-2 text-base lg:text-lg rounded-md transition-colors duration-300
          bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover
        text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover font-semibold"
              onClick={unlockSubmissionResults}
              disabled={isLoading}
            >
              Unlock Results
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProblemResultData;
