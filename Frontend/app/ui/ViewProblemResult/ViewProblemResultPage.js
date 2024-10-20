"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import useHttp from "@/app/hooks/use-http";

import Spinner from "../Layout/Spinner";
import ProblemResultTitle from "./ProblemResultTitle";
import ProblemResultSubtitle from "./ProblemResultSubtitle";
import ProblemResultData from "./ProblemResultData";

const ViewProblemResultPage = ({ id }) => {
  const { isLoading, error, sendRequest } = useHttp();
  const [result, setResult] = useState(null);

  const getSubmissionResult = () => {
    // send GET request to API's route /api/submissions/run/results/:id
    const url = `/api/submissions/run/results/${id}`;
    sendRequest(
      {
        url,
        method: "GET",
      },
      ({ result }) => {
        setResult(result);
      }
    );
  };

  useEffect(getSubmissionResult, []);

  return (
    <section className="px-2 lg:px-3 xl:px-4 py-4 w-full h-full flex flex-col items-center my-auto min-h-fit">
      <h1 className="mb-4 text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-textBackground dark:text-dark-textBackground">
        Submission Result
      </h1>

      {isLoading ? (
        <div className="w-full my-2">
          <Spinner />
        </div>
      ) : error && error.trim() !== "" ? (
        <>
          <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-error dark:text-dark-error">
            {error}
          </p>

          <Link
            href="/submissions"
            prefetch={false}
            className="mt-4 mx-auto w-fit px-4 py-2 text-base lg:text-lg rounded-md transition-colors duration-300
          bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover
        text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover font-semibold"
          >
            Back to Submissions
          </Link>
        </>
      ) : !result ? (
        <>
          <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-error dark:text-dark-error">
            No result found for the selected problem
          </p>

          <Link
            href="/submissions"
            prefetch={false}
            className="mt-4 mx-auto w-fit px-4 py-2 text-base lg:text-lg rounded-md transition-colors duration-300
          bg-primary dark:bg-dark-primary hover:bg-primary-hover dark:hover:bg-dark-primary-hover
        text-textPrimary dark:text-dark-textPrimary hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover font-semibold"
          >
            Back to Submissions
          </Link>
        </>
      ) : (
        <>
          <ProblemResultTitle name={result.name} date={result.executedOn} />
          <ProblemResultSubtitle
            executionTime={result.executionTime}
            cost={result.cost}
            model={result.model}
          />
          <ProblemResultData
            submissionId={id}
            modelId={result.model.id}
            dataJson={result.data}
            cost={result.cost}
            isAvailable={result.isAvailable}
            onRefresh={getSubmissionResult}
          />
        </>
      )}
    </section>
  );
};

export default ViewProblemResultPage;
