"use client";
import { useState } from "react";
import { validatePassword } from "@/app/lib/validatePassword";

const PasswordChangeForm = ({ isLoading, error, onSubmit }) => {
  const [password, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordDisplay, setPasswordDisplay] = useState(false);
  const passwordIsValid = validatePassword(password) == null;
  const confirmPasswordIsValid = password === confirmPassword;

  const formIsValid = passwordIsValid && confirmPasswordIsValid;

  const handlePasswordChange = (event) => {
    setNewPassword(event.target.value);
    setPasswordError(validatePassword(event.target.value) || "");
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordError(
      password === event.target.value ? "" : "Passwords do not match"
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formIsValid) return;
    onSubmit(password);
  };
  const togglePasswordDisplay = () => {
    setPasswordDisplay((prev) => !prev);
  };

  return (
    <form
      className="w-full max-w-md bg-surface dark:bg-dark-surface p-4 rounded-lg"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label
          className="block text-base lg:text-lg font-bold mb-2 text-textSurface dark:text-dark-textSurface"
          htmlFor="new-password"
        >
          New Password
        </label>
        <input
          className="w-full px-3 py-2 rounded-md bg-surface-hover dark:bg-dark-surface-hover text-textSurface dark:text-dark-textSurface focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent"
          id="new-password"
          type={passwordDisplay ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          required
          aria-required
        />
        {passwordError && (
          <p className="text-xs md:text-sm text-error dark:text-dark-error mt-2">
            {passwordError}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-base lg:text-lg font-bold mb-2 text-textSurface dark:text-dark-textSurface"
          htmlFor="confirm-password"
        >
          Confirm Password
        </label>
        <input
          className="w-full px-3 py-2 rounded-md bg-surface-hover dark:bg-dark-surface-hover text-textSurface dark:text-dark-textSurface focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-dark-accent"
          id="confirm-password"
          type={passwordDisplay ? "text" : "password"}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          required
          aria-required
        />
        {confirmPasswordError && (
          <p className="text-xs md:text-sm text-error dark:text-dark-error mt-2">
            {confirmPasswordError}
          </p>
        )}
      </div>

      <div className="my-2 flex items-center justify-start">
        <input
          className="appearance-none w-5 h-5 border-1 border-solid border-surface-hover dark:border-dark-surface-hover rounded
        bg-surface-hover dark:bg-dark-surface-hover text-textSurface dark:text-dark-textSurface
        focus:outline-none focus:ring-1 focus:ring-accent dark:focus:ring-dark-accent
        checked:bg-primary dark:checked:bg-dark-primary 
        checked:after:content-['\2714'] checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-xs
        checked:after:text-textPrimary dark:checked:after:text-dark-textPrimary"
          id="show-password"
          type="checkbox"
          checked={passwordDisplay}
          onChange={togglePasswordDisplay}
        />
        <label
          className="ml-2 text-sm lg:text-base text-textSurface dark:text-dark-textSurface font-normal cursor-pointer"
          htmlFor="show-password"
        >
          Show Password
        </label>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          type="submit"
          className="flex-grow py-2 px-4 rounded transition-colors duration-300 font-bold focus:outline-none focus:shadow-outline cursor-pointer disabled:cursor-not-allowed bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover disabled:bg-disabled dark:disabled:bg-dark-disabled disabled:text-textDisabled dark:disabled:text-dark-textDisabled"
          disabled={!formIsValid || isLoading}
        >
          Change Password
        </button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;
