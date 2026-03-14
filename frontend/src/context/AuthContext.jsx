import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();


export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem("token"); 
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await API.get("/auth/me", { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setUser(res.data.user);
    } catch (err) {
      console.error("Auth Fetch Error:", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    const res = await API.post("/auth/login", credentials);
    localStorage.setItem("token", res.data.token);
    await fetchUser(); // Reuse the fetch logic
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
