import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { signInSchema, type SignInFormValues } from "../../schemas/auth.schema";
import { authService } from "../../services/api/auth.service";
import { useAuthStore } from "../../store/auth.store";
import { ROUTES } from "../../constants/routes";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import type { ApiError } from "../../types/api.types";

export function SignInForm() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = async (values: SignInFormValues) => {
    try {
      const { data } = await authService.signIn(values);
      login(data.token, data.username);
      toast.success(`Welcome back, ${data.username}!`);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const status = error.response?.status;
      if (status === 401) {
        setError("password", { message: "Invalid username or password" });
      } else if (status === 422 && error.response?.data.errors) {
        error.response.data.errors.forEach(({ field, message }) => {
          setError(field as keyof SignInFormValues, { message });
        });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field label="Username" error={errors.username?.message} required>
        <Input
          {...register("username")}
          placeholder="johndoe"
          autoComplete="username"
          error={errors.username?.message}
        />
      </Field>

      <Field label="Password" error={errors.password?.message} required>
        <Input
          {...register("password")}
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
        />
      </Field>

      <Button type="submit" loading={isSubmitting} size="lg" className="mt-2 w-full">
        Sign In
      </Button>
    </form>
  );
}
