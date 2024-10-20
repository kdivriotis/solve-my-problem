"use client";

const PricingSection = () => {
  return (
    <section
      id="pricing"
      className="w-full py-10 md:py-40 flex flex-col justify-center items-center gap-y-3"
    >
      <h1 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-textBackground dark:text-dark-textBackground">
        Pricing
      </h1>
      <h3 className="mt-8 text-lg md:text-base lg:text-lg xl:text-xl font-semibold text-textBackground dark:text-dark-textBackground">
        The pricing policy of our service is rather simple -{"  "}
        <strong className="text-primary dark:text-dark-primary tracking-wide">
          Pay as you go
        </strong>
        <br />
        <br />
        This means that you will{" "}
        <strong className="text-primary dark:text-dark-primary tracking-wide">
          only
        </strong>{" "}
        be charged for the problems that you solve, depending on the{" "}
        <strong className="tracking-wide border-b border-solid border-textBackground dark:border-dark-textBackground">
          model
        </strong>{" "}
        you use and the{" "}
        <strong className="tracking-wide border-b border-solid border-textBackground dark:border-dark-textBackground">
          complexity
        </strong>{" "}
        of your problem.
      </h3>
    </section>
  );
};

export default PricingSection;
