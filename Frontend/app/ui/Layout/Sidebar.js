"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { AiOutlineLeft } from "react-icons/ai";
import { BiLogOut, BiLogIn } from "react-icons/bi";
import { MdSpaceDashboard } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { TbCoinEuroFilled } from "react-icons/tb";
import { RiServiceFill } from "react-icons/ri";
import { ImUsers } from "react-icons/im";

import SidebarIcon from "./SidebarIcon";
import Footer from "./Footer";

import useHttp from "@/app/hooks/use-http";

const Sidebar = ({ isOpen, toggleIsOpen, isLoggedIn, userIsAdmin }) => {
  const { sendRequest } = useHttp();

  // Define all routes
  const links = [
    {
      path: "/dashboard",
      text: "Dashboard",
      Icon: MdSpaceDashboard,
      loggedIn: true,
    },
    {
      path: "/credits",
      text: "Credits",
      Icon: TbCoinEuroFilled,
      loggedIn: true,
    },
    {
      path: "/submissions",
      text: "Submissions",
      Icon: FaTasks,
      loggedIn: true,
    },
    {
      path: "/login",
      text: "Login",
      Icon: BiLogIn,
      loggedIn: false,
    },
    {
      path: "/healthcheck",
      text: "App Health",
      Icon: RiServiceFill,
      loggedIn: true,
      adminOnly: true,
    },
    {
      path: "/users",
      text: "Users",
      Icon: ImUsers,
      loggedIn: true,
      adminOnly: true,
    },
  ];

  // Get the current route
  const currentRoute = usePathname();
  const isActive = (route) => {
    if (route === "/") return currentRoute === "/";
    return currentRoute.startsWith(route);
  };
  const router = useRouter();

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

  // Define base values of classes
  const toggleOpenBaseClass =
    "w-[32px] h-[32px] p-[4px] absolute top-[36px] right-[-16px] z-10 bg-surface dark:bg-dark-surface text-primary dark:bg-dark-primary border-2 border-solid border-primary dark:border-dark-primary rounded-full cursor-pointer";
  const navBaseClass =
    "flex-grow flex mt-[16px] lg:mt-[24px] py-0 px-[8px] w-full overflow-x-hidden overflow-y-auto transition-all duration-200 ease-in-out";
  const linkBaseClass =
    "flex items-center font-medium cursor-pointer rounded-[10px]";
  const linkOpenClass =
    "p-[8px] text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[16px] gap-x-[2px] lg:gap-x-[4px] xl:gap-x-[6px] 2xl:gap-x-[8px]";
  const linkClosedClass = "p-[4px] lg:p-[8px] text-[14px] lg:text-[16px]";
  const activeLinkClass =
    "bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary";
  const inactiveLinkClass =
    "bg-transparent hover:bg-primary-hover dark:hover:bg-dark-primary-hover text-primary dark:text-dark-primary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover transition-colors duration-300";
  const logoutBtnClass =
    "bg-error text-textError dark:bg-dark-error dark:text-dark-textError hover:bg-error-hover dark:hover:bg-dark-error-hover hover:text-textError-hover hover:dark:text-dark-textError-hover transition-colors duration-300";

  return (
    <>
      {/* Open/Close menu icon */}
      <div
        className={`${toggleOpenBaseClass} ${isOpen ? "" : "rotate-180"}`}
        onClick={() => toggleIsOpen()}
      >
        <AiOutlineLeft className="w-full h-full text-primary dark:text-dark-primary" />
      </div>
      {/* App name */}
      <Link
        href="/"
        className="flex flex-col items-center justify-center space-y-3 rtl:space-x-reverse 
          font-bold font-sans text-lg lg:text-2xl text-primary dark:text-dark-primary
          mt-4 origin-left transition-[display] delay-500 duration-300 ease-in-out"
        prefetch={false}
      >
        <Image
          src="/logo.png"
          alt="Solve My Problem Application Logo"
          priority={true}
          className="object-cover md:object-contain"
          width={isOpen ? 64 : 48}
          height={isOpen ? 64 : 48}
        />
        <span className={isOpen ? "" : "hidden"}>
          Solve my
          <br />
          Problem
        </span>
      </Link>
      {/* Navigations */}
      <nav className={`${navBaseClass} ${isOpen ? "" : "justify-center"}`}>
        <ul
          className={`h-[calc(100%-128px-44px-16px)] lg:h-full ${
            isOpen ? "w-full" : ""
          }`}
        >
          {links
            .filter(
              (link) =>
                (link.loggedIn === null || link.loggedIn === isLoggedIn) &&
                (!link.adminOnly || userIsAdmin)
            )
            .map((link) => (
              <li key={link.text} style={{ marginTop: "4px" }}>
                <Link
                  href={link.path}
                  className={`${linkBaseClass}
                        ${
                          isActive(link.path)
                            ? activeLinkClass
                            : inactiveLinkClass
                        }
                          ${isOpen ? linkOpenClass : linkClosedClass}`}
                  prefetch={false}
                  aria-current={isActive(link.path)}
                >
                  <SidebarIcon Icon={link.Icon} />
                  <span
                    className={`origin-left transition-all ${
                      isOpen ? "" : "hidden"
                    }`}
                  >
                    {link.text}
                  </span>
                </Link>
              </li>
            ))}
          {isLoggedIn && (
            <li
              className={`${linkBaseClass} ${logoutBtnClass}
                      ${isOpen ? linkOpenClass : linkClosedClass}`}
              style={{ marginTop: "8px" }}
              onClick={handleLogout}
            >
              <SidebarIcon Icon={BiLogOut} />

              <span
                className={`origin-left transition-all ${
                  isOpen ? "" : "hidden"
                }`}
              >
                Logout
              </span>
            </li>
          )}
        </ul>
      </nav>
      {isOpen && <Footer />}
    </>
  );
};

export default Sidebar;
