"use client";

import { useEffect } from "react";

import useHttp from "@/app/hooks/use-http";

import Spinner from "../Layout/Spinner";

const MetadataFileForm = ({
  selectedModel,
  name,
  onFileChange,
  setModelInfo,
  metadata,
  isValidationActive,
  formError,
}) => {
  const { isLoading, error, sendRequest } = useHttp();

  const handleFileSelection = (event) => {
    if (!event.target.files || event.target.files.length === 0) return;
    onFileChange(event.target.files[0]);
  };

  const getModelInfo = (id) => {
    // send GET request to API's route /api/models/:id
    const url = `/api/models/${id}`;
    sendRequest(
      {
        url,
        method: "GET",
      },
      (modelInfo) => setModelInfo(modelInfo)
    );
  };

  useEffect(() => {
    if (!selectedModel || !selectedModel._id) return;
    getModelInfo(selectedModel._id);
  }, [selectedModel]);

  // Define base values of classes
  const gridCellBaseClass =
    "px-1 sm:px-2 lg:px-4 text-left max-w-full break-words";
  const gridRowBaseClass = "grid grid-cols-7 py-1 lg:py-2 text-sm lg:text-base";
  const gridCol1SizeClass = "col-span-3 md:col-span-2";
  const gridCol2SizeClass = "hidden md:block col-span-3";
  const gridCol3SizeClass = "col-span-2 md:col-span-1";
  const gridCol4SizeClass = "col-span-2 md:col-span-1";

  return (
    <>
      <legend className="mt-2 text-lg md:text-xl lg:text-2xl text-center text-textSurface dark:text-dark-textSurface">
        Upload metadata for your submission
      </legend>
      {formError && formError.toString().trim() && (
        <p className="text-center text-xs md:text-sm text-error dark:text-dark-error my-2">
          {formError}
        </p>
      )}

      <div className="my-4">
        <label
          className="block text-sm md:text-base text-textSurface dark:text-dark-textSurface font-bold mb-2"
          htmlFor="model"
        >
          Model
        </label>
        <select
          className="w-full px-3 py-2 rounded-md text-sm md:text-base
                bg-disabled dark:bg-dark-disabled text-textDisabled dark:text-dark-textDisabled
                focus:outline-none focus:ring-0 focus:ring-transparent dark:focus:ring-transparent"
          id="model"
          disabled={true}
        >
          <option defaultChecked>
            {selectedModel.name} ({selectedModel.id})
          </option>
        </select>
      </div>

      <div className="my-4">
        <label
          className="block text-sm md:text-base text-textSurface dark:text-dark-textSurface font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="w-full px-3 py-2 rounded-md text-sm md:text-base
                bg-disabled dark:bg-dark-disabled text-textDisabled dark:text-dark-textDisabled
                focus:outline-none focus:ring-0 focus:ring-transparent dark:focus:ring-transparent"
          id="name"
          disabled={true}
          type="text"
          placeholder="Submission's name..."
          value={name}
        />
      </div>

      {isLoading ? (
        <div className="my-2">
          <Spinner />
        </div>
      ) : error && error.trim() !== "" ? (
        <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-error dark:text-dark-error">
          {error}
        </p>
      ) : !metadata ? (
        <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-error dark:text-dark-error">
          No info found for the selected model, please try again later
        </p>
      ) : metadata.length === 0 ? (
        <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-textSurface dark:text-dark-textSurface">
          No metadata is required for the selected model
        </p>
      ) : (
        <div className="my-4">
          <label
            className="block text-sm md:text-base text-textSurface dark:text-dark-textSurface font-bold mb-2"
            htmlFor="metadata"
          >
            Metadata
          </label>
          {/* Required metadata grid */}
          <div className="w-full">
            <div
              className={`${gridRowBaseClass} bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary`}
            >
              <h3 className={`${gridCellBaseClass} ${gridCol1SizeClass}`}>
                Name
              </h3>
              <h3 className={`${gridCellBaseClass} ${gridCol2SizeClass}`}>
                Description
              </h3>
              <h3 className={`${gridCellBaseClass} ${gridCol3SizeClass}`}>
                Type
              </h3>
              <h3 className={`${gridCellBaseClass} ${gridCol4SizeClass}`}>
                UOM
              </h3>
            </div>

            <>
              {metadata.map((m, index) => (
                <div
                  key={m.name}
                  className={`${gridRowBaseClass}
                        ${
                          index % 2 === 0
                            ? "bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface"
                            : "bg-surface-hover dark:bg-dark-surface-hover text-textSurface-hover dark:text-dark-textSurface-hover"
                        }
                      `}
                >
                  <p className={`${gridCellBaseClass} ${gridCol1SizeClass}`}>
                    {m.name}
                  </p>
                  <p className={`${gridCellBaseClass} ${gridCol2SizeClass}`}>
                    {m.description}
                  </p>
                  <p className={`${gridCellBaseClass} ${gridCol3SizeClass}`}>
                    {m.type}
                  </p>
                  <p className={`${gridCellBaseClass} ${gridCol4SizeClass}`}>
                    {m.uom}
                  </p>
                </div>
              ))}
            </>
          </div>
          <input
            id="metadata"
            className="w-full px-3 py-2 mt-2 rounded-md text-sm md:text-base
                bg-surface-hover dark:bg-dark-surface-hover text-textSurface dark:text-dark-textSurface
                focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent"
            type="file"
            multiple={false}
            onChange={handleFileSelection}
            accept="application/json, .json"
            disabled={isValidationActive}
            required
            aria-required
          />
        </div>
      )}
    </>
  );
};

export default MetadataFileForm;
