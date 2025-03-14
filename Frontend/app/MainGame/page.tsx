import GameClient from "./GameClient";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const MainGame = async () => {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  return <GameClient />;
};

export default MainGame;
