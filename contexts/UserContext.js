import React, { createContext, useState } from "react";
export const UserContext = createContext();

// creating a user context and provider
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
