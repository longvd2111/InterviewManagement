import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchInterview from "~/pages/interviews/SearchInterview";
import { fetchAllUser } from "~/services/userServices";

// Mocking the API call
jest.mock("~/services/userServices", () => ({
  fetchAllUser: jest.fn(),
}));

jest.mock("~/data/Constants", () => ({
  InterviewStatus: [
    { value: "1", label: "Open" },
    { value: "2", label: "Closed" },
  ],
  userRole: [
    { value: "ROLE_RECRUITER", label: "Recruiter" },
    { value: "ROLE_INTERVIEWER", label: "Interviewer" },
  ],
}));

const mockUsers = [
  { fullName: "Recruiter 1", userRole: "ROLE_RECRUITER" },
  { fullName: "Recruiter 2", userRole: "ROLE_RECRUITER" },
];

describe("SearchInterview Component", () => {
  beforeEach(() => {
    fetchAllUser.mockResolvedValue({ data: mockUsers });
  });

  test("renders SearchInterview component and handles search", async () => {
    const handleSearch = jest.fn();
    render(<SearchInterview onSearch={handleSearch} />);
  
    // Check if elements are rendered
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    
    // Use getByLabelText if the comboboxes have associated labels
    expect(screen.getByLabelText(/Recruiter/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  
    // Wait for the recruiters to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText("Recruiter 1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Recruiter 2")).toBeInTheDocument();
    });
  
    // Simulate input change and search button click
    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Recruiter/i), {
      target: { value: "Recruiter 1" },
    });
    fireEvent.change(screen.getByLabelText(/Status/i), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByText("Search"));
  
    // Validate that the onSearch callback is called with correct parameters
    expect(handleSearch).toHaveBeenCalledWith("John", "1", "Recruiter 1");
  });

  test("handles Enter key press for search", async () => {
    const handleSearch = jest.fn();
    render(<SearchInterview onSearch={handleSearch} />);
  
    // Wait for the recruiters to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText("Recruiter 1")).toBeInTheDocument();
    });
  
    // Simulate input change and Enter key press
    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "John" },
    });
    
    // Simulate the Enter key press
    fireEvent.keyPress(screen.getByPlaceholderText("Search"), {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
  
    // Validate that the onSearch callback is called with correct parameters
    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith("John", 0, "");
    });
  });
  

  test("handles no recruiters available", async () => {
    fetchAllUser.mockResolvedValue({ data: [] });

    render(<SearchInterview onSearch={jest.fn()} />);

    // Wait for the recruiters to be fetched and rendered
    await waitFor(() => {
      expect(screen.queryByText("Recruiter 1")).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText("Recruiter 2")).not.toBeInTheDocument();
    });
  });

  test("displays error when fetchAllUser fails", async () => {
    const error = new Error("API error");
    fetchAllUser.mockRejectedValue(error);
    console.error = jest.fn(); // Mock console.error to avoid cluttering the test output

    render(<SearchInterview onSearch={jest.fn()} />);

    // Check if error message is logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching interviewers:",
        error
      );
    });
  });
});
