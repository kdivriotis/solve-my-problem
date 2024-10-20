"use client";

import { useMemo } from "react";

import Spinner from "../Layout/Spinner";

const InputDataFileForm = ({
  selectedModel,
  name,
  metadata,
  onFileChange,
  inputData,
  isValidationActive,
  formError,
}) => {
  const metadataArray = useMemo(() => {
    if (!metadata) return [];
    return Object.entries(metadata).map(([key, value]) => {
      return { name: key, value: value };
    });
  }, metadata);

  const handleFileSelection = (event) => {
    if (!event.target.files || event.target.files.length === 0) return;
    onFileChange(event.target.files[0]);
  };

  // Define base values of classes
  const gridCellBaseClass =
    "px-1 sm:px-2 lg:px-4 text-left max-w-full break-words";
  const gridRowBaseClass = "grid grid-cols-7 py-1 lg:py-2 text-sm lg:text-base";
  const gridCol1SizeClass = "col-span-2";
  const gridCol2SizeClass = "col-span-1";
  const gridCol3SizeClass = "col-span-3";

  return (
    <>
      <legend className="mt-2 text-lg md:text-xl lg:text-2xl text-center text-textSurface dark:text-dark-textSurface">
        Upload input data for your submission
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

      {!inputData ? (
        <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-error dark:text-dark-error">
          No info found for the selected model, please try again later
        </p>
      ) : inputData.length === 0 ? (
        <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-textSurface dark:text-dark-textSurface">
          No input data is required for the selected model
        </p>
      ) : (
        <div className="my-4">
          <label
            className="block text-sm md:text-base text-textSurface dark:text-dark-textSurface font-bold mb-2"
            htmlFor="input-data"
          >
            Input Data
          </label>
          {/* Required input data grid */}
          <div className="w-full">
            <div
              className={`${gridRowBaseClass} bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary`}
            >
              <h3 className={`${gridCellBaseClass} ${gridCol1SizeClass}`}>
                Name
              </h3>
              <h3 className={`${gridCellBaseClass} ${gridCol2SizeClass}`}>
                Type
              </h3>
              <h3 className={`${gridCellBaseClass} ${gridCol3SizeClass}`}>
                UOM
              </h3>
            </div>

            <>
              {inputData.map((i, index) => (
                <div
                  key={i.name}
                  className={`${gridRowBaseClass}
                        ${
                          index % 2 === 0
                            ? "bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface"
                            : "bg-surface-hover dark:bg-dark-surface-hover text-textSurface-hover dark:text-dark-textSurface-hover"
                        }
                      `}
                >
                  <p className={`${gridCellBaseClass} ${gridCol1SizeClass}`}>
                    {i.name}
                  </p>
                  <p className={`${gridCellBaseClass} ${gridCol2SizeClass}`}>
                    {i.type}
                  </p>
                  <p className={`${gridCellBaseClass} ${gridCol3SizeClass}`}>
                    {i.uom}
                  </p>
                </div>
              ))}
            </>
          </div>
          <input
            id="input-data"
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

export default InputDataFileForm;
