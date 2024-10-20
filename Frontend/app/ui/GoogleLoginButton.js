"use client";

import { useGoogleLogin } from "@react-oauth/google";

import { FcGoogle } from "react-icons/fc";

const GoogleLoginButton = ({ isLoading, onLogin }) => {
  const login = useGoogleLogin({
    onSuccess: onLogin,
    onFailure: (error) => console.error("Google login error", error),
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  });

  return (
    <div className="w-full my-2 flex justify-center">
      <button
        className="py-2 px-4 rounded flex justify-center items-center gap-x-2 transition-colors duration-300 font-bold
          focus:outline-none focus:shadow-outline cursor-pointer disabled:cursor-not-allowed
        bg-secondary dark:bg-dark-secondary hover:bg-secondary-hover dark:hover:bg-dark-secondary-hover
        text-textSecondary dark:text-dark-textSecondary hover:text-textSecondary-hover dark:hover:text-dark-textSecondary-hover
        disabled:bg-disabled dark:disabled:bg-dark-disabled disabled:text-textDisabled dark:disabled:text-dark-textDisabled"
        onClick={login}
        disabled={isLoading}
      >
        <div>
          <FcGoogle className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px]" />
        </div>
        <span>Continue with Google</span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;
