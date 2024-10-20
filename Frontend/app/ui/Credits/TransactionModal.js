"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const TransactionModal = ({
  show,
  id,
  date,
  time,
  type,
  title,
  amount,
  problemId,
  description,
  onClose,
}) => {
  const modalRef = useRef(null);
  useEffect(() => {
    /**
     * Close the modal if user presses "Esc" button
     * @param event
     */
    const handleEscape = (event) => {
      if (!show) return;

      if (event.key === "Escape") {
        onClose();
      }
    };

    /**
     * Close the modal if user clicks anywhere outside the modal
     * @param event
     */
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchend", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [show, onClose]);

  if (!show) return <></>;

  return (
    <div className="fixed inset-0 bg-opacity-70 dark:bg-opacity-70 bg-surface dark:bg-dark-surface flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-background dark:bg-dark-background rounded-md overflow-hidden shadow-md max-w-[80%] lg:max-w-3xl w-full"
      >
        <div className="p-2 lg:p-3 2xl:p-4 flex flex-col gap-y-1 md:gap-y-2 xl:gap-y-3 text-textBackground dark:text-dark-textBackground">
          <h3 className="text-lg md:text-xl lg:text-2xl text-center font-semibold">
            Details for transaction
          </h3>
          <h4 className="text-base md:text-lg xl:text-xl text-center">
            with identifier{" "}
            <span className="text-sm md:text-base xl:text-lg italic border-b border-dashed border-textBackground dark:border-dark-textBackground">
              {id}
            </span>
          </h4>
          <hr className="my-2 h-1 bg-surface dark:bg-dark-surface" />
          <p className="text-xs md:text-sm lg:text-base text-center">
            <span className="font-semibold">Date:</span> {date}
          </p>
          <p className="text-xs md:text-sm lg:text-base text-center">
            <span className="font-semibold">Time:</span> {time}
          </p>
          <p className="text-xs md:text-sm lg:text-base text-center">
            <span className="font-semibold">Type:</span> {title}
          </p>
          <p className="text-xs md:text-sm lg:text-base text-center">
            <span className="font-semibold">Amount:</span> {amount}
          </p>
          {description && description.trim() !== "" ? (
            <p className="text-xs md:text-sm lg:text-base text-center">
              <span className="font-semibold">Description:</span> {description}
            </p>
          ) : (
            <></>
          )}
          {problemId && problemId.trim() !== "" ? (
            <p className="text-xs md:text-sm lg:text-base text-center">
              <span className="font-semibold">For Submission:</span>{" "}
              <Link
                href={`/submissions/info/${problemId}`}
                className="text-primary dark:text-dark-primary hover:text-primary-hover dark:hover:text-dark-primary-hover"
                prefetch={false}
              >
                {problemId}
              </Link>
            </p>
          ) : (
            <></>
          )}

          <button
            onClick={onClose}
            className="self-end bg-transparent text-sm transition-colors duration-300
            md:text-base text-primary dark:text-dark-primary hover:text-primary-hover dark:hover:text-dark-primary-hover"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
