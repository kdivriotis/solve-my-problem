"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import { HiRefresh } from "react-icons/hi";

import { ProblemStatus, problemStatusString } from "@/app/lib/problemStatus";

const SubmissionsGridFilter = ({
  isLoading,
  submissions,
  setFilteredSubmissions,
  onRefresh,
}) => {
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState(-1);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const filterValue = parseInt(statusFilter);
      const matchesStatus =
        filterValue === -1 || isNaN(filterValue) || s.status === filterValue;
      if (!matchesStatus) return false;

      if (!searchName || searchName.trim() === "") return true;
      return s.name.toLowerCase().includes(searchName.toLowerCase());
    });
  }, [submissions, searchName, statusFilter]);

  useEffect(
    () => setFilteredSubmissions(filteredSubmissions),
    [filteredSubmissions]
  );

  // Define base values of classes
  const buttonsBaseClass =
    "w-full md:w-fit pl-4 gap-1 flex items-center text-sm lg:text-base rounded-md transition-colors duration-300";
  const buttonIconClass = "w-[20px] h-[20px] lg:w-[24px] lg:h-[24px]";
  const buttonTextClass = "pr-4 py-2";

  return (
    <div className="w-full flex flex-col xl:flex-row">
      <div className="w-full flex flex-col md:flex-row gap-3 md:gap-2 lg:gap-3 items-center md:justify-center xl:justify-start">
        <Link
          href="/submissions/create"
          className={`${buttonsBaseClass} bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover
          text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover font-normal`}
          prefetch={false}
        >
          <FaPlus className={buttonIconClass} />
          <span className={buttonTextClass}>Create Submission</span>
        </Link>
        <button
          className={`${buttonsBaseClass} bg-secondary dark:bg-dark-secondary hover:bg-secondary-hover dark:hover:bg-dark-secondary-hover
          text-textSecondary dark:text-dark-textSecondary hover:text-textSecondary-hover dark:hover:text-dark-textSecondary-hover font-normal`}
          onClick={onRefresh}
        >
          <HiRefresh className={buttonIconClass} />
          <span className={buttonTextClass}>Refresh</span>
        </button>
      </div>
      <div className="w-full flex flex-col md:flex-row mt-3 md:mt-2 lg:mt-3 gap-3 md:gap-2 lg:gap-3 items-center md:justify-center xl:justify-end">
        <div
          className={`${buttonsBaseClass} bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface font-normal`}
        >
          <label htmlFor="status-filter" className={buttonIconClass}>
            <FaFilter className={buttonIconClass} />
          </label>
          <select
            className="w-full pr-4 py-2 bg-transparent focus:outline-none focus:ring-0 focus:ring-transparent dark:focus:ring-transparent"
            id="status-filter"
            placeholder="Filter submission's status"
            disabled={isLoading}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            required
            aria-required
          >
            <option
              defaultChecked
              value={-1}
              className="text-xs md:text-sm xl:text-base text-ellipsis"
            >
              Filter by Status
            </option>
            {Object.entries(ProblemStatus).map(([key, value]) => (
              <option
                key={key}
                value={value}
                className="text-xs md:text-sm xl:text-base text-ellipsis"
              >
                {problemStatusString(value)}
              </option>
            ))}
          </select>
        </div>

        <div
          className={`${buttonsBaseClass} bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface font-normal`}
        >
          <label htmlFor="search" className={buttonIconClass}>
            <FaSearch className={buttonIconClass} />
          </label>
          <input
            className="w-full pr-4 py-2 bg-transparent focus:outline-none focus:ring-0 focus:ring-transparent dark:focus:ring-transparent"
            id="search"
            type="text"
            placeholder="Search..."
            disabled={isLoading}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SubmissionsGridFilter;
