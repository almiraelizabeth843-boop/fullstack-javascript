import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(50, "Password must be 50 characters or less.")
    .regex(/[0-9]/, "Password must contain at least one digit.")
    .regex(/[a-z]/, "Password must contain at least one lowercase character")
    .regex(/[A-Z]/, "Password must contain at least one uppercase character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!token) {
      toast.error("Reset token is missing from the URL.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: data.password,
        token: token,
      });

      if (error) {
        toast.error(error.message || "Failed to reset password");
      } else {
        toast.success("Password reset successful! You can now login.");
        navigate("/login");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className={cn("flex flex-col gap-6 text-center", className)}>
        <h1 className="text-2xl font-bold text-red-600">Invalid Link</h1>
        <p className="text-muted-foreground text-sm">
          This password reset link is invalid or has expired.
        </p>
        <Button asChild variant="outline">
          <Link to="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      id="reset-password-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below.
          </p>
        </div>

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">New Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  required
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="confirmPassword"
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    size="icon-xs"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset password"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
