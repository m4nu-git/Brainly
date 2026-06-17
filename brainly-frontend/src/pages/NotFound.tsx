import { Link } from "react-router-dom";
import { Brain } from "lucide-react";
import { ROUTES } from "../constants/routes";
import { Button } from "../components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
          <Brain className="h-10 w-10 text-violet-400" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-slate-200">404</h1>
          <h2 className="text-xl font-semibold text-slate-900 -mt-2">Page Not Found</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <Button asChild>
          <Link to={ROUTES.DASHBOARD}>Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
