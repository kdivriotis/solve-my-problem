"use client";

import { useEffect } from "react";

const Toast = ({ show, isError, message, duration, onClose }) => {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return <></>;

  return (
    <div
      className={`max-w-full fixed bottom-4 right-4 z-40 px-4 py-2 rounded-md shadow-md text-xs md:text-sm xl:text-base
        ${
          isError
            ? "bg-error dark:bg-dark-error text-textError dark:text-dark-textError"
            : "bg-success dark:bg-dark-success text-textSuccess dark:text-dark-textSuccess"
        }`}
    >
      {message}
    </div>
  );
};

export default Toast;
