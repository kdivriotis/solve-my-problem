"use client";

import { useState } from "react";

import DemoModal from "./DemoModal";

const DemoSection = () => {
  const [showDemo, setShowDemo] = useState(false);

  const showDemoModal = () => setShowDemo(true);
  const hideDemoModal = () => setShowDemo(false);

  return (
    <section
      id="demo"
      className="w-full py-10 md:py-40 flex flex-col justify-center items-center gap-y-3"
    >
      <h1 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-primary dark:text-dark-primary">
        Demo Presentation
      </h1>
      <h3 className="mt-8 text-lg md:text-base lg:text-lg xl:text-xl font-semibold text-textBackground dark:text-dark-textBackground">
        Click on the button below to watch a quick presentation of our service's
        main features
      </h3>
      <div className="w-full mt-10 flex justify-center">
        <button
          className="mx-auto w-fit px-8 py-4 text-xl lg:text-xl rounded-md transition-colors duration-300
          bg-secondary dark:bg-dark-secondary hover:bg-secondary-hover dark:hover:bg-dark-secondary-hover
        text-textSecondary dark:text-dark-textSecondary hover:text-textSecondary-hover dark:hover:text-dark-textSecondary-hover font-semibold"
          onClick={showDemoModal}
        >
          Show Presentation
        </button>
      </div>
      <DemoModal show={showDemo} onClose={hideDemoModal} />
    </section>
  );
};

export default DemoSection;
