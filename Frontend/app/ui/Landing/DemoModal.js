"use client";

import { useEffect, useRef } from "react";

const DemoModal = ({ show, onClose }) => {
  useEffect(() => {
    if (show) {
      document.getElementById("video")?.play();
    } else {
      document.getElementById("video")?.pause();
    }
  }, [show]);

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
        <div className="p-4">
          <video id="video" controls className="w-full">
            <source src="/examples/demo.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <div className="w-full flex items-center justify-center">
            <button
              onClick={onClose}
              className="bg-transparent text-sm transition-colors duration-300
            md:text-base text-primary dark:text-dark-primary hover:text-primary-hover dark:hover:text-dark-primary-hover"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModal;
