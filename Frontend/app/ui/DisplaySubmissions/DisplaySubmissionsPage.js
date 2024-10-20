"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import useHttp from "@/app/hooks/use-http";
import SubmissionsDashboard from "./SubmissionsDashboard";
import SelectUserDropdown from "./SelectUserDropdown";
import SubmissionsHistory from "./SubmissionsHistory";

const DisplaySubmissionsPage = ({ isAdmin }) => {
  // List of all available users - only fetch once and only if user is admin
  const {
    isLoading: isLoadingUsers,
    error: errorUsers,
    sendRequest: sendRequestUsers,
  } = useHttp();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!isAdmin) return;

    // send GET request to API's route /api/user/all
    const url = "/api/user/all";
    sendRequestUsers(
      {
        url,
        method: "GET",
      },
      ({ users }) => setUsers(users)
    );
  }, []);

  // Manage query parameters
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // You can adjust this or make it dynamic

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const userId = searchParams.get("userId");
  const [selectedUser, setSelectedUser] = useState(userId || ""); // Initialize with userId from query

  useEffect(() => {
    if (userId) setSelectedUser(userId);
  }, [userId]);

  const { isLoading, error, sendRequest } = useHttp();
  const [submissions, setSubmissions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [allProblems, setAllProblems] = useState([]);

  const getSubmissions = () => {
    const url = `/api/submissions/display/${selectedUser}?page=${page}&pageSize=${pageSize}`;
    sendRequest(
      {
        url,
        method: "GET",
      },
      ({ problems, totalPages, allProblems }) => {
        setSubmissions(problems);
        setTotalPages(totalPages);
        setAllProblems(allProblems);
      }
    );
  };

  useEffect(() => getSubmissions(), [selectedUser, page, pageSize]);

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value)); // Update page size
    setPage(1); // Reset to first page when page size changes
  };

  const handleUserChange = (newUserId) => {
    setSelectedUser(newUserId);
    setPage(1); // Reset to the first page when the user changes
    if (newUserId === "") router.push(pathname);
    else router.push(`${pathname}?${createQueryString("userId", newUserId)}`);
  };

  return (
    <section className="px-2 lg:px-3 xl:px-4 py-4 w-full h-full flex flex-col items-center my-auto min-h-fit">
      <h1 className="mb-4 text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-textBackground dark:text-dark-textBackground">
        Problem Submissions
      </h1>

      <SubmissionsDashboard
        isLoading={isLoading}
        error={error}
        submissions={submissions}
        allProblems={allProblems}
      />
      <SelectUserDropdown
        isActive={isAdmin}
        isLoading={isLoadingUsers}
        error={errorUsers}
        users={users}
        selected={selectedUser}
        onSelectionChange={handleUserChange}
      />
      {/* Page Size Selector */}
      <div className="my-2">
        <label htmlFor="pageSize" className="mr-2">
          Items per page:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
          className="border rounded px-2 py-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <SubmissionsHistory
        isLoadingSubmissions={isLoading}
        errorSubmissions={error}
        submissions={submissions}
        onReload={getSubmissions}
      />
      <div className="flex justify-center gap-2 my-4 pb-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="py-2 px-4 rounded transition-colors duration-300 font-bold focus:outline-none focus:shadow-outline 
            cursor-pointer disabled:cursor-not-allowed 
            bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary
            hover:bg-primary-hover dark:hover:bg-dark-primary-hover hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover 
            disabled:bg-disabled dark:disabled:bg-dark-disabled disabled:text-textDisabled dark:disabled:text-dark-textDisabled"
        >
          Previous
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="py-2 px-4 rounded transition-colors duration-300 font-bold focus:outline-none focus:shadow-outline 
            cursor-pointer disabled:cursor-not-allowed 
            bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary
            hover:bg-primary-hover dark:hover:bg-dark-primary-hover hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover 
            disabled:bg-disabled dark:disabled:bg-dark-disabled disabled:text-textDisabled dark:disabled:text-dark-textDisabled"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default DisplaySubmissionsPage;
