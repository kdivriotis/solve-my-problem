"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import useHttp from "@/app/hooks/use-http";
import CreditsDashboard from "./CreditsDashboard";
import SelectUserDropdown from "./SelectUserDropdown";
import CreditsForm from "./CreditsForm";
import TransactionsHistory from "./TransactionsHistory";

const CreditsPage = ({ isAdmin }) => {
  // List of all available users - only fetch once and only if user is admin
  const {
    isLoading: isLoadingUsers,
    error: errorUsers,
    sendRequest: sendRequestUsers,
  } = useHttp();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (!isAdmin) return;

    // send GET request to API's route /api/user/all
    const url = "/api/user/all";
    sendRequestUsers(
      {
        url,
        method: "GET",
      },
      ({ users }) => setUsers(users)
    );
  }, []);

  // Manage query parameters
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const userId = searchParams.get("userId");
  const [selectedUser, setSelectedUser] = useState(userId || ""); // Initialize with userId from query

  useEffect(() => {
    if (userId) setSelectedUser(userId);
  }, [userId]);

  const handleUserChange = (newUserId) => {
    setSelectedUser(newUserId);
    if (newUserId === "") router.push(pathname);
    else router.push(`${pathname}?${createQueryString("userId", newUserId)}`);
  };

  // Selected view - 0 = Credits form, 1 = Transactions form
  const [selectedView, setSelectedView] = useState(0);

  // Request to get credits balance
  const {
    isLoading: isLoadingCredits,
    error: errorCredits,
    sendRequest: sendRequestCredits,
  } = useHttp();
  const [credits, setCredits] = useState(0);

  const getCredits = () => {
    // send GET request to API's route /api/credits/:userId?
    const url = `/api/credits/${selectedUser}`;
    sendRequestCredits(
      {
        url,
        method: "GET",
      },
      ({ credits }) => setCredits(credits)
    );
  };

  // Request to get transactions
  const {
    isLoading: isLoadingTransactions,
    error: errorTransactions,
    sendRequest: sendRequestTransactions,
  } = useHttp();
  const [transactions, setTransactions] = useState([]);

  const getTransactions = () => {
    // send GET request to API's route /api/transactions/:userId?
    const url = `/api/transactions/${selectedUser}`;
    sendRequestTransactions(
      {
        url,
        method: "GET",
      },
      ({ transactions }) =>
        setTransactions(() =>
          transactions.map((transaction) => {
            return {
              ...transaction,
              date: new Date(transaction.date).toLocaleDateString(),
              time: new Date(transaction.date).toLocaleTimeString(),
            };
          })
        )
    );
  };

  useEffect(() => {
    getCredits();
    getTransactions();
  }, [selectedUser]);

  const onCreditsUpdated = (credits) => {
    if (!credits || isNaN(credits)) return;
    setCredits(credits);
    getCredits();
    getTransactions();
  };

  const selectViewTabBaseClass =
    "px-2 py-1 sm:px-4 sm:py-2 border-2 transition-colors duration-300 border-textPrimary dark:border-dark-textPrimary text-sm md:text-base xl:text-lg";
  const selectViewTabActiveClass =
    "bg-primary dark:bg-dark-primary text-textPrimary dark:text-dark-textPrimary";
  const selectViewTabInactiveClass = `bg-surface dark:bg-dark-surface text-textSurface dark:text-dark-textSurface
    hover:bg-primary-hover dark:hover:bg-dark-primary-hover hover:border-textPrimary-hover dark:hover:border-dark-textPrimary-hover hover:text-textPrimary-hover dark:hover:text-dark-textPrimary-hover`;

  return (
    <section className="px-2 lg:px-3 xl:px-4 py-4 w-full h-full flex flex-col items-center my-auto min-h-fit">
      <h1 className="mb-4 text-xl md:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-textBackground dark:text-dark-textBackground">
        Credits & Transactions
      </h1>
      <CreditsDashboard
        isLoadingCredits={isLoadingCredits}
        errorCredits={errorCredits}
        credits={credits}
        isLoadingTransactions={isLoadingTransactions}
        errorTransactions={errorTransactions}
        transactions={transactions}
      />
      <SelectUserDropdown
        isActive={isAdmin}
        isLoading={isLoadingUsers}
        error={errorUsers}
        users={users}
        selected={selectedUser}
        onSelectionChange={handleUserChange}
      />
      <div className="mt-2 lg:mt-4 mx-auto grid grid-cols-2 justify-center gap-0">
        <button
          className={`${selectViewTabBaseClass} rounded-l-md ${
            selectedView === 0
              ? selectViewTabActiveClass
              : selectViewTabInactiveClass
          }`}
          onClick={() => setSelectedView(0)}
        >
          Add Credits
        </button>

        <button
          className={`${selectViewTabBaseClass} rounded-r-md border-l-0 ${
            selectedView === 1
              ? selectViewTabActiveClass
              : selectViewTabInactiveClass
          }`}
          onClick={() => setSelectedView(1)}
        >
          Transaction History
        </button>
      </div>
      {selectedView == 0 ? (
        <CreditsForm
          isAdmin={isAdmin}
          userId={selectedUser}
          balance={credits}
          onSuccess={onCreditsUpdated}
        />
      ) : (
        <TransactionsHistory
          isLoading={isLoadingTransactions}
          error={errorTransactions}
          transactions={transactions}
        />
      )}
    </section>
  );
};

export default CreditsPage;
