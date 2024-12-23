"use client";

import { createContext, useContext } from "react";

type UserContextType = {
  userId: string;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ userId }}>{children}</UserContext.Provider>
  );
}
