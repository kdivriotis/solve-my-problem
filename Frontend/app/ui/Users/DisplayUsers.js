"use client";

import { useState, useEffect } from "react";

import useHttp from "@/app/hooks/use-http";
import Spinner from "../Layout/Spinner";
import Toast from "../Toast";
import FilterUsers from "./FilterUsers";
import UsersGrid from "./UsersGrid";

const DisplayUsers = ({ isLoadingUsers, errorUsers, users, onReload }) => {
  const { isLoading, error, sendRequest } = useHttp();

  // Delete/Restore User Result Toast
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

  const [filteredUsers, setFilteredUsers] = useState(users);

  /**
   * Delete a user
   * @param {string} id the unique ID of the user
   */
  const deleteUser = (id) => {
    if (!id || id.trim() === "") return;

    // send DELETE request to API's route /api/user/delete/:id
    const url = `/api/user/delete/${id}`;
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

  /**
   * Restore a user
   * @param {string} id the unique ID of the user
   */
  const restoreUser = (id) => {
    if (!id || id.trim() === "") return;

    // send PUT request to API's route /api/user/restore/:id
    const url = `/api/user/restore/${id}`;
    sendRequest(
      {
        url,
        method: "PUT",
      },
      ({ message }) => {
        setToastMessage({ show: true, isError: false, message });
        onReload();
      }
    );
  };

  return (
    <div className="w-full my-4 pb-4 flex-grow">
      {isLoadingUsers ? (
        <div className="my-2">
          <Spinner />
        </div>
      ) : errorUsers && errorUsers.trim() !== "" ? (
        <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-error dark:text-dark-error">
          {errorUsers}
        </p>
      ) : (
        <>
          <FilterUsers
            allUsers={users}
            setFilteredUsers={setFilteredUsers}
            isLoading={isLoadingUsers}
          />
          <UsersGrid
            users={filteredUsers}
            filteredUsers={filteredUsers}
            isLoading={isLoading}
            onDelete={deleteUser}
            onRestore={restoreUser}
          />
        </>
      )}
      <Toast {...toastMessage} duration={3000} onClose={hideToast} />
    </div>
  );
};

export default DisplayUsers;
