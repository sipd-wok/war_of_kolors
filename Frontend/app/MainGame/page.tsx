import GameClient from "./GameClient";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const MainGame = async () => {
  const session = await auth();
  if (!session) redirect("/signIn");
  console.log(session);

  return <GameClient username={session.user?.username as string} />;
};

export default MainGame;
