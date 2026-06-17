import { Link } from "react-router-dom";
import { SignUpForm } from "../components/forms/SignUpForm";
import { ROUTES } from "../constants/routes";

export function SignUp() {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Create your brain</h2>
        <p className="mt-1 text-sm text-slate-500">
          Start organizing your knowledge in one place
        </p>
      </div>

      <SignUpForm />

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to={ROUTES.SIGN_IN} className="text-violet-600 font-medium hover:text-violet-700">
          Sign in
        </Link>
      </p>
    </>
  );
}
