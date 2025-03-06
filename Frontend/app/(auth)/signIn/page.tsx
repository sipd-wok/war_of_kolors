import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/MainGame");

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 h-screen grid place-content-center">
    </div>
  );
};

export default Page;
