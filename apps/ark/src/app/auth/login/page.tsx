"use client";

import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icons/google-icon";

export default function LoginPage() {
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-5">
      <div className="flex">
        <Button
          onClick={() =>
            (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/signin/google`)
          }
        >
          <GoogleIcon className="fill-background" /> Login with Email
        </Button>
      </div>
    </div>
  );
}
