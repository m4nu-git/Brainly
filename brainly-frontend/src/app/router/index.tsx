import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Spinner } from "../../components/ui/spinner";
import { ProtectedRoute } from "../../components/common/ProtectedRoute";
import { PublicRoute } from "../../components/common/PublicRoute";
import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ROUTES } from "../../constants/routes";

const SignIn = lazy(() => import("../../pages/SignIn").then((m) => ({ default: m.SignIn })));
const SignUp = lazy(() => import("../../pages/SignUp").then((m) => ({ default: m.SignUp })));
const Dashboard = lazy(() => import("../../pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Tags = lazy(() => import("../../pages/Tags").then((m) => ({ default: m.Tags })));
const SharedBrain = lazy(() => import("../../pages/SharedBrain").then((m) => ({ default: m.SharedBrain })));
const NotFound = lazy(() => import("../../pages/NotFound").then((m) => ({ default: m.NotFound })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Spinner size="lg" />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTES.SIGN_IN,
            element: (
              <Suspense fallback={<PageLoader />}>
                <SignIn />
              </Suspense>
            ),
          },
          {
            path: ROUTES.SIGN_UP,
            element: (
              <Suspense fallback={<PageLoader />}>
                <SignUp />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: (
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            ),
          },
          {
            path: ROUTES.TAGS,
            element: (
              <Suspense fallback={<PageLoader />}>
                <Tags />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  {
    path: ROUTES.SHARED_BRAIN,
    element: (
      <Suspense fallback={<PageLoader />}>
        <SharedBrain />
      </Suspense>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.NOT_FOUND} replace />,
  },
]);
