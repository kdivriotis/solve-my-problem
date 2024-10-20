"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import useHttp from "@/app/hooks/use-http";

import { ProblemStatus } from "@/app/lib/problemStatus";

import Spinner from "../Layout/Spinner";
import ProblemInfoTitle from "./ProblemInfoTitle";
import ProblemInfoSubtitle from "./ProblemInfoSubtitle";
import ProblemMetadata from "./ProblemMetadata";
import ProblemInputData from "./ProblemInputData";
import ProblemInputForm from "./ProblemInputForm";

const ViewProblemInfoPage = ({ id }) => {
  const { isLoading, error, sendRequest } = useHttp();
  const [info, setInfo] = useState(null);

  const getSubmissionInfo = () => {
    // send GET request to API's route /api/submissions/display/info/:id
    const url = `/api/submissions/display/info/${id}`;
    sendRequest(
      {
        url,
        method: "GET",
      },
      ({ problem }) => {
        setInfo(problem);
      }
    );
  };

  useEffect(getSubmissionInfo, []);

  return (
    <section className="px-2 lg:px-3 xl:px-4 py-4 w-full h-full flex flex-col items-center my-auto min-h-fit">
      <h1 className="mb-4 text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-textBackground dark:text-dark-textBackground">
        Submission Info
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
      ) : !info ? (
        <>
          <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-error dark:text-dark-error">
            No information found for the selected problem
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
          <ProblemInfoTitle
            name={info.name}
            creator={info.creator}
            date={info.submittedOn}
          />
          <ProblemInfoSubtitle
            submissionId={id}
            modelId={info.model.id}
            modelName={info.model.name}
            status={info.status}
          />
          <ProblemMetadata metadata={info.metadata} />
          <ProblemInputData
            submissionId={id}
            date={info.inputData.submittedOn}
            dataJson={info.inputData.data}
            error={info.inputData.error}
          />
          {info.status === ProblemStatus.NOT_READY ||
          info.status === ProblemStatus.READY ? (
            <ProblemInputForm submissionId={id} onRefresh={getSubmissionInfo} />
          ) : (
            <></>
          )}
        </>
      )}
    </section>
  );
};

export default ViewProblemInfoPage;
