import { Outlet } from "react-router-dom";
import { Brain } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-violet-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-200">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Brainly</h1>
          <p className="text-sm text-slate-500">Your second brain, organized.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
