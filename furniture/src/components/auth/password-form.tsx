import { Armchair, Eye, EyeOff } from "lucide-react";
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Link } from "react-router";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

const formSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(8, "Password must be at most 8 characters.")
    .regex(/^\d+$/, "Password is invalid."),
  passwordConfirm: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(8, "Password must be at most 8 characters.")
    .regex(/^\d+$/, "Password is invalid."),  
});

export function ConfirmPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        password: "",
        passwordConfirm: "",
      },
    });
  
  function onSubmit(data: z.infer<typeof formSchema>) {
     console.log(data);
      }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form id="password-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              to="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Armchair className="size-6" />
              </div>
              <span className="sr-only">Furniture Shop</span>
            </Link>
            <h1 className="text-xl font-bold">Confirm Password</h1>
            <FieldDescription>
              The password must be at least 8 characters long.
            </FieldDescription>
          </div>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label="Copy"
                      title="Copy"
                      size="icon-xs"
                      onClick={() => setShowPassword((prevState) => !prevState)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="passwordConfirm"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Confirm Password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    type={showPasswordConfirm ? "text" : "password"}
                    required
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label="Copy"
                      title="Copy"
                      size="icon-xs"
                      onClick={() => setShowPasswordConfirm((prevState) => !prevState)}
                    >
                      {showPasswordConfirm ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <Button type="submit">Submit</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
