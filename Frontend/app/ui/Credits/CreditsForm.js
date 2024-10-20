"use client";

import { useState, useMemo } from "react";

import useHttp from "@/app/hooks/use-http";
import { validateInteger } from "@/app/lib/validateInteger";

const CreditsForm = ({ isAdmin, userId, balance, onSuccess }) => {
  const { isLoading, error, sendRequest } = useHttp();

  const [credits, setCredits] = useState("0");
  const [creditsError, setCreditsError] = useState("");

  let creditsErrorMessage = validateInteger(credits, 1);
  if (isAdmin) {
    creditsErrorMessage = validateInteger(credits);
    if (!creditsErrorMessage) {
      const creditsInt = parseInt(credits);
      if (creditsInt === 0) creditsErrorMessage = "cannot be zero";
    }
  }
  const creditsIsValid = creditsErrorMessage == null;

  const newBalance = useMemo(() => {
    if (validateInteger(credits)) return "N/A";
    if (validateInteger(balance)) return "N/A";

    return parseInt(balance) + parseInt(credits);
  }, [balance, credits]);

  const formIsValid = creditsIsValid;

  const submitHandler = (event) => {
    event.preventDefault();
    if (!formIsValid) return;

    // send put request to API's route /api/credits/:userId
    const url = `/api/credits/${userId}`;

    sendRequest(
      {
        url,
        method: "PUT",
        data: { amount: credits },
      },
      ({ credits }) => {
        onSuccess(credits);
        setCredits(0);
        setCreditsError(0);
      }
    );
  };

  const creditsChangeHandler = (event) => {
    if (creditsError !== "") setCreditsError("");
    const parsedValue = parseInt(event.target.value);
    if (parsedValue && !isNaN(parsedValue)) setCredits(parsedValue.toString());
    else setCredits(event.target.value);
  };

  const creditsBlurHandler = () => {
    if (!creditsIsValid) {
      setCreditsError(creditsErrorMessage);
    } else {
      setCreditsError("");
      const creditsInt = parseInt(credits);
      setCredits(creditsInt.toString());
    }
  };

  return (
    <form className="mt-8 sm:mt-12 md:mt-16 pb-4" onSubmit={submitHandler}>
      <legend className="text-lg md:text-xl lg:text-2xl text-center text-textBackground dark:text-dark-textBackground font-semibold">
        Add credits to your account
      </legend>
      {error && error.toString().trim() && (
        <p className="text-xs md:text-sm text-error dark:text-dark-error my-2">
          {error}
        </p>
      )}
      <div className="my-4">
        <label
          className="block text-base lg:text-lg text-textBackground dark:text-dark-textBackground font-bold mb-2"
          htmlFor="credits"
        >
          Amount
        </label>
        <input
          className="w-full px-3 py-2 rounded-md
          bg-surface-hover dark:bg-dark-surface-hover text-textSurface dark:text-dark-textSurface
          focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent"
          id="credits"
          type="number"
          step={1}
          placeholder="Amount"
          disabled={isLoading}
          value={credits}
          onChange={creditsChangeHandler}
          onBlur={creditsBlurHandler}
        />
        {newBalance != null && newBalance !== "N/A" && formIsValid ? (
          <p className="text-xs text-textSecondary dark:text-dark-textSecondary mt-2">
            Your new balance will be {newBalance}
          </p>
        ) : (
          <></>
        )}
        {creditsError && creditsError.trim() !== "" ? (
          <p className="text-xs md:text-sm text-error dark:text-dark-error mt-2">
            Amount {creditsError}
          </p>
        ) : (
          <></>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="flex-grow py-2 px-4 rounded transition-colors duration-300 font-bold
          focus:outline-none focus:shadow-outline cursor-pointer disabled:cursor-not-allowed
          bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover 
          text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover 
          disabled:bg-disabled dark:disabled:bg-dark-disabled disabled:text-textDisabled dark:disabled:text-dark-textDisabled"
          disabled={!formIsValid || isLoading}
        >
          Add Credits
        </button>
      </div>
    </form>
  );
};

export default CreditsForm;
