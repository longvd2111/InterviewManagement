import React from "react";
import "~/assets/css/Main.css";
import { Outlet } from "react-router-dom";

function LoginLayOut() {
  return (
    <div className="container1">
      <Outlet></Outlet>
    </div>
  );
}

export default LoginLayOut;
