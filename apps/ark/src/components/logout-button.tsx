"use client";

import { logout } from "@/app/auth/logout";
import { Button } from "./ui/button";

export default function LogoutButton() {
  return <Button onClick={() => logout()}>Log Out</Button>;
}
