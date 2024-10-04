import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("user")) ||
      {}
  );
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token") || ""
  );

  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    const localToken = localStorage.getItem("token");

    if (localUser && localToken) {
      sessionStorage.setItem("user", localUser);
      sessionStorage.setItem("token", localToken);
      setUser(JSON.parse(localUser));
      setToken(localToken);
    }
  }, []);

  useEffect(() => {
    if (user?.status === "Active") {
      if (remember === true) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", token);
      }
    }
  }, [user, token, remember]);

  const loginContext = async (userInfo, token, isRemember) => {
    if (userInfo.status !== "Active") {
      toast.error("User was banned!");
    }
    setUser({
      id: userInfo.id,
      name: userInfo.fullName,
      email: userInfo.email,
      role: userInfo.role,
      status: userInfo.status,
    });
    setToken(token);
    setRemember(isRemember);
    if (user?.status === "Active") {
      if (remember) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
        sessionStorage.setItem("token", token);
      }
    }
  };

  const logout = () => {
    sessionStorage.removeItem("user", JSON.stringify(user));
    sessionStorage.removeItem("token", JSON.stringify(token));
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
  };

  const isAuthenticated = () => {
    return (
      JSON.parse(sessionStorage.getItem("user")) !== null ||
      JSON.parse(localStorage.getItem("user")) !== null
    );
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loginContext, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
