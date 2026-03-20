import { Armchair } from "lucide-react";
import { Link } from "react-router";
import { OTPForm } from "@/components/auth/otp-form";

export default function OTPPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-xs flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 self-center font-medium hover:opacity-80 transition-opacity">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Armchair className="size-4" />
          </div>
          Furniture Shop
        </Link>
        <OTPForm />
      </div>
    </div>
  );
}
