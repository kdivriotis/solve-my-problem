"use client";

import MultiStepForm from "./MultiStepForm";

const CreateSubmissionPage = () => {
  return (
    <section className="px-2 lg:px-3 xl:px-4 py-4 w-full h-full flex flex-col items-center my-auto min-h-fit">
      <h1 className="mb-4 text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-textBackground dark:text-dark-textBackground">
        Create Submission
      </h1>
      <MultiStepForm />
    </section>
  );
};

export default CreateSubmissionPage;
