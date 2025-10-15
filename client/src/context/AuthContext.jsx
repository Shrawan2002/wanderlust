// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // get current user from backend (session-based)
  const refreshUser = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/me");
      setUser(res.data.user || null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line
  }, []);

  const login = async (credentials) => {
    const res = await axiosClient.post("/login", credentials);
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    await axiosClient.post("/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
