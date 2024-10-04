import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import Login from "~/components/auth/Login";
import { AuthContext } from "../src/contexts/auth/AuthContext"; // Giả sử bạn định nghĩa AuthContext ở đây

test("check IMS recruitment", () => {
  const mockAuthContextValue = {
    loginContext: jest.fn(),
    user: null,
  };

  render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContextValue}>
        <Login />
      </AuthContext.Provider>
    </BrowserRouter>
  );

  const headingElement = screen.getByText(/IMS Recruitment/i);
  expect(headingElement).toBeInTheDocument();
});
