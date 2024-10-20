"use client";

import { useState } from "react";

import useHttp from "@/app/hooks/use-http";

import { validateJsonFile } from "@/app/lib/validateJsonFile";

const ProblemInputForm = ({ submissionId, onRefresh }) => {
  const { isLoading, error, sendRequest } = useHttp();

  const [inputDataFile, setInputDataFile] = useState(null);
  const [isCheckingInputData, setIsCheckingInputData] = useState(false);
  const [formError, setFormError] = useState(null);

  // Create Submission
  const createSubmission = () => {
    if (!inputDataFile && requiredInputData.length > 0) {
      setFormError("Input data file cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("inputData", inputDataFile);

    // send POST request to API's route /api/submissions/create/upload-input/:id
    const url = `/api/submissions/create/upload-input/${submissionId}`;
    sendRequest(
      {
        url,
        method: "POST",
        data: formData,
      },
      onRefresh
    );
  };

  // Input data file checks
  const handleFileSubmit = async () => {
    if (!inputDataFile) {
      setFormError("Input data file cannot be empty");
      return;
    }
    setIsCheckingInputData(true);
    const result = await validateJsonFile(inputDataFile);
    setIsCheckingInputData(false);
    if (typeof result === "string") {
      setFormError(result);
      return;
    }
    createSubmission();
  };

  const handleFileSelection = (event) => {
    if (!event.target.files || event.target.files.length === 0) return;
    setFormError(null);
    setInputDataFile(event.target.files[0]);
  };

  const isFormValid = inputDataFile !== null && formError == null;
  return (
    <div className="my-4 w-full md:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%] mx-auto">
      <label
        className="block text-sm md:text-base text-textBackground dark:text-dark-textBackground font-bold mb-2"
        htmlFor="input-data"
      >
        Upload Input File
      </label>
      {error && error.toString().trim() && (
        <p className="text-center text-xs md:text-sm text-error dark:text-dark-error my-2">
          {error}
        </p>
      )}
      <div className="my-2 w-full flex flex-col md:flex-row items-center gap-2 lg:gap-3">
        <input
          id="input-data"
          className="w-full px-3 py-2 rounded-md text-sm md:text-base
                bg-surface-hover dark:bg-dark-surface-hover text-textSurface dark:text-dark-textSurface
                focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent"
          type="file"
          multiple={false}
          onChange={handleFileSelection}
          accept="application/json, .json"
          disabled={isCheckingInputData || isLoading}
          required
          aria-required
        />

        <button
          className="w-fit py-1 px-2 md:py-2 md:px-4 rounded transition-colors duration-300 font-semibold text-sm lg:text-base
            focus:outline-none focus:shadow-outline cursor-pointer disabled:cursor-not-allowed
            disabled:bg-disabled dark:disabled:bg-dark-disabled disabled:text-textDisabled dark:disabled:text-dark-textDisabled
            bg-secondary dark:bg-dark-secondary hover:bg-secondary-hover dark:hover:bg-dark-secondary-hover 
            text-textSecondary dark:text-dark-textSecondary hover:text-textSecondary-hover dark:hover:text-dark-textSecondary-hover"
          onClick={handleFileSubmit}
          disabled={isCheckingInputData || isLoading || !isFormValid}
        >
          Upload
        </button>
      </div>
      {formError && formError.toString().trim() && (
        <p className="text-center text-xs md:text-sm text-error dark:text-dark-error my-2">
          {formError}
        </p>
      )}
    </div>
  );
};

export default ProblemInputForm;
