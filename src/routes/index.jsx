import React from "react";
import { createBrowserRouter } from "react-router-dom";
import NoPermission from "~/components/auth/NoPermission";
import Authorization from "~/contexts/auth/Authorization";

import DefaultLayout from "~/layouts/DefaultLayout";
import LoginLayOut from "~/layouts/LoginLayout";
import Login from "~/components/auth/Login";
import EditInterview from "~/pages/interviews/EditInterview";
import ForgotPassword from "~/components/auth/ForgotPassword";
import SubmitInterview from "~/pages/interviews/SubmitInterview";
const Home = React.lazy(() => import("~/components/common/Home"));

// Interview
const Interview = React.lazy(() => import("~/pages/interviews/Interview"));
const DetailInterview = React.lazy(() =>
  import("~/pages/interviews/DetailInterview")
);
const CreateInterview = React.lazy(() =>
  import("~/pages/interviews/CreateInterview")
);

// Candidate
const Candidate = React.lazy(() => import("~/pages/candidates/Candidate"));
const CandidateDetail = React.lazy(() =>
  import("~/pages/candidates/CandidateDetail")
);
const CreateCandidate = React.lazy(() =>
  import("~/pages/candidates/CreateCandidate")
);
const EditCandidate = React.lazy(() =>
  import("~/pages/candidates/EditCandidate")
);

// Job
const Job = React.lazy(() => import("~/pages/jobs/Job"));
const JobDetail = React.lazy(() => import("~/pages/jobs/JobDetail"));
const JobEdit = React.lazy(() => import("~/pages/jobs/JobEdit"));
const CreateForm = React.lazy(() => import("~/pages/jobs/JobForm"));

// Offer
const Offer = React.lazy(() => import("~/pages/offers/Offer"));
const DetailOffer = React.lazy(() => import("~/pages/offers/DetailOffer"));
const EditOffer = React.lazy(() => import("~/pages/offers/EditOffer"));
const CreateOffer = React.lazy(() => import("~/pages/offers/CreateOffer"));

// User
const User = React.lazy(() => import("~/pages/users/User"));
const DetailUser = React.lazy(() => import("~/pages/users/DetailUser"));
const UpdateUser = React.lazy(() => import("~/pages/users/UpdateUser"));
const CreateUser = React.lazy(() => import("~/pages/users/CreateUser"));

const router = createBrowserRouter([
  {
    path: "/no-permission",
    element: <NoPermission />,
  },
  {
    path: "/login",
    element: (
      <Authorization>
        <LoginLayOut />
      </Authorization>
    ),
    children: [{ path: "", element: <Login /> }],
  },
  {
    path: "/forgot-pw",
    element: (
      <Authorization>
        <LoginLayOut />
      </Authorization>
    ),
    children: [{ path: "", element: <ForgotPassword /> }],
  },
  {
    path: "interview",
    element: (
      <Authorization>
        <DefaultLayout />
      </Authorization>
    ),
    children: [
      {
        path: "",
        element: <Interview />,
      },
      {
        path: ":id",
        element: <DetailInterview />,
      },
      {
        path: "add",
        element: <CreateInterview />,
      },
      {
        path: "edit/:id",
        element: <EditInterview />,
      },
      {
        path: "submit/:id",
        element: <SubmitInterview />,
      },
    ],
  },
  {
    path: "candidate",
    element: (
      <Authorization>
        <DefaultLayout />
      </Authorization>
    ),
    children: [
      {
        path: "",
        element: <Candidate />,
      },
      {
        path: ":id",
        element: <CandidateDetail />,
      },
      {
        path: "add",
        element: <CreateCandidate />,
      },
      {
        path: "edit/:id",
        element: <EditCandidate />,
      },
    ],
  },
  {
    path: "job",
    element: (
      <Authorization>
        <DefaultLayout />
      </Authorization>
    ),
    children: [
      {
        path: "",
        element: <Job></Job>,
      },
      {
        path: ":id",
        element: <JobDetail />,
      },
      {
        path: "add",
        element: <CreateForm />,
      },
      {
        path: "edit/:id",
        element: <JobEdit />,
      },
    ],
  },
  {
    path: "offer",
    element: (
      <Authorization>
        <DefaultLayout />
      </Authorization>
    ),
    children: [
      {
        path: "",
        element: <Offer></Offer>,
      },
      {
        path: ":id",
        element: <DetailOffer />,
      },
      {
        path: "add",
        element: <CreateOffer />,
      },
      {
        path: "edit/:id",
        element: <EditOffer />,
      },
    ],
  },
  {
    path: "user",
    element: (
      <Authorization>
        <DefaultLayout />
      </Authorization>
    ),
    children: [
      {
        path: "",
        element: <User />,
      },
      {
        path: ":id",
        element: <DetailUser />,
      },
      {
        path: "add",
        element: <CreateUser />,
      },
      {
        path: "edit/:id",
        element: <UpdateUser />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <Authorization>
        <DefaultLayout />
      </Authorization>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
    ],
  },
]);

export default router;
