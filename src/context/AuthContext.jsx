/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

const getStoredAuth = () => {
  if (typeof window === "undefined") {
    return { user: null, token: null };
  }

  const token = window.localStorage.getItem("token");
  const savedUser = window.localStorage.getItem("user");

  if (!token) {
    window.localStorage.removeItem("user");
    return { user: null, token: null };
  }

  if (!savedUser) {
    return { user: null, token };
  }

  try {
    return {
      user: JSON.parse(savedUser),
      token,
    };
  } catch {
    window.localStorage.removeItem("user");
    return { user: null, token };
  }
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(getStoredAuth);
  const { user, token } = authState;
  const loading = false;

  const persistAuth = (userData, authToken) => {
    setAuthState({ user: userData, token: authToken });
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const register = async (formData) => {
    const res = await API.post("/auth/register", formData);

    const userData = {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
    };

    persistAuth(userData, res.data.token);

    return userData;
  };

  const login = async (formData) => {
    const res = await API.post("/auth/login", formData);

    const userData = {
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
    };

    persistAuth(userData, res.data.token);

    return userData;
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cartItems");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
