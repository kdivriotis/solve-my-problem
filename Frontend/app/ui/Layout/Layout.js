"use client";

import { useState, useEffect } from "react";

import Sidebar from "./Sidebar";
import ThemeToggle from "../ThemeToggle";

const Layout = ({
  children,
  isLoggedIn,
  userName,
  userEmail,
  userIsAdmin,
  userDate,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const savedSidebarState = localStorage.getItem("isSidebarOpen");
    return savedSidebarState !== null ? JSON.parse(savedSidebarState) : true;
  });

  // Save the sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isSidebarOpen", JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const sidebarBaseClass =
    "pt-3 h-full relative flex flex-col justify-start bg-surface dark:bg-dark-surface rounded-tr-[10px] rounded-br-[10px] transition-[width] duration-300 ease-in-out";
  const mainBaseClass =
    "h-screen py-3 pr-[16px] pl-[16px] overflow-x-hidden overflow-y-scroll flex-grow";

  return (
    <div className="flex flex-nowrap overflow-hidden h-screen w-full bg-background dark:bg-dark-background">
      <ThemeToggle />
      <aside
        className={`${sidebarBaseClass} ${
          isSidebarOpen ? "w-[144px] lg:w-[288px]" : "w-[80px]"
        }`}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          toggleIsOpen={() => setIsSidebarOpen((prev) => !prev)}
          isLoggedIn={isLoggedIn}
          userName={userName}
          userEmail={userEmail}
          userIsAdmin={userIsAdmin}
          userDate={userDate}
        />
      </aside>
      <main
        className={`${mainBaseClass} ${
          isSidebarOpen
            ? "w-[calc(100%-144px)] lg:w-[calc(100%-288px)]"
            : "w-[calc(100%-80px)]"
        }`}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
