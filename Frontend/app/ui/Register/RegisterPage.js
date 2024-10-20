"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import useHttp from "@/app/hooks/use-http";
import RegisterForm from "./RegisterForm";
import GoogleLoginButton from "../GoogleLoginButton";

const RegisterPage = () => {
  const router = useRouter();
  const { isLoading, error, sendRequest } = useHttp();

  const registerHandler = (name, email, password) => {
    // in case of no data or empty data, return
    if (
      !name ||
      !email ||
      !password ||
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === ""
    )
      return;

    // send POST request to API's route /api/auth/register
    const url = "/api/auth/register";
    sendRequest(
      {
        url,
        method: "POST",
        data: { name, email, password },
      },
      () => router.replace("/login")
    );
  };

  // Google sign-up
  const googleRegisterHandler = async (response) => {
    // Extract the ID token from the response
    const accessToken = response.access_token; // Get the access token

    // send POST request to API's route /api/auth/login/google
    const url = "/api/user/auth/google";
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
        {/* Register Form */}
        <RegisterForm
          isLoading={isLoading}
          error={error}
          onSubmit={registerHandler}
        />

        {/* Google Login */}
        <GoogleLoginButton isLoading={isLoading} onLogin={googleRegisterHandler} />

        {/* Link to register page */}
        <div className="w-full my-2 flex justify-center items-center gap-x-2">
          <p className="text-textBackground dark:text-dark-textBackground">
            Already have an account?
          </p>
          <Link
            href="/login"
            className="transition-colors duration-300 text-primary dark:text-dark-primary hover:text-primary-hover dark:hover:text-dark-primary-hover"
            prefetch={false}
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
