// src/components/NoPermission.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Result } from "antd";

const NoPermission = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <Result
      status="403"
      title="403"
      subTitle="You are not permiss to access this page."
      extra={
        <Button type="primary" onClick={handleBackHome}>
          Quay lại trang chủ
        </Button>
      }
    />
  );
};

export default NoPermission;
