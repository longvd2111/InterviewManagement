// DefaultLayout.js
import Header from "~/components/common/Header";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "~/components/common/Navbar";
import { useContext, useState } from "react";
import { AuthContext } from "~/contexts/auth/AuthContext";
import { userRole } from "~/data/Constants";

function DefaultLayout() {
  const location = useLocation();
  const shouldShowNavbar = location.pathname !== "/login";
  const { user } = useContext(AuthContext);

  const [isExpanded, setIsExpanded] = useState(false);
  const role = userRole.find((r) => r.value === user?.role)?.value;

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  return (
    <div className="container1">
      {shouldShowNavbar && (
        <Navbar
          role={role}
          isExpanded={isExpanded}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      )}
      <div className={`main-content ${isExpanded ? "expanded" : ""}`}>
        {shouldShowNavbar && <Header />}
        <div className="main-content__son">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
