import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthCtx = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const setAuth = ({ accessToken, user }) => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAuth(data);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    setAuth(data);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Hydrate on refresh if we have a token but no user
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !user) {
      api
        .get("/auth/me")
        .then(({ data }) => data?.user && setUser(data.user))
        .catch(() => {});
    }
  }, [user]);

  return (
    <AuthCtx.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
