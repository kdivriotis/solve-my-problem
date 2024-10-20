"use client";

import NextLink from "next/link";
import Image from "next/image";

import heroIcon from "../../../public/solveMyProblem-hero.svg";

const HeroSection = ({ isLoggedIn }) => {
  return (
    <section
      id="hero"
      className="w-full min-h-screen flex flex-col md:flex-row md:justify-between items-center gap-y-5 md:gap-y-0 md:gap-x-2 lg:gap-x-3 xl:gap-x-4"
    >
      <div className="flex flex-col w-full md:flex-grow items-center">
        <h1 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-primary dark:text-dark-primary">
          Solve my Problem
        </h1>
        <h3 className="mt-8 text-lg md:text-base lg:text-lg xl:text-xl font-semibold text-textBackground dark:text-dark-textBackground">
          Unlock the power of Advanced Problem Solving
        </h3>
        <div className="w-full mt-16">
          <NextLink
            href={`${isLoggedIn ? "/dashboard" : "/register"}`}
            prefetch={false}
            className="mx-auto w-fit px-8 py-4 text-xl lg:text-xl rounded-md transition-colors duration-300
          bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover
        text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover font-semibold"
          >
            {isLoggedIn ? "Use the app" : "Get Started"}
          </NextLink>
        </div>
      </div>
      <div className="w-full md:flex-grow flex justify-center items-center mt-10 md:mt-0">
        <Image
          src={heroIcon}
          alt="Illustration"
          priority={true}
          className="object-contain w-full"
          objectFit="contain"
        />
      </div>
    </section>
  );
};

export default HeroSection;
