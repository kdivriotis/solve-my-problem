"use client";

import { useEffect, useState } from "react";

import useHttp from "@/app/hooks/use-http";

import Spinner from "../Layout/Spinner";

const SelectModelForm = ({ selected, onSelect, setModel, formError }) => {
  const { isLoading, error, sendRequest } = useHttp();
  const [models, setModels] = useState([]);

  const getModels = () => {
    // send GET request to API's route /api/models/
    const url = "/api/models/";
    sendRequest(
      {
        url,
        method: "GET",
      },
      ({ models }) => {
        setModels(models);
        if (selected >= models.length) {
          onSelect(-1);
          setModel({ _id: null });
        }
      }
    );
  };

  useEffect(() => getModels(), []);

  const handleModelSelection = (index) => {
    onSelect(index);
    if (index < 0 || index >= models.length) {
      setModel({ _id: null });
      return;
    }

    setModel(models[index]);
  };

  return (
    <>
      <legend className="mt-2 text-lg md:text-xl lg:text-2xl text-center text-textSurface dark:text-dark-textSurface">
        Select a Model
      </legend>
      {formError && formError.toString().trim() && (
        <p className="text-center text-xs md:text-sm text-error dark:text-dark-error my-2">
          {formError}
        </p>
      )}

      {isLoading ? (
        <div className="my-2">
          <Spinner />
        </div>
      ) : error && error.trim() !== "" ? (
        <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-error dark:text-dark-error">
          {error}
        </p>
      ) : !models || models.length === 0 ? (
        <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-error dark:text-dark-error">
          There are no available models at the moment. Please try again later
        </p>
      ) : (
        <div className="my-4">
          <label
            className="block text-sm md:text-base text-textSurface dark:text-dark-textSurface font-bold mb-2"
            htmlFor="model"
          >
            Model
          </label>
          <select
            className="w-full px-3 py-2 rounded-md text-sm md:text-base
                bg-surface-hover dark:bg-dark-surface-hover text-textSurface dark:text-dark-textSurface
                focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent"
            id="model"
            placeholder="Select a model"
            disabled={isLoading}
            value={selected}
            onChange={(e) => handleModelSelection(e.target.value)}
            required
            aria-required
          >
            <option defaultChecked value={-1}>
              Select a solver model...
            </option>
            {models.map((model, index) => (
              <option key={model.id} value={index}>
                {model.name} ({model.id})
              </option>
            ))}
          </select>
          {selected >= 0 && selected < models.length ? (
            <p className="mt-2 text-xs md:text-sm xl:text-base text-textSurface dark:text-dark-textSurface">
              {models[selected].description}
            </p>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};

export default SelectModelForm;
