"use client";

import { useMemo, useState } from "react";

import TransactionModal from "./TransactionModal";
import Spinner from "../Layout/Spinner";

const TransactionsHistory = ({ isLoading, error, transactions }) => {
  const transactionsFiltered = useMemo(
    () =>
      transactions.map((transaction) => {
        return {
          id: transaction.id,
          date: transaction.date,
          time: transaction.time,
          type: transaction.type,
          title: transaction.type === 0 ? "Credits Added" : "Credits Charged",
          amount: transaction.amount,
          problemId:
            transaction.problemId && transaction.problemId.trim() !== ""
              ? transaction.problemId
              : null,
          description: transaction.description,
        };
      }),
    [transactions]
  );

  // Transaction Modal
  const [details, setDetails] = useState({
    show: false,
    id: null,
    date: null,
    time: null,
    type: null,
    title: null,
    amount: null,
    problemId: null,
    description: null,
  });

  /**
   * Show the modal window with transaction details
   * @param {number} idx the index of the transaction whose details will be displayed
   */
  const showModal = (idx) => {
    if (idx < 0 || idx >= transactionsFiltered.length) return;

    setDetails({
      ...transactionsFiltered[idx],
      show: true,
    });
  };

  /**
   * Hide the modal window
   */
  const hideModal = () =>
    setDetails((prev) => {
      return { ...prev, show: false };
    });

  const { creditsAdded, creditsSpent } = useMemo(() => {
    let creditsAdded = 0;
    let creditsSpent = 0;
    for (let transaction of transactionsFiltered) {
      if (transaction.type === 0) creditsAdded += transaction.amount;
      else creditsSpent += transaction.amount;
    }
    return { creditsAdded, creditsSpent };
  }, [transactionsFiltered]);

  const { creditsAddedPer, creditsSpentPer } = useMemo(() => {
    const totalCredits = creditsAdded + creditsSpent;
    if (totalCredits === 0) {
      return { creditsAddedPer: 0.0, creditsSpentPer: 0.0 };
    }

    const creditsAddedPer = Math.min(
      99,
      parseInt((100.0 * creditsAdded) / totalCredits)
    );
    const creditsSpentPer = 100 - creditsAddedPer;
    return { creditsAddedPer, creditsSpentPer };
  }, [creditsAdded, creditsSpent]);

  return (
    <>
      <div className="w-full mt-8 sm:mt-12 md:mt-16 pb-4 flex-grow">
        <h3 className="text-lg md:text-xl lg:text-2xl text-center text-textBackground dark:text-dark-textBackground font-semibold">
          Transactions History
        </h3>

        {isLoading ? (
          <div className="my-2">
            <Spinner />
          </div>
        ) : error && error.trim() !== "" ? (
          <p className="my-2 text-sm md:text-base xl:text-lg font-normal text-center text-error dark:text-dark-error">
            {error}
          </p>
        ) : (
          <>
            <div className="w-full flex justify-between my-2 gap-0 text-textBackground dark:text-dark-textBackground">
              <p>Added {creditsAdded}</p>
              <p>Spent {creditsSpent}</p>
            </div>
            <div className="w-full flex my-2 gap-0">
              <div
                className="h-2 bg-primary dark:bg-dark-primary"
                style={{ flexBasis: `${creditsAddedPer}%` }}
              ></div>
              <div
                className="h-2 bg-secondary dark:bg-dark-secondary"
                style={{ flexBasis: `${creditsSpentPer}%` }}
              ></div>
            </div>

            <table className="min-w-full min-h-fit overflow-x-auto">
              <thead>
                <tr className="bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary">
                  <td className="px-2 py-1 lg:px-4 lg:py-2 text-sm lg:text-base text-left">
                    Date
                  </td>
                  <td className="px-2 py-1 lg:px-4 lg:py-2 text-sm lg:text-base text-left">
                    Time
                  </td>
                  <td className="px-2 py-1 lg:px-4 lg:py-2 text-sm lg:text-base text-left">
                    Description
                  </td>
                  <td className="px-2 py-1 lg:px-4 lg:py-2 text-sm lg:text-base text-left">
                    Amount
                  </td>
                </tr>
              </thead>
              <tbody>
                {transactionsFiltered.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`
                  cursor-pointer border-1 border-solid border-primary-hover transition-colors
                  ${
                    index % 2 === 0
                      ? "bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface"
                      : "bg-surface-hover dark:bg-dark-surface-hover text-textSurface-hover dark:text-dark-textSurface-hover"
                  }
                `}
                    onClick={() => showModal(index)}
                  >
                    <td className="px-2 py-1 lg:px-4 lg:py-2 text-sm lg:text-base text-left max-w-full break-words">
                      {transaction.date}
                    </td>
                    <td className="px-2 py-1 lg:px-4 lg:py-2 text-sm lg:text-base text-left max-w-full break-words">
                      {transaction.time}
                    </td>
                    <td className="px-2 py-1 lg:px-4 lg:py-2 text-sm lg:text-base text-left max-w-full break-words">
                      {transaction.title}
                    </td>
                    <td className="px-2 py-1 lg:px-4 lg:py-2 text-sm lg:text-base text-left max-w-full break-words">
                      {transaction.amount}
                    </td>
                  </tr>
                ))}
                <tr></tr>
              </tbody>
            </table>
          </>
        )}
      </div>
      <TransactionModal {...details} onClose={hideModal} />
    </>
  );
};

export default TransactionsHistory;
