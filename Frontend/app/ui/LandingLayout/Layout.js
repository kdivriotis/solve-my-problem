"use client";

import ThemeToggle from "../ThemeToggle";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
const Layout = ({
  children,
  isLoggedIn,
  userName,
  userEmail,
  userDate,
  hideLinks = false,
}) => {

  return (
    <GoogleOAuthProvider clientId={ process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} > 
    
    <div className="flex flex-col min-h-screen">
      <ThemeToggle />
      <Navbar
        isLoggedIn={isLoggedIn}
        userName={userName}
        userEmail={userEmail}
        userDate={userDate}
        hideLinks={hideLinks}
      />
      <main
        className="flex-grow pt-[80px] md:pt-[79px] xl:pt-[82px] pb-[16px] px-[16px] lg:px-0 mx-auto
      w-full lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl"
      >
        {children}
      </main>
      <Footer />
    </div>
    </GoogleOAuthProvider>
  );
};

export default Layout;
