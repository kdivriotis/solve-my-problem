"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CgProfile } from "react-icons/cg";

import useHttp from "@/app/hooks/use-http";

const ProfileInfo = ({ isLoggedIn, userName, userEmail, userDate }) => {
  const { sendRequest } = useHttp();

  // Instantiate router for programmatically navigating to another page
  const router = useRouter();

  // Toggle the profile
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  // Handle logout
  const handleLogout = () => {
    // send POST request to API's route /api/auth/logout
    const url = "/api/auth/logout";
    sendRequest(
      {
        url,
        method: "POST",
      },
      () => router.refresh()
    );
  };

  if (!isLoggedIn) return <></>;

  return (
    <div className="relative flex-end">
      <button
        onClick={toggleProfile}
        className="flex w-[24px] h-[24px] items-center space-x-2 focus:outline-none transition-colors duration-200
        text-textSurface dark:text-dark-textSurface hover:text-textSurface-hover dark:hover:text-dark-textSurface-hover"
      >
        <CgProfile className="w-full h-full" />
      </button>

      {/* User Profile info */}
      {isProfileOpen && (
        <div
          className="absolute overflow-hidden right-0 mt-2 w-[320px] sm:w-[400px] rounded-lg shadow-lg pt-2
        bg-surface dark:bg-dark-surface border border-solid border-textSurface dark:border-dark-textSurface"
        >
          <div className="w-full px-4 py-2 text-sm text-textSurface dark:text-dark-textSurface">
            <p className="font-semibold max-w-full break-words">{userName}</p>
            <p className="font-normal max-w-full break-words">{userEmail}</p>
            <p className="font-normal max-w-full break-words">
              {new Date(userDate).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm 
              bg-error dark:bg-dark-error text-textError dark:text-dark-textError hover:bg-error-hover dark:hover:bg-dark-error-hover 
              hover:text-textError-hover hover:dark:text-dark-textError-hover"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
