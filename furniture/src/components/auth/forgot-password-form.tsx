import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Link } from "react-router";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: window.location.origin + "/reset-password",
      });

      if (error) {
        toast.error(error.message || "Failed to send reset email");
      } else {
        setIsSubmitted(true);
        toast.success("Reset email sent! Please check your inbox.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className={cn("flex flex-col gap-6 text-center", className)}>
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-muted-foreground text-sm">
          We've sent a password reset link to <strong>{form.getValues("email")}</strong>.
        </p>
        <Button asChild variant="outline">
          <Link to="/login">Return to login</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      id="forgot-password-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Forgot password?</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <Input
                {...field}
                id="email"
                aria-invalid={fieldState.invalid}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Remember your password?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Back to login
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
