import { Link } from "react-router-dom";
import { SignInForm } from "../components/forms/SignInForm";
import { ROUTES } from "../constants/routes";

export function SignIn() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-500">Sign in to your account to continue</p>
      </div>

      <SignInForm />

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link to={ROUTES.SIGN_UP} className="text-violet-600 font-medium hover:text-violet-700">
          Create one
        </Link>
      </p>
    </>
  );
}
