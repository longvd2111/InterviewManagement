import React from "react";
import { Col, Nav, Row } from "react-bootstrap";
import {
  FaHome,
  FaUser,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaUserCircle,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import "~/assets/css/Navbar.css";

const Sidebar = ({ isExpanded, handleMouseEnter, handleMouseLeave, role }) => {
  const location = useLocation();

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`sidebar ${isExpanded ? "expanded" : ""}`}
    >
      <Row>
        <Col sm={6}>
          <div className="logo">DEV</div>
        </Col>
        <Col sm={6}>
          <div className="logo-text">IMS</div>
        </Col>
      </Row>
      <Nav className="flex-column">
        <Link
          to="/"
          className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
        >
          <FaHome size={24} className="nav-icon" />
          <span className="nav-label">Home</span>
        </Link>
        <Link
          to="/candidate"
          className={`nav-link ${
            location.pathname.startsWith("/candidate") ? "active" : ""
          }`}
        >
          <FaUser size={24} className="nav-icon" />
          <span className="nav-label">Candidate</span>
        </Link>
        <Link
          to="/job"
          className={`nav-link ${
            location.pathname.startsWith("/job") ? "active" : ""
          }`}
        >
          <FaBriefcase size={24} className="nav-icon" />
          <span className="nav-label">Job</span>
        </Link>
        <Link
          to="/interview"
          className={`nav-link ${
            location.pathname.startsWith("/interview") ? "active" : ""
          }`}
        >
          <FaFileAlt size={24} className="nav-icon" />
          <span className="nav-label">Interview</span>
        </Link>
        {role !== "ROLE_INTERVIEWER" && (
          <>
            <Link
              to="/offer"
              className={`nav-link ${
                location.pathname.startsWith("/offer") ? "active" : ""
              }`}
            >
              <FaCheckCircle size={24} className="nav-icon" />
              <span className="nav-label">Offer</span>
            </Link>
          </>
        )}
        {role === "ROLE_ADMIN" && (
          <>
            <Link
              to="/user"
              className={`nav-link ${
                location.pathname.startsWith("/user") ? "active" : ""
              }`}
            >
              <FaUserCircle size={24} className="nav-icon" />
              <span className="nav-label">User</span>
            </Link>
          </>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;
