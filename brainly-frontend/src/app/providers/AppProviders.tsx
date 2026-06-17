import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ErrorBoundary } from "../../components/common/ErrorBoundary";
import { router } from "../router";

export function AppProviders() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: { fontFamily: "inherit" },
        }}
      />
    </ErrorBoundary>
  );
}
