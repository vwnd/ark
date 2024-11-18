import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>
        <p>Ark</p>
        <Link href="/auth/login">Login</Link>
      </header>
      <main className="flex flex-col items-center">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="model-file">Model File</Label>
          <Input id="model-file" type="file" />
        </div>
      </main>
    </div>
  );
}
