import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "~/contexts/auth/AuthContext";
import "~/assets/css/Login.css"; // Import the CSS file
import { Row, Col } from "react-bootstrap";
import { loginApi } from "~/services/userServices";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import { getMessage } from "~/data/Messages";

const Login = () => {
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginContext } = useContext(AuthContext);
  const [loadingApi, setLoadingApi] = useState(false);
  const passwordRef = useRef(null);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setLoadingApi(true);

    try {
      const res = await loginApi(username.trim(), password);
      if (res && res?.token) {
        loginContext(res?.user, res?.token, remember);
        toast.success(getMessage("ME042"));
        navigate("/");
      }
    } catch (error) {
      if (error && error.data) {
        toast.error(error.data);
      } else {
        toast.error("An unknown error occurred.");
      }
      setTimeout(() => {
        setLoadingApi(false);
      }, 500);
      return;
    }

    setLoadingApi(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.target.id === "username") {
        passwordRef.current.focus();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <div className="login__container-father">
      <div className="login-container">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="logo-login">DEV</div>
          <h1 style={{ paddingTop: "9px", marginLeft: "10px" }}>
            IMS Recruitment
          </h1>
        </div>
        <div>
          <input
            data-testid="username"
            type="text"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div style={{ position: "relative" }}>
          <input
            type={isShowPassword ? "text" : "password"}
            id="password"
            data-testid="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            ref={passwordRef}
            style={{ paddingRight: "40px" }} // Add padding to make room for the icon
          />
          <FontAwesomeIcon
            data-testid="iconeyepassword"
            style={{
              position: "absolute",
              right: "10px",
              top: "37%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
            icon={isShowPassword ? faEye : faEyeSlash}
            onClick={() => setIsShowPassword(!isShowPassword)}
          />
        </div>

        <Row>
          <Col
            xs={6}
            className="text-left"
            style={{ display: "flex", alignItems: "center" }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{
                  margin: "4px 0 0", // Chỉnh lại margin để đảm bảo khoảng cách hợp lý
                  width: "15px",
                  height: "15px",
                }}
              />
              <span style={{ marginLeft: "4px" }}>Remember me</span>
            </label>
          </Col>
          <Col xs={6} className="text-right">
            <Link to={"/forgot-pw"} className="forgot-password">
              Forgot password?
            </Link>
          </Col>
        </Row>
        <Row style={{ justifyContent: "center", marginTop: "16px" }}>
          <button
            data-testid="login-button"
            style={{ width: "200px" }}
            className={
              username && password ? "button-form active" : "button-form"
            }
            disabled={!username || !password || loadingApi}
            onClick={() => handleLogin()}
          >
            {loadingApi && (
              <FontAwesomeIcon icon={faSpinner} className="spinner fa-spin" />
            )}
            &nbsp; Login
          </button>
        </Row>
      </div>
    </div>
  );
};

export default Login;
