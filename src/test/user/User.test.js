import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import UsersList from "~/pages/users/UserList";

// Mock users list
const mockUsersList = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    userRole: "ROLE_ADMIN",
    userStatus: "ACTIVE",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "987-654-3210",
    userRole: "ROLE_RECRUITER",
    userStatus: "DEACTIVATED",
  },
];

// Mock navigate function
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("UsersList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders users list correctly", () => {
    render(
      <Router>
        <UsersList usersList={mockUsersList} />
      </Router>
    );

    // Check if user data is rendered
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText("123-456-7890")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane.smith@example.com")).toBeInTheDocument();
    expect(screen.getByText("987-654-3210")).toBeInTheDocument();
    expect(screen.getByText("Recruiter")).toBeInTheDocument();
    expect(screen.getByText("Deactivated")).toBeInTheDocument();
  });

  test("navigates to user view page on eye icon click", () => {
    render(
      <Router>
        <UsersList usersList={mockUsersList} />
      </Router>
    );

    // Simulate clicking the view icon for the first user
    const viewIcon = screen.getByTestId("view-icon-1");
    fireEvent.click(viewIcon);

    // Check if navigate function was called with the correct URL
    expect(mockNavigate).toHaveBeenCalledWith("/user/1");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  test("navigates to user edit page on edit icon click", () => {
    render(
      <Router>
        <UsersList usersList={mockUsersList} />
      </Router>
    );

    // Simulate clicking the edit icon for the first user
    const editIcon = screen.getByTestId("edit-icon-1");
    fireEvent.click(editIcon);

    // Check if navigate function was called with the correct URL
    expect(mockNavigate).toHaveBeenCalledWith("/user/edit/1");
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
