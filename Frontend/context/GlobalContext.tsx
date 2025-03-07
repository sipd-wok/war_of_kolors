"use client";

import { createContext, useContext, ReactNode, useState } from "react";

interface GlobalContextProps {
  user_id: string;
  userName: string;
  character: string;
  setUser_id: (id: string) => void;
  setUserName: (name: string) => void;
  setCharacter: (char: string) => void;
}

// Create context with default values
const GlobalContext = createContext<GlobalContextProps>({
  user_id: "",
  userName: "",
  character: "",
  setUser_id: () => {},
  setUserName: () => {},
  setCharacter: () => {},
});

// Add provider component
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user_id, setUser_id] = useState("");
  const [userName, setUserName] = useState("");
  const [character, setCharacter] = useState("");

  return (
    <GlobalContext.Provider
      value={{
        user_id,
        userName,
        character,
        setUser_id: setUser_id,
        setUserName,
        setCharacter,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Export as default
export default GlobalContext;

// Export the hook as a named export
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within a GlobalContext.Provider");
  }
  return context;
};
