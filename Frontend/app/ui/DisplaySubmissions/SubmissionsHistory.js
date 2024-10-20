"use client";

import { useEffect, useState } from "react";

import useHttp from "@/app/hooks/use-http";
import Spinner from "../Layout/Spinner";
import Toast from "../Toast";
import SubmissionsGridFilter from "./SubmissionsGridFilter";
import SubmissionsGrid from "./SubmissionsGrid";

const SubmissionsHistory = ({
  isLoadingSubmissions,
  errorSubmissions,
  submissions,
  onReload,

}) => {
  const [filteredSubmissions, setFilteredSubmissions] = useState(submissions);

  const { isLoading, error, sendRequest } = useHttp();

  // Delete/Run Submission Result Toast
  const [toastMessage, setToastMessage] = useState({
    show: false,
    isError: null,
    message: null,
  });

  const hideToast = () =>
    setToastMessage((prev) => {
      return { ...prev, show: false };
    });

  useEffect(() => {
    if (!error || error.trim() === "") return;

    setToastMessage({ show: true, isError: true, message: error });
  }, [error]);

  const executeSubmission = (id) => {
    if (!id || id.trim() === "") return;

    const url = `/api/submissions/run/${id}`;
    sendRequest(
      {
        url,
        method: "POST",
      },
      ({ message }) => {
        setToastMessage({ show: true, isError: false, message });
        onReload();
      }
    );
  };

  const deleteSubmission = (id) => {
    if (!id || id.trim() === "") return;

    const url = `/api/submissions/display/delete/${id}`;
    sendRequest(
      {
        url,
        method: "DELETE",
      },
      ({ message }) => {
        setToastMessage({ show: true, isError: false, message });
        onReload();
      }
    );
  };

  return (
    <div className="w-full my-4 flex-grow">
      {isLoadingSubmissions ? (
        <div className="my-2">
          <Spinner />
        </div>
      ) : errorSubmissions && errorSubmissions.trim() !== "" ? (
        <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-error dark:text-dark-error">
          {errorSubmissions}
        </p>
      ) : (
        <>
          <SubmissionsGridFilter
            isLoading={isLoadingSubmissions || isLoading}
            submissions={submissions}
            setFilteredSubmissions={setFilteredSubmissions}
            onRefresh={onReload}
          />
          <SubmissionsGrid
            submissions={submissions}
            filteredSubmissions={filteredSubmissions}
            isLoading={isLoading}
            onRun={executeSubmission}
            onDelete={deleteSubmission}
          />
        
        </>
      )}
      <Toast {...toastMessage} duration={3000} onClose={hideToast} />
    </div>
  );
};

export default SubmissionsHistory;
