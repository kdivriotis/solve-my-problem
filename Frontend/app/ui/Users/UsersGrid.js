"use client";

import Link from "next/link";
import { useState } from "react";

import { FaTasks, FaUndo } from "react-icons/fa";
import { TbCoinEuroFilled } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";

import DeleteUserModal from "./DeleteUserModal";

const UsersGrid = ({
  users,
  filteredUsers,
  isLoading,
  onDelete,
  onRestore,
}) => {
  // Delete User Modal
  const [details, setDetails] = useState({
    show: false,
    id: null,
    name: null,
    email: null,
  });

  /**
   * Show the modal window for deleting a user
   * @param {number} idx the index of the user to be deleted
   */
  const showModal = (idx) => {
    if (idx < 0 || idx >= filteredUsers.length) return;

    setDetails({
      ...filteredUsers[idx],
      show: true,
    });
  };

  /**
   * Hide the modal window
   */
  const hideModal = () =>
    setDetails((prev) => {
      return { ...prev, show: false };
    });

  // Define base values of classes
  const gridCellBaseClass =
    "px-1 sm:px-2 lg:px-4 text-left max-w-full break-words";
  const gridRowBaseClass =
    "grid grid-cols-4 lg:grid-cols-7 py-1 lg:py-2 text-sm lg:text-base";
  const gridCol1SizeClass = "col-span-1";
  const gridCol2SizeClass = "col-span-1 lg:col-span-2";
  const gridCol3SizeClass = "col-span-1";
  const gridCol4SizeClass = "col-span-1 lg:col-span-3";
  const actionButtonBaseClass = `px-1 py-1 sm:px-2 xl:px-3 3xl:px-4 3xl:py-2 w-fit cursor-pointer disabled:cursor-not-allowed
                                text-center transition-colors duration-300 ease-in-out rounded-md
                                disabled:bg-disabled dark:disabled:bg-dark-disabled disabled:text-textDisabled dark:disabled:text-dark-textDisabled`;
  const actionButtonMainClass = `bg-transparent dark:bg-transparent hover:bg-primary-hover dark:hover:bg-dark-primary-hover 
                                  text-textSurface dark:text-dark-textSurface hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover
                                  fill-textSurface dark:fill-dark-textSurface hover:fill-textPrimary-hover dark:hover:fill-dark-textPrimary-hover`;
  const actionButtonDeleteClass = `bg-error dark:bg-dark-error hover:bg-error-hover dark:hover:bg-dark-error-hover 
                                  text-textError dark:text-dark-textError hover:text-textError-hover dark:hover:text-dark-textError-hover
                                  fill-textError dark:fill-dark-textError hover:fill-textError-hover dark:hover:fill-dark-textError-hover`;
  const actionButtonRestoreClass = `bg-secondary dark:bg-dark-secondary hover:bg-secondary-hover dark:hover:bg-dark-secondary-hover 
                                  text-textSecondary dark:text-dark-textSecondary hover:text-textSecondary-hover dark:hover:text-dark-textSecondary-hover
                                  fill-textSecondary dark:fill-dark-textSecondary hover:fill-textSecondary-hover dark:hover:fill-dark-textSecondary-hover`;

  return (
    <div className="w-fit min-w-full overflow-x-auto rounded-md">
      <div
        className={`${gridRowBaseClass} bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary`}
      >
        <h3 className={`${gridCellBaseClass} ${gridCol1SizeClass}`}>ID</h3>
        <h3 className={`${gridCellBaseClass} ${gridCol2SizeClass}`}>Email</h3>
        <h3 className={`${gridCellBaseClass} ${gridCol3SizeClass}`}>
          Member Since
        </h3>
        <h3
          className={`${gridCellBaseClass} ${gridCol4SizeClass} sm:text-center`}
        >
          Actions
        </h3>
      </div>
      <>
        {filteredUsers.map((user, index) => (
          <div
            key={user.id}
            className={`${gridRowBaseClass}
                  ${
                    index % 2 === 0
                      ? "bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface"
                      : "bg-surface-hover dark:bg-dark-surface-hover text-textSurface-hover dark:text-dark-textSurface-hover"
                  }
                `}
          >
            <div
              className={`${gridCellBaseClass} ${gridCol1SizeClass}`}
            >
              {user.id}
            </div>
            <div
              className={`${gridCellBaseClass} ${gridCol2SizeClass}`}
            >
              {user.email}
            </div>
            <div
              className={`${gridCellBaseClass} ${gridCol3SizeClass}`}
            >
              {new Date(user.date).toLocaleDateString()}
            </div>
            <div
              className={`${gridCellBaseClass} ${gridCol4SizeClass} flex items-center justify-center flex-col lg:flex-row gap-1 2xl:gap-2 3xl:gap-3`}
            >
              <Link
                href={`/credits?userId=${user.id}`}
                className={`${actionButtonBaseClass} ${actionButtonMainClass}`}
                prefetch={false}
              >
                <span className="block md:hidden">
                  <TbCoinEuroFilled className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" />
                </span>
                <span className="hidden md:block">Credits</span>
              </Link>
              <Link
                href={`/submissions?userId=${user.id}`}
                className={`${actionButtonBaseClass} ${actionButtonMainClass}`}
                prefetch={false}
              >
                <span className="block md:hidden">
                  <FaTasks className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" />
                </span>
                <span className="hidden md:block">Submissions</span>
              </Link>
              {user.isDeleted ? (
                <button
                  className={`${actionButtonBaseClass} ${actionButtonRestoreClass}`}
                  onClick={() => onRestore(user.id)}
                  disabled={isLoading}
                >
                  <span className="block md:hidden">
                    <FaUndo className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" />
                  </span>
                  <span className="hidden md:block">Restore</span>
                </button>
              ) : (
                <button
                  className={`${actionButtonBaseClass} ${actionButtonDeleteClass}`}
                  onClick={() => showModal(index)}
                  disabled={isLoading}
                >
                  <span className="block md:hidden">
                    <RiDeleteBin6Line className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" />
                  </span>
                  <span className="hidden md:block">Delete</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {!users || users?.length === 0 ? (
          <div
            className="py-1 lg:py-2 text-sm lg:text-base px-1 sm:px-2 lg:px-4 text-center
                bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface"
          >
            No users found
          </div>
        ) : !filteredUsers || filteredUsers.length === 0 ? (
          <div
            className="py-1 lg:py-2 text-sm lg:text-base px-1 sm:px-2 lg:px-4 text-center
              bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface"
          >
            No users found for the current search
          </div>
        ) : (
          <></>
        )}
      </>
      <DeleteUserModal {...details} onDelete={onDelete} onClose={hideModal} />
    </div>
  );
};

export default UsersGrid;
