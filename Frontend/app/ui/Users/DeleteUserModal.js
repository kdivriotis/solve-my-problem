"use client";

import { useEffect, useRef } from "react";

const DeleteUserModal = ({ show, id, name, email, onDelete, onClose }) => {
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

  /**
   * Delete the currently displayed user.
   * Call delete function (passed from props) and close the modal
   */
  const handleDelete = () => {
    if (!show || !id) return;

    onDelete(id);
    onClose();
  };

  if (!show) return <></>;

  return (
    <div className="fixed inset-0 bg-opacity-70 dark:bg-opacity-70 bg-surface dark:bg-dark-surface flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-background dark:bg-dark-background rounded-md overflow-hidden shadow-md max-w-[80%] lg:max-w-3xl w-full"
      >
        <div className="p-2 lg:p-3 2xl:p-4 flex flex-col gap-y-1 md:gap-y-2 xl:gap-y-3 text-textBackground dark:text-dark-textBackground">
          <h3 className="text-lg md:text-xl lg:text-2xl text-center font-semibold">
            Delete User
          </h3>
          <hr className="my-2 h-1 bg-surface dark:bg-dark-surface" />
          <p className="text-xs md:text-sm lg:text-base text-center">
            Are you sure you want to delete user "
            <span className="font-semibold">{id}</span>"?
          </p>
          <p className="text-xs md:text-sm lg:text-base text-center">
            Name: <span className="font-semibold">{name}</span>
          </p>
          <p className="text-xs md:text-sm lg:text-base text-center">
            Email: <span className="font-semibold">{email}</span>
          </p>

          <div className="w-full flex items-center justify-around">
            <button
              onClick={onClose}
              className="bg-transparent text-sm transition-colors duration-300
            md:text-base text-primary dark:text-dark-primary hover:text-primary-hover dark:hover:text-dark-primary-hover"
            >
              Dismiss
            </button>

            <button
              onClick={handleDelete}
              className="px-2 py-1 sm:px-4 sm:py-2 rounded-md text-sm md:text-base transition-colors duration-300
            bg-error dark:bg-dark-error text-textError dark:text-dark-textError 
            hover:bg-error-hover hover:dark:bg-dark-error-hover hover:text-textError-hover dark:hover:text-dark-textError-hover"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
