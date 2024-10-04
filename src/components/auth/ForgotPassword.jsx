import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import { resetPwApi } from "~/services/userServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate("");
  const [loadingApi, setLoadingApi] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    setLoadingApi(true);
    try {
      let res = await resetPwApi(email);

      if (res) {
        navigate("/login");
        toast.success(res);
      }
    } catch (error) {
      toast.error(error.data);
    }
    setLoadingApi(false);
  };

  return (
    <div className="login__container-father">
      <div className="login-container" style={{ height: "300px" }}>
        <div
          style={{
            fontSize: "2rem",
            color: "MenuText",
            fontWeight: "600",
            marginBottom: "20px",
          }}
        >
          IMS Recruitment
        </div>
        <div
          style={{ fontSize: "1.4rem", color: "GrayText", fontWeight: "400" }}
        >
          Forgot Password?
        </div>
        <div style={{ fontSize: "1rem", marginBottom: "8px" }}>
          You can reset your password here
        </div>
        <div>
          {/* <label htmlFor="username">Username</label> */}
          <input
            type="text"
            id="email"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Row style={{ justifyContent: "center" }}>
          <Col
            md={6}
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <button
              style={{ width: "100%" }}
              className={
                email
                  ? "button-form active"
                  : "button-form button-form--primary"
              }
              disabled={!email || loadingApi}
              onClick={() => handleForgotPassword()}
            >
              {loadingApi && (
                <FontAwesomeIcon icon={faSpinner} className="spinner fa-spin" />
              )}
              Reset Password
            </button>
          </Col>
          <Col
            md={6}
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 0,
            }}
          >
            <button
              style={{ width: "100%" }}
              className="button-form"
              onClick={() => navigate(-1)}
            >
              Back to Login
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ForgotPassword;
