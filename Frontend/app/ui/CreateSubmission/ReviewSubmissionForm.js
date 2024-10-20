"use client";

import { useMemo } from "react";

const ReviewSubmissionForm = ({
  selectedModel,
  name,
  metadata,
  inputData,
  formError,
}) => {
  const metadataArray = useMemo(() => {
    if (!metadata) return [];
    return Object.entries(metadata).map(([key, value]) => {
      return { name: key, value: value };
    });
  }, metadata);

  return (
    <>
      <legend className="mt-2 text-lg md:text-xl lg:text-2xl text-center text-textSurface dark:text-dark-textSurface">
        Review your Submission
      </legend>
      {formError && formError.toString().trim() && (
        <p className="text-center text-xs md:text-sm text-error dark:text-dark-error my-2">
          {formError}
        </p>
      )}

      <div className="my-4 flex items-center justify-start">
        <p className="block text-sm md:text-base text-textSurface dark:text-dark-textSurface font-normal mb-2">
          Model:{" "}
          <strong className="font-bold">
            {selectedModel.name} ({selectedModel.id})
          </strong>
        </p>
      </div>

      <div className="my-4">
        <p className="block text-sm md:text-base text-textSurface dark:text-dark-textSurface font-normal mb-2">
          Name: <strong className="font-bold">{name}</strong>
        </p>
      </div>

      <div className="my-4">
        <p className="block text-sm md:text-base text-textSurface dark:text-dark-textSurface font-normal mb-2">
          Metadata:
        </p>
        <div className="my-2 pl-2">
          {metadataArray.map((m) => (
            <p className="block text-sm md:text-base text-textSurface dark:text-dark-textSurface font-normal mb-2">
              {m.name}: <strong className="font-bold">{m.value}</strong>
            </p>
          ))}
        </div>
      </div>

      <div className="my-4">
        <p className="block text-sm md:text-base text-textSurface dark:text-dark-textSurface font-normal mb-2">
          Input Data file: <strong className="font-bold">{inputData}</strong>
        </p>
      </div>
    </>
  );
};

export default ReviewSubmissionForm;
