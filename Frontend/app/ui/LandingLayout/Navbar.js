"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import NextLink from "next/link";

import { Link } from "react-scroll";

import ProfileInfo from "./ProfileInfo";

const Navbar = ({ isLoggedIn, userName, userEmail, userDate, hideLinks }) => {
  // Define all sections
  const sections = [
    {
      to: "about",
      text: "About",
    },
    {
      to: "models",
      text: "Models",
    },
    {
      to: "pricing",
      text: "Pricing",
    },
    {
      to: "demo",
      text: "Demo",
    },
  ];
  const [offsetValue, setOffsetValue] = useState(-50);

  useEffect(() => {
    // Function to calculate offset for middle of the screen
    const calculateOffset = () => {
      const navbarHeight = document.querySelector("nav").offsetHeight;
      const viewportHeight = window.innerHeight;
      setOffsetValue(-(viewportHeight / 2) + navbarHeight / 2);
    };

    // Initial calculation
    calculateOffset();

    // Recalculate on resize
    window.addEventListener("resize", calculateOffset);
    return () => window.removeEventListener("resize", calculateOffset);
  }, []);

  // Toggle the navbar
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleNavbar = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-10 
    bg-surface dark:bg-dark-surface border-solid border-b-2 border-surface-hover dark:border-dark-surface-hover"
    >
      <div className="flex-wrap md:flex-nowrap w-full p-4 px-4 lg:px-0 lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl flex items-center justify-between mx-auto">
        {/* App logo */}
        <NextLink
          href="/"
          className="flex self-start items-center space-x-3 rtl:space-x-reverse 
          text-textSurface dark:text-dark-textSurface font-semibold text-xl"
          prefetch={false}
        >
          <Image
            src="/logo.png"
            alt="Solve My Problem Application Logo"
            priority={true}
            className="object-cover md:object-contain"
            width={32}
            height={32}
          />
          Solve my Problem
        </NextLink>

        {/* Navigation links - Large view */}
        {!hideLinks && (
          <div className="hidden md:block flex-grow w-auto">
            <ul
              className="font-medium flex rtl:space-x-reverse
              bg-transparent mt-0 p-0 flex-row justify-center gap-x-3 xl:gap-x-4 border-0
            text-textSurface dark:text-dark-textSurface hover:text-textSurface-hover dark:hover:text-dark-textSurface-hover"
            >
              {sections.map((section) => (
                <li key={section.text}>
                  <Link
                    to={section.to}
                    smooth={true}
                    duration={400}
                    spy={true}
                    offset={offsetValue}
                    activeClass="text-accent dark:text-dark-accent hover:text-accent dark:hover:text-dark-accent"
                    className="block rounded p-0 transition-colors duration-300 cursor-pointer"
                  >
                    {section.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navbar actions */}
        {!hideLinks && (
          <div className="self-end flex items-center gap-x-2">
            {/* Main call to action */}
            <NextLink
              href={`${isLoggedIn ? "/dashboard" : "/register"}`}
              prefetch={false}
              className="hidden md:block w-fit text-sm xl:text-base px-2 py-1 rounded-md transition-colors duration-300
          bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover
        text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover font-semibold"
            >
              {isLoggedIn ? "Open App" : "Get Started"}
            </NextLink>

            {/* Secondary call to action */}
            {!isLoggedIn && (
              <NextLink
                href="/login"
                prefetch={false}
                className="hidden md:block w-fit text-sm xl:text-base px-2 py-1 rounded-md transition-colors duration-300 font-semibold
          border border-textSurface dark:border-dark-textSurface hover:border-textSurface-hover dark:hover:border-dark-textSurface-hover
          bg-transparent text-textSurface dark:text-dark-textSurface hover:text-textSurface-hover dark:hover:text-dark-textSurface-hover"
              >
                Login
              </NextLink>
            )}

            {/* Toggle profile info icon - Only if user is logged in */}
            <ProfileInfo
              isLoggedIn={isLoggedIn}
              userName={userName}
              userEmail={userEmail}
              userDate={userDate}
            />

            {/* Show hide navigation options - Only on small screens (md: width<768px) */}
            <button
              data-collapse-toggle="navbar-default"
              onClick={toggleNavbar}
              type="button"
              className="md:hidden inline-flex items-center p-2 w-[32px] h-[32px] justify-center 
          text-sm rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200
          text-textSurface dark:text-dark-textSurface 
          hover:text-textSurface-hover dark:hover:text-dark-textSurface-hover 
          focus:ring-textSurface-hover dark:focus:text-dark-textSurface-hover"
              aria-controls="navbar-default"
              aria-expanded={isExpanded}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-[24px] h-[24px]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation links - Small view */}
        {!hideLinks && (
          <div
            className={`${isExpanded ? "block" : "hidden"} md:hidden w-full`}
            id="navbar-default"
          >
            <ul
              className="font-medium flex rounded-lg rtl:space-x-reverse
              flex-col mt-4 p-4 border bg-surface-hover border-textSurface
            text-textSurface dark:text-dark-textSurface hover:text-textSurface-hover dark:hover:text-dark-textSurface-hover"
            >
              {sections.map((section) => (
                <li key={section.text}>
                  <Link
                    to={section.to}
                    smooth={true}
                    duration={400}
                    spy={true}
                    offset={offsetValue}
                    activeClass="text-accent dark:text-dark-accent hover:text-accent dark:hover:text-dark-accent"
                    className="block rounded p-2 transition-colors duration-300 cursor-pointer text-center"
                  >
                    {section.text}
                  </Link>
                </li>
              ))}
              {/* Main call to action */}
              <li>
                <NextLink
                  href={`${isLoggedIn ? "/dashboard" : "/register"}`}
                  prefetch={false}
                  className="w-full text-base mt-2 p-2 transition-colors duration-300 text-center font-semibold
          bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover
        text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover"
                >
                  {isLoggedIn ? "Open App" : "Get Started"}
                </NextLink>
              </li>
              {/* Secondary call to action */}
              {!isLoggedIn && (
                <li>
                  <NextLink
                    href="/login"
                    prefetch={false}
                    className="w-full text-base mt-2 p-2 transition-colors duration-300 text-center font-semibold
          border border-textSurface dark:border-dark-textSurface hover:border-textSurface-hover dark:hover:border-dark-textSurface-hover
          bg-transparent text-textSurface dark:text-dark-textSurface hover:text-textSurface-hover dark:hover:text-dark-textSurface-hover"
                  >
                    Login
                  </NextLink>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
