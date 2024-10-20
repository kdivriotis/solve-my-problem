"use client";

import { useState } from "react";

import { validateEmail } from "../../lib/validateEmail";
import { validatePassword } from "../../lib/validatePassword";

const LoginForm = ({ isLoading, error, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordDisplay, setPasswordDisplay] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const emailErrorMessage = validateEmail(email, 250);
  const emailIsValid = emailErrorMessage == null;
  const passwordErrorMessage = validatePassword(password, {
    character: true,
    digit: true,
    symbol: true,
  });
  const passwordIsValid = passwordErrorMessage == null;

  const formIsValid = emailIsValid && passwordIsValid;

  const submitHandler = (event) => {
    event.preventDefault();
    if (!formIsValid) return;

    onSubmit(email, password);
  };

  const emailChangeHandler = (event) => {
    if (emailError !== "") setEmailError("");
    setEmail(event.target.value);
  };

  const emailBlurHandler = () => {
    if (!emailIsValid) {
      setEmailError(emailErrorMessage);
    } else {
      setEmailError("");
    }
  };

  const passwordChangeHandler = (event) => {
    if (passwordError !== "") setPasswordError("");
    setPassword(event.target.value);
  };

  const passwordBlurHandler = () => {
    if (!passwordIsValid) {
      setPasswordError(passwordErrorMessage);
    } else {
      setPasswordError("");
    }
  };

  const togglePasswordDisplay = () => {
    setPasswordDisplay((prev) => !prev);
  };

  return (
    <form
      className="rounded-lg overflow-hidden bg-surface dark:bg-dark-surface p-4"
      onSubmit={submitHandler}
    >
      <legend className="text-lg md:text-xl lg:text-2xl text-center text-textSurface dark:text-dark-textSurface">
        Login
      </legend>
      {error && error.toString().trim() && (
        <p className="text-xs md:text-sm text-error dark:text-dark-error my-2">
          {error}
        </p>
      )}
      <div className="my-4">
        <label
          className="block text-base lg:text-lg text-textSurface dark:text-dark-textSurface font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="w-full px-3 py-2 rounded-md
          bg-surface-hover dark:bg-dark-surface-hover text-textSurface dark:text-dark-textSurface
          focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent"
          id="email"
          type="email"
          placeholder="Email"
          disabled={isLoading}
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          required
          aria-required
        />
        {emailError && emailError.trim() !== "" && (
          <p className="text-xs md:text-sm text-error dark:text-dark-error mt-2">
            {emailError}
          </p>
        )}
      </div>
      <div className="my-4">
        <label
          className="block text-base lg:text-lg text-textSurface dark:text-dark-textSurface font-bold mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="w-full px-3 py-2 rounded-md
          bg-surface-hover dark:bg-dark-surface-hover text-textSurface dark:text-dark-textSurface
          focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent"
          id="password"
          type={passwordDisplay ? "text" : "password"}
          placeholder="Password"
          disabled={isLoading}
          value={password}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          required
          aria-required
        />
        {passwordError && passwordError.trim() !== "" && (
          <p className="text-xs md:text-sm text-error dark:text-dark-error mt-2">
            {passwordError}
          </p>
        )}
      </div>
      <div className="my-2 flex gap-3 items-center justify-start">
        <label
          className="block text-sm lg:text-base text-textSurface dark:text-dark-textSurface font-normal"
          htmlFor="show-password"
        >
          Show Password
        </label>
        <input
          className="appearance-none w-5 h-5 border-1 border-solid border-surface-hover dark:border-dark-surface-hover rounded
          bg-surface-hover dark:bg-dark-surface-hover text-textSurface dark:text-dark-textSurface
          focus:outline-none focus:ring-1 focus:ring-accent dark:focus:ring-dark-accent
          checked:bg-primary dark:checked:bg-dark-primary 
          checked:after:content-['\2714'] checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-xs
          checked:after:text-textPrimary dark:checked:after:text-dark-textPrimary"
          id="show-password"
          type="checkbox"
          disabled={isLoading}
          value={passwordDisplay}
          onChange={togglePasswordDisplay}
        />
      </div>
      <div className="flex items-center justify-between mt-4">
        <button
          type="submit"
          className="flex-grow py-2 px-4 rounded transition-colors duration-300 font-bold
          focus:outline-none focus:shadow-outline cursor-pointer disabled:cursor-not-allowed
          bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover 
          text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover 
          disabled:bg-disabled dark:disabled:bg-dark-disabled disabled:text-textDisabled dark:disabled:text-dark-textDisabled"
          disabled={!formIsValid || isLoading}
        >
          Login
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
