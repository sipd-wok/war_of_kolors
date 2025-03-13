import GameClient from "./GameClient";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const MainGame = async () => {
  const session = await auth();
  if (!session) {
    redirect("/");
  } else {
    console.log("Session found at /mainGame");
    console.log(session);
    console.log("user_id: " + session.user?.user_id);
  }

  // Pass both username and userID to the client component
  return (
    <GameClient
      username={session.user?.username as string}
      user_id={session.user?.user_id as string}
    />
  );
};

export default MainGame;
