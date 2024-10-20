//Dashboard.js

"use client";
import { useState } from "react";
import PasswordChangeForm from "./PasswordChangeForm"; // Import the form component
import useHttp from "@/app/hooks/use-http";
import React from "react";
import SubmissionTrendsChart from "./SubmissionTrendsChart";
import DashboardInfo from "./DashboardInfo";

const Dashboard = ({ userEmail, userName, userIsAdmin, userDate }) => {
  const { isLoading, error, sendRequest } = useHttp();
  const [isPasswordFormVisible, setIsPasswordFormVisible] = useState(false);
  const togglePasswordForm = () => {
    setIsPasswordFormVisible((prev) => !prev);
  };

  const changePasswordHandler = (password) => {
    // in case of no data or empty data, return
    if (!password || password.trim() === "") return;

    // send POST request to API's route /api/user/change-password
    const url = "/api/user/change-password";
    sendRequest(
      {
        url,
        method: "POST",
        data: { password },
      },
      () => setIsPasswordFormVisible(false)
    );
  };

  return (
    <section className="px-2 lg:px-3 xl:px-4 py-4 w-full h-full flex flex-col items-center my-auto min-h-fit">
      <h1 className="mb-4 text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-textBackground dark:text-dark-textBackground">
        User Dashboard
      </h1>

      <DashboardInfo name={userName} email={userEmail} date={userDate} />

      <div className="my-4 p-4 w-full bg-surface dark:bg-dark-surface rounded-md">
        <h2 className="text-base md:text-lg xl:text-xl text-center font-semibold mb-6 text-textSurface dark:text-dark-textSurface">
          Problem Submission Trends
        </h2>
        <SubmissionTrendsChart />
      </div>

      <div className="my-4 pb-4 flex flex-col items-center">
        <button
          className="flex-grow py-2 px-4 rounded transition-colors duration-300 font-bold focus:outline-none focus:shadow-outline 
          cursor-pointer disabled:cursor-not-allowed 
          bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary
          hover:bg-primary-hover dark:hover:bg-dark-primary-hover hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover 
          disabled:bg-disabled dark:disabled:bg-dark-disabled disabled:text-textDisabled dark:disabled:text-dark-textDisabled"
          onClick={togglePasswordForm}
        >
          {isPasswordFormVisible ? "Cancel" : "Change Password"}
        </button>
      </div>

      {isPasswordFormVisible && (
        <div className="my-4 pb-4">
          <PasswordChangeForm
            isLoading={isLoading}
            error={error}
            onSubmit={changePasswordHandler}
          />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
