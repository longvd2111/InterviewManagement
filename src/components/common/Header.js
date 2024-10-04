import React, { useContext, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { LuUser2 } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "~/contexts/auth/AuthContext";

import { CheckUrl, userRole } from "~/data/Constants";
import "~/assets/css/Header.css";
import { Modal } from "react-bootstrap";

export default function Header() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const name = user ? user.name : "Guest";
  const role = user
    ? userRole.find((ur) => ur.value === user.role)?.label
    : "Unknown";
  const listPage = Object.values(CheckUrl);

  const currentPage = listPage.find((p) => location.pathname.includes(p.link));

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <div className="header-container">
      <div className="header-left">
        <h1 className="title">{currentPage?.name}</h1>
      </div>

      <div className="header-right">
        <ul className="header-right-main">
          <li className="user__info">
            <h5 className="user__info-name">{name}</h5>
            <p className="user__info-position">{role}</p>
          </li>
          <li className="user__setting">
            <div className="user__setting-icon">
              <FaUserCircle className="user__setting-icon-son" />
            </div>
            <ul className="user__setting-dropdown">
              <li className="dropdown__item">
                <Link to={"/"} className="dropdown__item-link">
                  <LuUser2 className="dropdown__item-icon" />
                  User management
                </Link>
              </li>
              <li className="dropdown__item">
                <Link to={"/"} className="dropdown__item-link">
                  <IoSettingsOutline className="dropdown__item-icon" />
                  My account
                </Link>
              </li>
              <li className="dropdown__item">
                <span className="dropdown__item-link" onClick={handleShow}>
                  <MdOutlineLogout className="dropdown__item-icon" />
                  LogOut
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <Modal show={show} onHide={handleClose} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Log out</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer style={{ justifyContent: "space-evenly" }}>
          <button
            onClick={handleClose}
            className="button-form button-form--danger"
          >
            Cancel
          </button>
          <button
            onClick={() => handleLogout()}
            className="button-form button-form--primary"
          >
            OK
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
