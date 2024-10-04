import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import InterviewTable from "~/pages/interviews/InterviewTable"; // Cập nhật đường dẫn nếu cần

// Mock constants and utils
jest.mock("~/data/Constants", () => ({
  InterviewResult: [
    { value: "PASS", label: "Pass" },
    { value: "FAIL", label: "Fail" },
  ],
  InterviewStatus: [
    { value: "OPEN", label: "Open" },
    { value: "INVITED", label: "Invited" },
  ],
  optionsPosition: [
    { value: "BACKEND_DEVELOPER", label: "Backend Developer" },
    { value: "HR", label: "HR" },
  ],
}));

jest.mock("~/utils/Validate", () => ({
  convertToDay: () => "2024-07-10",
  convertToHour: () => "09:00",
}));

// Mock useNavigate hook
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

// Mock data
const mockData = [
  {
    id: 1,
    title: "Backend Developer Interview",
    candidate: { id: 1, fullName: "John" },
    interviewerSet: [
      { id: 3, name: "Thu Thao" },
      { id: 1, name: "Van Anh" },
      { id: 2, name: "Ngoc Anh" },
    ],
    scheduleTimeFrom: [2024, 7, 10, 9, 0],
    scheduleTimeTo: [2024, 7, 10, 10, 0],
    interviewResult: "FAIL",
    interviewStatus: "OPEN",
    note: "Initial interview",
    location: "Conference Room A",
    recruiterDTO: { id: 6, name: "Kieu Anh" },
    meetingId: "meet123",
    position: "BACKEND_DEVELOPER",
  },
];

describe("InterviewTable Component", () => {
  // Kiểm tra rendering cơ bản
  test("renders interview data correctly", () => {
    render(
      <Router>
        <InterviewTable dataInterviews={mockData} role="ROLE_RECRUITER" />
      </Router>
    );

    // Kiểm tra nội dung bảng
    expect(screen.getByText("Backend Developer Interview")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Kieu Anh")).toBeInTheDocument();
    expect(screen.getByText("Fail")).toBeInTheDocument();
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText(/Backend Developer/i)).toBeInTheDocument();
  });

  // Kiểm tra rendering theo vai trò
  test("renders icons based on role", () => {
    render(
      <Router>
        <InterviewTable dataInterviews={mockData} role="ROLE_INTERVIEWER" />
      </Router>
    );

    // Kiểm tra biểu tượng mắt và không có biểu tượng chỉnh sửa
    expect(screen.getByTestId("view-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("edit-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("submit-icon")).toBeInTheDocument();
  });

  test("renders icons based on role (not ROLE_INTERVIEWER)", () => {
    render(
      <Router>
        <InterviewTable dataInterviews={mockData} role="ROLE_RECRUITER" />
      </Router>
    );

    // Kiểm tra biểu tượng chỉnh sửa và không có biểu tượng tay
    expect(screen.getByTestId("edit-icon")).toBeInTheDocument();
    expect(screen.getByTestId("view-icon")).toBeInTheDocument();
    expect(screen.queryByTestId("submit-icon")).not.toBeInTheDocument();
  });

  // Kiểm tra điều hướng
  test("navigates to correct page on icon click", () => {
    render(
      <Router>
        <InterviewTable dataInterviews={mockData} role="ROLE_RECRUITER" />
      </Router>
    );

    fireEvent.click(screen.getByTestId("edit-icon"));
    expect(mockNavigate).toHaveBeenCalledWith("/interview/edit/1");
  });

  // Kiểm tra trường hợp không có dữ liệu
  test("displays 'No item matches with your search data' when no data", () => {
    render(
      <Router>
        <InterviewTable dataInterviews={[]} role="ROLE_RECRUITER" />
      </Router>
    );

    expect(
      screen.getByText(
        "No item matches with your search data. Please try again."
      )
    ).toBeInTheDocument();
  });
});
