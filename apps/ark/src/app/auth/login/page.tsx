"use client";

import login from "./login";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icons/google-icon";

export default function LoginPage() {
  const [state, formAction] = useFormState(login, { error: "" });

  return (
    <form action={formAction}>
      <div className="h-screen flex items-center justify-center flex-col gap-5">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={`input input-bordered w-full max-w-xs ${
            state?.error && "input-error"
          }`}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={`input input-bordered w-full max-w-xs ${
            state?.error && "input-error"
          }`}
        />
        {state?.error}
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <div className="flex">
          <Button
            onClick={() =>
              (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/signin/google`)
            }
          >
            <GoogleIcon /> Login with Email
          </Button>
        </div>
      </div>
    </form>
  );
}
