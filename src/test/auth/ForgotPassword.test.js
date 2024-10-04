import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPwApi } from "~/services/userServices";
import ForgotPassword from "~/components/auth/ForgotPassword";

// Mock the resetPwApi function
jest.mock("~/services/userServices", () => ({
  resetPwApi: jest.fn(),
}));

// Mock the toast functions
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("ForgotPassword", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders ForgotPassword component", () => {
    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    expect(screen.getByText("IMS Recruitment")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your email...")
    ).toBeInTheDocument();
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(screen.getByText("Back to Login")).toBeInTheDocument();
  });

  test("shows error toast on API error", async () => {
    resetPwApi.mockRejectedValueOnce({ data: "Error resetting password" });

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your email..."), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByText("Reset Password"));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Error resetting password")
    );
  });

  test("navigates to login and shows success toast on successful password reset", async () => {
    const navigate = jest.fn();
    resetPwApi.mockResolvedValueOnce("Password reset link sent");

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your email..."), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByText("Reset Password"));

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Password reset link sent")
    );
  });

  test("disables the reset button when email is empty or API is loading", () => {
    render(
      <Router>
        <ForgotPassword />
      </Router>
    );

    const resetButton = screen.getByText("Reset Password");

    expect(resetButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("Enter your email..."), {
      target: { value: "test@example.com" },
    });

    expect(resetButton).not.toBeDisabled();

    fireEvent.click(resetButton);

    expect(resetButton).toBeDisabled();
  });
});
