"use client";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="w-full py-10 md:py-40 flex flex-col justify-center items-center gap-y-3"
    >
      <h1 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-textBackground dark:text-dark-textBackground">
        About
      </h1>
      <h3 className="mt-8 text-lg md:text-base lg:text-lg xl:text-xl font-semibold text-textBackground dark:text-dark-textBackground">
        <strong className="text-primary dark:text-dark-primary tracking-wide">
          Solve my Problem
        </strong>{" "}
        is a SaaS aimed at users who wish to solve problems with significant
        demands on computing resources.
        <br />
        Use any of our available Models to solve various categories of problems.
      </h3>
    </section>
  );
};

export default AboutSection;
