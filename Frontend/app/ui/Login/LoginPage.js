"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import useHttp from "@/app/hooks/use-http";
import LoginForm from "./LoginForm";
import GoogleLoginButton from "../GoogleLoginButton";

const LoginPage = () => {
  const router = useRouter();
  const { isLoading, error, sendRequest } = useHttp();

  // Email-Password login
  const loginHandler = (email, password) => {
    // in case of no data or empty data, return
    if (!email || !password || email.trim() === "" || password.trim() === "")
      return;

    // send POST request to API's route /api/auth/login
    const url = "/api/auth/login";
    sendRequest(
      {
        url,
        method: "POST",
        data: { email, password },
      },
      () => {
        router.replace("/");
        router.refresh();
      }
    );
  };

  // Google login
  const googleLoginHandler = async (response) => {
    // Extract the ID token from the response
    const accessToken = response.access_token; // Get the access token

    // send POST request to API's route /api/auth/login/google
    const url = "/api/auth/login/google";
    sendRequest(
      {
        url,
        method: "POST",
        data: { accessToken },
      },
      () => {
        router.replace("/");
        router.refresh();
      }
    );
  };

  return (
    <section
      id="content"
      className="p-4 w-full h-full flex flex-col items-center justify-center my-auto"
    >
      <div className="w-full flex flex-col gap-3 justify-center max-w-screen-md lg:max-w-screen-md">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="Solve My Problem Application Logo"
            priority={true}
            className="object-cover md:object-contain"
            width={64}
            height={64}
          />
        </div>

        {/* Login Form */}
        <LoginForm
          isLoading={isLoading}
          error={error}
          onSubmit={loginHandler}
        />

        {/* Google Login */}
        <GoogleLoginButton isLoading={isLoading} onLogin={googleLoginHandler} />

        {/* Link to register page */}
        <div className="w-full my-2 flex justify-center items-center gap-x-2">
          <p className="text-textBackground dark:text-dark-textBackground">
            Don't have an account yet?
          </p>
          <Link
            href="/register"
            className="transition-colors duration-300 text-primary dark:text-dark-primary hover:text-primary-hover dark:hover:text-dark-primary-hover"
            prefetch={false}
          >
            Sign up
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
