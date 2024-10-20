"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";

import { validateJsonFile } from "@/app/lib/validateJsonFile";
import useHttp from "@/app/hooks/use-http";

import StepDisplay from "./StepDisplay";
import SelectModelForm from "./SelectModelForm";
import SubmissionNameForm from "./SubmissionNameForm";
import MetadataFileForm from "./MetadataFileForm";
import InputDataFileForm from "./InputDataFileForm";
import ReviewSubmissionForm from "./ReviewSubmissionForm";

const MultiStepForm = () => {
  const steps = [1, 2, 3, 4, 5];
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { isLoading, error, sendRequest } = useHttp();

  // Form inputs
  const [selectedModelIndex, setSelectedModelIndex] = useState(-1);
  const [selectedModel, setSelectedModel] = useState({ _id: null });

  const [submissionName, setSubmissionName] = useState("");

  const [selectedModelInfo, setSelectedModelInfo] = useState(null);

  const requiredMetadata = useMemo(() => {
    if (!selectedModelInfo || !selectedModelInfo.metadata) return [];
    return selectedModelInfo.metadata.map((m) => m.name);
  }, [selectedModelInfo]);

  const requiredInputData = useMemo(() => {
    if (!selectedModelInfo || !selectedModelInfo.inputData) return [];
    return selectedModelInfo.inputData.map((i) => i.name);
  }, [selectedModelInfo]);

  const [metadataFile, setMetadataFile] = useState(null);
  const [isCheckingMetadata, setIsCheckingMetadata] = useState(false);
  const [parsedMetadata, setParsedMetadata] = useState(null);

  const [inputDataFile, setInputDataFile] = useState(null);
  const [isCheckingInputData, setIsCheckingInputData] = useState(false);

  const [formError, setFormError] = useState(null);

  // Manage steps
  const nextStep = () => {
    setStep((currStep) => (currStep < steps.length ? currStep + 1 : currStep));
  };
  const prevStep = () => {
    setStep((currStep) => (currStep > 1 ? currStep - 1 : currStep));
  };
  const goToStep = (newStep) => {
    if (newStep >= step) return;
    setStep(newStep);
  };
  useEffect(() => {
    if (step < 1 || step > steps.length) setStep(1);
    setFormError(null);
  }, [step]);

  // Select model
  const handleModelSelection = () => {
    if (
      !selectedModel ||
      !selectedModel._id ||
      selectedModel._id.trim() === ""
    ) {
      setFormError("Select one of the available models to continue");
      return;
    }
    nextStep();
  };

  // Submission name
  const handleSubmissionName = () => {
    if (!submissionName || submissionName.trim() === "") {
      setFormError("Submission's name cannot be empty");
      return;
    }
    nextStep();
  };

  // Metadata file
  const handleMetadataFile = async () => {
    if (!metadataFile && requiredMetadata.length > 0) {
      setFormError("Metadata file cannot be empty");
      return;
    }
    setIsCheckingMetadata(true);
    const result = await validateJsonFile(metadataFile, requiredMetadata);
    setIsCheckingMetadata(false);
    if (typeof result === "string") {
      setFormError(result);
      setParsedMetadata(null);
      return;
    }
    setParsedMetadata(result);
    nextStep();
  };

  // Input data file
  const handleInputDataFile = async () => {
    if (!inputDataFile && requiredInputData.length > 0) {
      setFormError("Input data file cannot be empty");
      return;
    }
    setIsCheckingInputData(true);
    const result = await validateJsonFile(inputDataFile, requiredInputData);
    setIsCheckingInputData(false);
    if (typeof result === "string") {
      setFormError(result);
      return;
    }
    nextStep();
  };

  // Create Submission
  const handleCreateSubmission = () => {
    if (
      !selectedModel ||
      !selectedModel._id ||
      selectedModel._id.trim() === ""
    ) {
      setStep(1);
      setFormError("Select one of the available models to continue");
      return;
    }
    if (!submissionName || submissionName.trim() === "") {
      setStep(2);
      setFormError("Submission's name cannot be empty");
      return;
    }
    if (!metadataFile && requiredMetadata.length > 0) {
      setStep(3);
      setFormError("Metadata file cannot be empty");
      return;
    }
    if (!inputDataFile && requiredInputData.length > 0) {
      setStep(4);
      setFormError("Input data file cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("inputData", inputDataFile);
    formData.append("modelId", selectedModel._id);
    formData.append("name", submissionName);
    formData.append("metadata", JSON.stringify(parsedMetadata));

    // send POST request to API's route /api/submissions/create/add/
    const url = "/api/submissions/create/add/";
    sendRequest(
      {
        url,
        method: "POST",
        data: formData,
      },
      ({ problemId }) => router.push(`/submissions/info/${problemId}`)
    );
  };

  // Handle submit based on step
  const submitHandler = async (event) => {
    event.preventDefault();

    switch (step) {
      case 1:
        handleModelSelection();
        break;
      case 2:
        handleSubmissionName();
        break;
      case 3:
        await handleMetadataFile();
        break;
      case 4:
        await handleInputDataFile();
        break;
      case 5:
        handleCreateSubmission();
        break;
      default:
        return;
    }
  };

  let content = (
    <SelectModelForm
      selected={selectedModelIndex}
      onSelect={setSelectedModelIndex}
      setModel={setSelectedModel}
      formError={formError}
    />
  );
  if (step === 2) {
    content = (
      <SubmissionNameForm
        selectedModel={selectedModel}
        name={submissionName}
        onNameChange={setSubmissionName}
        formError={formError}
      />
    );
  } else if (step === 3) {
    content = (
      <MetadataFileForm
        selectedModel={selectedModel}
        name={submissionName}
        onFileChange={setMetadataFile}
        setModelInfo={setSelectedModelInfo}
        metadata={selectedModelInfo ? selectedModelInfo.metadata : null}
        isValidationActive={isCheckingMetadata}
        formError={formError}
      />
    );
  } else if (step === 4) {
    content = (
      <InputDataFileForm
        selectedModel={selectedModel}
        name={submissionName}
        metadata={parsedMetadata}
        onFileChange={setInputDataFile}
        inputData={selectedModelInfo ? selectedModelInfo.inputData : null}
        isValidationActive={isCheckingInputData}
        formError={formError}
      />
    );
  } else if (step === 5) {
    content = (
      <ReviewSubmissionForm
        selectedModel={selectedModel}
        name={submissionName}
        metadata={parsedMetadata}
        inputData={inputDataFile.name}
        formError={error}
      />
    );
  }

  // Define base values of classes
  const formButtonBaseClass = `py-1 px-2 md:py-2 md:px-4 rounded transition-colors duration-300 font-bold text-sm lg:text-base
            focus:outline-none focus:shadow-outline cursor-pointer disabled:cursor-not-allowed
            disabled:bg-disabled dark:disabled:bg-dark-disabled disabled:text-textDisabled dark:disabled:text-dark-textDisabled`;
  const formBackButtonClass = `bg-secondary dark:bg-dark-secondary hover:bg-secondary-hover dark:hover:bg-dark-secondary-hover 
            text-textSecondary dark:text-dark-textSecondary hover:text-textSecondary-hover dark:hover:text-dark-textSecondary-hover`;
  const formSubmitButtonClass = `bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover 
            text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover`;

  return (
    <div className="w-full flex flex-col gap-3 justify-center max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
      <form
        className="w-full rounded-lg overflow-hidden bg-surface dark:bg-dark-surface p-4"
        onSubmit={submitHandler}
      >
        <StepDisplay
          steps={steps}
          currentStep={step}
          onStepSelection={goToStep}
        />
        {content}
        <div className="flex items-center justify-center gap-10 mt-4">
          {step > 1 ? (
            <button
              type="button"
              className={`${formButtonBaseClass} ${formBackButtonClass}`}
              onClick={prevStep}
              disabled={isCheckingMetadata || isLoading}
            >
              Back
            </button>
          ) : (
            <Link
              href="/submissions"
              className={`${formButtonBaseClass} ${formBackButtonClass}`}
              prefetch={false}
            >
              Cancel
            </Link>
          )}
          <button
            type="submit"
            className={`${formButtonBaseClass} ${formSubmitButtonClass}`}
            disabled={isCheckingMetadata || isLoading}
          >
            {step < steps.length ? "Continue" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
