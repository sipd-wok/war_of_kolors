"use client";

import { SessionProvider } from "next-auth/react";
import GlobalContext from "@/context/GlobalContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Default values for the global context
  const globalContextValue = {
    user_id: "",
    userName: "",
    character: "",
    setUser_id: () => {},
    setUserName: () => {},
    setCharacter: () => {},
  };

  return (
    <SessionProvider>
      <GlobalContext.Provider value={globalContextValue}>
        {children}
      </GlobalContext.Provider>
    </SessionProvider>
  );
}
