import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  function isTokenValid() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return false;
    }
    return jwtDecode(accessToken).exp > new Date() / 1000;
  }

  function getUserFromToken() {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return {};
    }
    const { sub, name, email } = jwtDecode(accessToken);
    return {
      id: sub,
      name: name,
      email: email,
    };
  }

  const [isAuthenticated, setIsAuthenticated] = useState(() => isTokenValid());
  const [user, setUser] = useState(() => getUserFromToken());

  function authenticate() {
    setIsAuthenticated(isTokenValid());
    setUser(getUserFromToken());
  }

  function revoke() {
    setIsAuthenticated(false);
    setUser({});
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        user: user,
        authenticate: authenticate,
        revoke: revoke,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
