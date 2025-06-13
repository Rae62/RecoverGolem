import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorPage from "./pages/ErrorPage";
import App from "./App";
import Onboarding from "./pages/Onboarding";
import { rootLoader } from "./Loaders/rootLoader";
import UserConnected from "./components/ProtectedRoutes/UserConnected";
import SignUp from "./pages/SignUp";
import BentoContainer from "./components/User/Profile/BentoContainer";
import PublicLayout from "./components/Layout/PublicLayout"; // public side layout (without sidebar)
import Dashboard from "./components/Training/Dashboard";
import WeeklyView from "./components/Training/WeeklyView";
import WorkoutPlanner from "./components/Training/WorkoutPlanner";
import Progress from "./components/Training/ProgressCharts";
import History from "./components/Training/WorkoutHistory";
import WorkoutSession from "./components/Training/WorkoutSession";
import ExerciseView from "./components/Training/ExerciceView";
import AppLayout from "./components/Layout/AppLayout";

// Lazy loaded pages
const SignIn = lazy(() => import("./pages/SignIn"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const UpdateEmail = lazy(() =>
  import("./components/User/Profile/Update/UpdateMail")
);
const ConfirmEmailChange = lazy(() => import("./pages/ConfirmEmailChange"));
const UpdatePassword = lazy(() =>
  import("./components/User/Profile/Update/UpdatePassword")
);
const UpdateProfile = lazy(() =>
  import("./components/User/Profile/Update/UpdateProfile")
);

const withLoader = (Component) => (
  <Suspense
    fallback={<div className="loading loading-spinner loading-lg"></div>}
  >
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // providers + ToastContainer wrapper
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      // Public routes (no sidebar)
      {
        element: <PublicLayout />, // Your public layout wraps public pages
        children: [
          { index: true, element: <Onboarding /> },
          { path: "sign-in", element: withLoader(SignIn) },
          { path: "sign-up", element: withLoader(SignUp) },
          { path: "forgot-password", element: withLoader(ForgotPassword) },
          { path: "reset-password/:token", element: withLoader(ResetPassword) },
          {
            path: "terms-and-conditions",
            element: withLoader(TermsAndConditions),
          },
          // ... more public routes as needed
        ],
      },

      // Protected app routes (with sidebar)
      {
        element: (
          <UserConnected>
            <AppLayout />
          </UserConnected>
        ),
        children: [
          { path: "home", element: withLoader(Home) },
          {
            path: "profile",
            element: withLoader(Profile),
            children: [
              { index: true, element: <BentoContainer /> },
              { path: "update", element: withLoader(UpdateProfile) },
              { path: "change-email", element: withLoader(UpdateEmail) },
              {
                path: "confirm-email",
                element: withLoader(ConfirmEmailChange),
              },
              { path: "change-password", element: withLoader(UpdatePassword) },
            ],
          },
          {
            path: "plans",
            children: [
              { index: true, element: <Dashboard /> }, // default dashboard for plans
              { path: "weekly-view", element: <WeeklyView /> },
              { path: "workout-planner", element: <WorkoutPlanner /> },
              { path: "progress", element: <Progress /> },
              { path: "history", element: <History /> },
              {
                path: "workout-session/:sessionId",
                element: <WorkoutSession />,
              },
              {
                path: "workout-session/:sessionId/exercise/:exerciseId",
                element: <ExerciseView />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
