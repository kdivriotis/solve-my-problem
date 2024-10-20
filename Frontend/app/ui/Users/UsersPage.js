"use client";

import { useEffect, useState } from "react";

import useHttp from "@/app/hooks/use-http";
import UsersDashboard from "./UsersDashboard";
import DisplayUsers from "./DisplayUsers";

const UsersPage = ({ isAdmin }) => {
  // List of all users
  const { isLoading, error, sendRequest } = useHttp();
  const [users, setUsers] = useState([]);

  const getUsers = () => {
    // send GET request to API's route /api/user/all
    const url = "/api/user/all";
    sendRequest(
      {
        url,
        method: "GET",
      },
      ({ users }) => setUsers(users)
    );
  };

  useEffect(() => getUsers(), []);

  return (
    <section className="px-2 lg:px-3 xl:px-4 py-4 w-full h-full flex flex-col items-center my-auto min-h-fit">
      <h1 className="mb-4 text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-textBackground dark:text-dark-textBackground">
        Users
      </h1>
      <UsersDashboard isLoading={isLoading} error={error} users={users} />
      <DisplayUsers
        isLoadingUsers={isLoading}
        errorUsers={error}
        users={users}
        onReload={getUsers}
      />
    </section>
  );
};

export default UsersPage;
