import React, { useContext } from "react";
import { AuthContext } from "~/contexts/auth/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { userRole } from "~/data/Constants";

const Authorization = ({ children }) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const ROLE_INTERVIEWER = userRole.find(
    (role) => role.value === "ROLE_INTERVIEWER"
  );
  const ROLE_ADMIN = userRole.find((role) => role.value === "ROLE_ADMIN");

  if (!isAuthenticated()) {
    if (location.pathname !== "/login" && location.pathname !== "/forgot-pw") {
      return <Navigate to="/login" replace />;
    }
  } else {
    if (location.pathname === "/login" || location.pathname === "/forgot-pw") {
      return <Navigate to="/" replace />;
    }
  }

  if (user) {
    if (
      user.role === ROLE_INTERVIEWER.value &&
      [
        "/offer",
        "/offer/",
        "/offer/add",
        "/offer/edit",
        "/candidate/add",
        "/candidate/edit",
        "/job/add",
        "/job/edit",
        "/interview/add",
        "/interview/edit",
      ].some((path) => location.pathname.startsWith(path))
    ) {
      return <Navigate to="/no-permission" replace />;
    }

    if (
      user.role !== ROLE_ADMIN.value &&
      ["/user", "/user/", "/user/add", "/user/edit"].some((path) =>
        location.pathname.startsWith(path)
      )
    ) {
      return <Navigate to="/no-permission" replace />;
    }
  }

  return <>{children}</>;
};

export default Authorization;
