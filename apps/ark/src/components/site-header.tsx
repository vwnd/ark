import { currentUser } from "@/app/auth/current-user";
import UserNav from "./user-nav";
import { Button } from "./ui/button";
import Link from "next/link";

export default async function SiteHeader() {
  const user = await currentUser();

  return (
    <div className="flex h-12 items-center px-4 justify-between border-b">
      <span className="font-bold leading-tight text-lg text-red-600">ark</span>
      {user ? (
        <UserNav user={user} />
      ) : (
        <Link href="/auth/login">
          <Button>Login</Button>
        </Link>
      )}
    </div>
  );
}
