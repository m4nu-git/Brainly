import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { signUpSchema, type SignUpFormValues } from "../../schemas/auth.schema";
import { authService } from "../../services/api/auth.service";
import { ROUTES } from "../../constants/routes";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import type { ApiError } from "../../types/api.types";

export function SignUpForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      await authService.signUp(values);
      toast.success("Account created! Please sign in.");
      navigate(ROUTES.SIGN_IN);
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      const status = error.response?.status;
      if (status === 409) {
        setError("username", { message: "Username already taken" });
      } else if (status === 422 && error.response?.data.errors) {
        error.response.data.errors.forEach(({ field, message }) => {
          setError(field as keyof SignUpFormValues, { message });
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
          placeholder="Min 8 chars, uppercase, number, special"
          autoComplete="new-password"
          error={errors.password?.message}
        />
      </Field>

      <Button type="submit" loading={isSubmitting} size="lg" className="mt-2 w-full">
        Create Account
      </Button>
    </form>
  );
}
