"use client";

import { useMemo } from "react";

import DisplayInput from "./DisplayInput";

const ProblemInputData = ({ submissionId, date, dataJson, error }) => {
  if (!dataJson) return <></>;

  const data = useMemo(() => {
    try {
      return JSON.parse(dataJson);
    } catch (e) {
      return null;
    }
  }, [dataJson]);
  if (!data) return <></>;

  /**
   * Programmatically create a downloadable JSON file from the
   * given input data
   */
  const downloadJson = () => {
    if (!data) return;

    // Create a Blob from the JSON string
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });

    // Create a link element
    const link = document.createElement("a");

    // Set the download attribute with a filename
    link.download = `input-${submissionId}.json`;

    // Create a URL for the Blob and set it as the href attribute
    link.href = URL.createObjectURL(blob);

    // Append the link to the body (necessary for Firefox)
    document.body.appendChild(link);

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up by removing the link from the document
    document.body.removeChild(link);
  };

  return (
    <div className="w-full my-2 xl:my-3">
      <h3 className="text-center text-base md:text-lg xl:text-xl 2xl:text-2xl font-bold text-textBackground dark:text-dark-textBackground">
        Input Data
      </h3>
      {/* Submission Date & Error Message */}
      <small className="text-center mt-1 text-xs md:text-sm xl:text-base italic text-textBackground dark:text-dark-textBackground">
        Submitted on {new Date(date).toLocaleDateString()}{" "}
        {new Date(date).toLocaleTimeString()}
      </small>
      {error && error.trim() !== "" ? (
        <p className="text-center my-2 text-sm md:text-base xl:text-lg font-normal text-error dark:text-dark-error">
          {error}
        </p>
      ) : (
        <></>
      )}
      <div className="w-fit max-w-full mt-1 xl:mt-2 mx-auto">
        <DisplayInput name={null} value={data} />
      </div>
      <div className="w-full mt-1 xl:mt-2 flex justify-center">
        <button
          className="w-fit px-4 py-2 text-base lg:text-lg rounded-md transition-colors duration-300
          bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover
        text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover font-semibold"
          onClick={downloadJson}
        >
          Download Input File
        </button>
      </div>
    </div>
  );
};

export default ProblemInputData;
