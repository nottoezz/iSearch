import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthCtx = createContext(null);
// small hook to read auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  // seed user from localstorage on first load
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  // store token + user and sync state/localstorage
  const setAuth = ({ accessToken, user }) => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (user) {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  // login then persist auth
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAuth(data);
  };

  // register then persist auth
  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    setAuth(data);
  };

  // best-effort logout; always clear local state
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* ignore network errors */
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  // on refresh: if token exists but user missing, fetch profile
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
