import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { GuestSignIn } from "@/components/auth/GuestSignIn";

export default async function Home() {
  const session = await auth();
  if (session) redirect("/welcome");

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 h-screen grid place-content-center">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
      <GuestSignIn />
    </div>
  );
}
