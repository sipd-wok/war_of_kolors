import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GuestSignIn } from "@/components/auth/GuestSignIn";
import { MetaMaskSignIn } from "@/components/auth/MetaMaskSignIn";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/MainGame");

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 h-screen grid place-content-center">
      <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

      <MetaMaskSignIn />
      <GuestSignIn />
    </div>
  );
};

export default Page;
