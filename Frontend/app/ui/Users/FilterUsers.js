"use client";

import { useState, useEffect, useMemo } from "react";

import { FaSearch } from "react-icons/fa";

const FilterUsers = ({ allUsers, setFilteredUsers, isLoading }) => {
  const [showDeleted, setShowDeleted] = useState(false);
  const [searchName, setSearchName] = useState("");

  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const matchesDeleted = showDeleted ? u.isDeleted : !u.isDeleted;
      if (!matchesDeleted) return false;
      if (!searchName || searchName.trim() === "") return matchesDeleted;
      const matchesId = u.id.toLowerCase().includes(searchName.toLowerCase());
      if (matchesId) return true;
      const matchesName = u.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      if (matchesName) return true;
      const matchesEmail = u.email
        .toLowerCase()
        .includes(searchName.toLowerCase());
      return matchesEmail;
    });
  }, [allUsers, searchName, showDeleted]);

  useEffect(() => setFilteredUsers(filteredUsers), [filteredUsers]);

  // Define base values of classes
  const selectViewTabBaseClass =
    "px-2 py-1 sm:px-4 sm:py-2 border-2 transition-colors duration-300 border-textPrimary dark:border-dark-textPrimary text-sm md:text-base xl:text-lg";
  const selectViewTabActiveClass =
    "bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary";
  const selectViewTabInactiveClass = `bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface
        hover:bg-primary-hover dark:hover:bg-dark-primary-hover hover:border-textPrimary-hover dark:hover:border-dark-textPrimary-hover hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover`;

  const buttonsBaseClass =
    "w-full md:w-fit md:self-end px-4 py-2 gap-1 flex items-center text-sm lg:text-base rounded-md transition-colors duration-300";
  const buttonIconClass = "p-[4px] w-[20px] h-[20px] lg:w-[24px] lg:h-[24px]";

  return (
    <>
      {/* Tab layout: Switch between Active & Deleted users */}
      <div className="mt-2 lg:mt-4 mx-auto grid grid-cols-2 justify-center gap-0">
        <button
          className={`${selectViewTabBaseClass} rounded-l-md ${
            !showDeleted ? selectViewTabActiveClass : selectViewTabInactiveClass
          }`}
          onClick={() => setShowDeleted(false)}
        >
          Active
        </button>

        <button
          className={`${selectViewTabBaseClass} rounded-r-md border-l-0 ${
            showDeleted ? selectViewTabActiveClass : selectViewTabInactiveClass
          }`}
          onClick={() => setShowDeleted(true)}
        >
          Deleted
        </button>
      </div>

      {/* Search Filter */}
      <div className="w-full flex justify-center my-2 lg:my-4">
        <div
          className={`${buttonsBaseClass} bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface font-normal`}
        >
          <FaSearch className={buttonIconClass} />
          <input
            className="w-full bg-transparent focus:outline-none focus:ring-0 focus:ring-transparent dark:focus:ring-transparent"
            id="search"
            type="text"
            placeholder="Search..."
            disabled={isLoading}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default FilterUsers;
