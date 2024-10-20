"use server";

import { headers } from "next/headers";

import Layout from "@/app/ui/Layout/Layout";
import CreateSubmissionPage from "@/app/ui/CreateSubmission/CreateSubmissionPage";

const CreateSubmission = () => {
  const headerList = headers();

  const userNameEncoded = headerList.get("x-user-name");
  const userEmailEncoded = headerList.get("x-user-email");
  const userIsAdminEncoded = headerList.get("x-user-isAdmin");
  const userDateEncoded = headerList.get("x-user-date");

  const userName = userNameEncoded
    ? Buffer.from(userNameEncoded, "base64").toString("utf-8")
    : "";
  const userEmail = userEmailEncoded
    ? Buffer.from(userEmailEncoded, "base64").toString("utf-8")
    : "";
  const userIsAdmin = userIsAdminEncoded
    ? Buffer.from(userIsAdminEncoded, "base64").toString("utf-8") === "true"
    : false;
  const userDate = userDateEncoded
    ? Buffer.from(userDateEncoded, "base64").toString("utf-8")
    : "";

  const isLoggedIn = !!userName && !!userEmail && !!userDate;

  return (
    <Layout
      isLoggedIn={isLoggedIn}
      userName={userName}
      userEmail={userEmail}
      userIsAdmin={userIsAdmin}
      userDate={userDate}
    >
      <CreateSubmissionPage />
    </Layout>
  );
};

export default CreateSubmission;
