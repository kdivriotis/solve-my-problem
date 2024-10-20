"use client";

import Link from "next/link";
import { useState } from "react";

import { FaEdit, FaEye, FaPlay } from "react-icons/fa";
import { VscOutput } from "react-icons/vsc";
import { RiDeleteBin6Line } from "react-icons/ri";

import { ProblemStatus, problemStatusString } from "@/app/lib/problemStatus";

import DeleteSubmissionModal from "./DeleteSubmissionModal";

const SubmissionsGrid = ({
  submissions,
  filteredSubmissions,
  isLoading,
  onRun,
  onDelete,
}) => {
  const [details, setDetails] = useState({
    show: false,
    id: null,
    name: null,
  });

  const showModal = (idx) => {
    if (idx < 0 || idx >= filteredSubmissions.length) return;

    setDetails({
      ...filteredSubmissions[idx],
      show: true,
    });
  };

  const hideModal = () =>
    setDetails((prev) => {
      return { ...prev, show: false };
    });

  const gridCellBaseClass =
    "px-1 sm:px-2 lg:px-4 text-left max-w-full break-words";
  const gridRowBaseClass =
    "grid grid-cols-4 lg:grid-cols-7 py-1 lg:py-2 text-sm lg:text-base";
  const gridCol1SizeClass = "col-span-1 lg:col-span-2";
  const gridCol2SizeClass = "col-span-1";
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

  return (
    <div className="w-fit min-w-full overflow-x-auto rounded-md mt-4">
      <div
        className={`${gridRowBaseClass} bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary`}
      >
        <h3 className={`${gridCellBaseClass} ${gridCol1SizeClass}`}>Name</h3>
        <h3 className={`${gridCellBaseClass} ${gridCol2SizeClass}`}>
          Created On
        </h3>
        <h3 className={`${gridCellBaseClass} ${gridCol3SizeClass}`}>Status</h3>
        <h3
          className={`${gridCellBaseClass} lg:text-center ${gridCol4SizeClass}`}
        >
          Actions
        </h3>
      </div>
      <>
        {filteredSubmissions.map((submission, index) => (
          <div
            key={submission.id}
            className={`${gridRowBaseClass}
                  ${
                    index % 2 === 0
                      ? "bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface"
                      : "bg-surface-hover dark:bg-dark-surface-hover text-textSurface-hover dark:text-dark-textSurface-hover"
                  }
                `}
          >
            <div className={`${gridCellBaseClass} ${gridCol1SizeClass} `}>
              {submission.name}
            </div>
            <div className={`${gridCellBaseClass} ${gridCol2SizeClass} `}>
              {new Date(submission.submittedOn).toLocaleDateString()}
            </div>
            <div className={`${gridCellBaseClass} ${gridCol3SizeClass} `}>
              {problemStatusString(submission.status)}
            </div>
            <div
              className={`${gridCellBaseClass} ${gridCol4SizeClass} flex items-center justify-center flex-col lg:flex-row gap-1 2xl:gap-2 3xl:gap-3`}
            >
              {submission.status === ProblemStatus.NOT_READY ||
              submission.status === ProblemStatus.READY ? (
                <Link
                  href={`/submissions/info/${submission.id}`}
                  className={`${actionButtonBaseClass} ${actionButtonMainClass}`}
                  prefetch={false}
                >
                  <span className="block md:hidden">
                    <FaEdit className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" />
                  </span>
                  <span className="hidden md:block">Edit</span>
                </Link>
              ) : (
                <Link
                  href={`/submissions/info/${submission.id}`}
                  className={`${actionButtonBaseClass} ${actionButtonMainClass}`}
                  prefetch={false}
                >
                  <span className="block md:hidden">
                    <FaEye className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" />
                  </span>
                  <span className="hidden md:block">View</span>
                </Link>
              )}
              <button
                className={`${actionButtonBaseClass} ${actionButtonMainClass}`}
                onClick={() => onRun(submission.id)}
                disabled={
                  submission.status !== ProblemStatus.READY || isLoading
                }
              >
                <span className="block md:hidden">
                  <FaPlay className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" />
                </span>
                <span className="hidden md:block">Run</span>
              </button>
              {submission.status === ProblemStatus.EXECUTED ? (
                <Link
                  href={`/submissions/results/${submission.id}`}
                  className={`${actionButtonBaseClass} ${actionButtonMainClass}`}
                  prefetch={false}
                  disabled={submission.status !== ProblemStatus.EXECUTED}
                >
                  <span className="block md:hidden">
                    <VscOutput className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" />
                  </span>
                  <span className="hidden md:block">Result</span>
                </Link>
              ) : (
                <div
                  className="px-1 sm:px-2 py-1 xl:px-3 3xl:px-4 3xl:py-2 rounded-md cursor-not-allowed text-center
                                        bg-disabled dark:bg-dark-disabled text-textDisabled dark:text-dark-textDisabled"
                >
                  <span className="block md:hidden">
                    <VscOutput className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" />
                  </span>
                  <span className="hidden md:block">Result</span>
                </div>
              )}
              <button
                className={`${actionButtonBaseClass} ${actionButtonDeleteClass}`}
                onClick={() => showModal(index)}
              >
                <span className="block md:hidden">
                  <RiDeleteBin6Line className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" />
                </span>
                <span className="hidden md:block">Delete</span>
              </button>
            </div>
          </div>
        ))}
        {!submissions || submissions?.length === 0 ? (
          <div
            className="py-1 lg:py-2 text-sm lg:text-base px-1 sm:px-2 lg:px-4 text-center
                bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface"
          >
            No submissions have been added yet
          </div>
        ) : !filteredSubmissions || filteredSubmissions.length === 0 ? (
          <div
            className="py-1 lg:py-2 text-sm lg:text-base px-1 sm:px-2 lg:px-4 text-center
              bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface"
          >
            No submissions found for the current search
          </div>
        ) : (
          <></>
        )}
      </>
      <DeleteSubmissionModal
        {...details}
        onDelete={onDelete}
        onClose={hideModal}
      />
    </div>
  );
};

export default SubmissionsGrid;
