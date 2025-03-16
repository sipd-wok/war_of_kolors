import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { WelcomeForm } from "@/app/welcome/WelcomeForm";

const Page = async () => {
  const session = await auth();
  if (!session) {
    redirect("/");
  } else if (session.user?.username && session.user?.username !== "") {
    redirect("/MainGame");
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 h-screen grid place-content-center">
      <div>
        <h2 className="text-center">Welcome to</h2>
        <h1 className="text-center text-2xl font-bold animate-charcter">
          WAR OF KOLORS
        </h1>
      </div>

      <div>
        <WelcomeForm session={session} />
      </div>
    </div>
  );
};

export default Page;
