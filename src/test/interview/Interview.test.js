import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { fetchInterview } from "~/services/interviewServices";
import { AuthContext } from "~/contexts/auth/AuthContext";
import { PAGE_SIZE } from "~/data/Constants";
import Interview from "~/pages/interviews/Interview";
import React from "react";

// Mocking the API call
jest.mock("~/services/interviewServices", () => ({
  fetchInterview: jest.fn(),
}));

const mockUser = { role: "ROLE_INTERVIEWER" };

const renderWithAuth = (component, user) =>
  render(
    <AuthContext.Provider value={{ user }}>
      <Router>{component}</Router>
    </AuthContext.Provider>
  );

test("renders Interview component and displays initial UI", async () => {
  fetchInterview.mockResolvedValue({ data: [] });

  renderWithAuth(<Interview />, mockUser);

  expect(screen.getByText("Interview List")).toBeInTheDocument();
  expect(screen.queryByText("Add new")).not.toBeInTheDocument();
});

test("fetches and displays interview data", async () => {
  const mockData = [
    {
      id: 1,
      title: "Backend Developer Interview",
      candidate: {
        id: 1,
        fullName: "John",
      },
      interviewerSet: [
        {
          id: 3,
          name: "Thu Thao",
        },
        {
          id: 1,
          name: "Van Anh",
        },
        {
          id: 2,
          name: "Ngoc Anh",
        },
      ],
      scheduleTimeFrom: [2024, 7, 10, 9, 0],
      scheduleTimeTo: [2024, 7, 10, 10, 0],
      interviewResult: "FAIL",
      interviewStatus: "OPEN",
      note: "Initial interview",
      location: "Conference Room A",
      recruiterDTO: {
        id: 6,
        name: "Kieu Anh",
      },
      meetingId: "meet123",
      position: "BACKEND_DEVELOPER",
    },
  ];
  fetchInterview.mockResolvedValue({ data: mockData });

  renderWithAuth(<Interview />, mockUser);

  await waitFor(() => {
    expect(fetchInterview).toHaveBeenCalledWith(0, PAGE_SIZE);
  });
  await waitFor(() => {
    expect(screen.getByText("Backend Developer Interview")).toBeInTheDocument();
  });
});

test("search functionality filters results", async () => {
  const mockData = [
    {
      id: 1,
      title: "Backend Developer Interview",
      candidate: {
        id: 1,
        fullName: "John",
      },
      interviewerSet: [
        {
          id: 3,
          name: "Thu Thao",
        },
        {
          id: 1,
          name: "Van Anh",
        },
        {
          id: 2,
          name: "Ngoc Anh",
        },
      ],
      scheduleTimeFrom: [2024, 7, 10, 9, 0],
      scheduleTimeTo: [2024, 7, 10, 10, 0],
      interviewResult: "FAIL",
      interviewStatus: "OPEN",
      note: "Initial interview",
      location: "Conference Room A",
      recruiterDTO: {
        id: 6,
        name: "Kieu Anh",
      },
      meetingId: "meet123",
      position: "BACKEND_DEVELOPER",
    },
  ];
  fetchInterview.mockResolvedValue({ data: mockData });

  renderWithAuth(<Interview />, mockUser);

  fireEvent.change(screen.getByPlaceholderText("Search"), {
    target: { value: "Backend Developer Interview" },
  });
  fireEvent.click(screen.getByText("Search"));

  await waitFor(() => {
    expect(screen.getByText("Backend Developer Interview")).toBeInTheDocument();
  });
});

test("role-based rendering shows or hides the 'Add new' button", async () => {
  fetchInterview.mockResolvedValue({ data: [] });

  // Test for ROLE_INTERVIEWER
  renderWithAuth(<Interview />, mockUser);
  expect(screen.queryByText("Add new")).not.toBeInTheDocument();

  // Test for Not ROLE_INTERVIEWER
  const user = { role: "ROLE_MANAGER" }; // Example role

  renderWithAuth(<Interview />, user);
  expect(screen.getByText("Add new")).toBeInTheDocument();
});

test("handles empty interview data", async () => {
  fetchInterview.mockResolvedValue({ data: [] });

  renderWithAuth(<Interview />, mockUser);

  await waitFor(() => {
    expect(
      screen.getByText(
        "No item matches with your search data. Please try again."
      )
    ).toBeInTheDocument();
  });
});
