import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateOffer from "~/pages/offers/CreateOffer";
import { fetchAllUser } from "~/services/userServices";
import ApiService from "~/services/serviceApiOffer";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-toastify";

// Mock the external services
jest.mock("~/services/userServices");
jest.mock("~/services/serviceApiOffer");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("CreateOffer Component", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  /////////////////da passed
  // test("renders the CreateOffer form and inputs", async () => {
  //   fetchAllUser.mockResolvedValueOnce({
  //     data: [
  //       { id: 1, fullName: "John Doe", userRole: "ROLE_RECRUITER" },
  //       { id: 2, fullName: "Jane Smith", userRole: "ROLE_RECRUITER" },
  //     ],
  //   });

  //   render(
  //     <Router>
  //       <CreateOffer />
  //     </Router>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByLabelText(/Candidate/i)).toBeInTheDocument();
  //     expect(screen.getByLabelText(/Contract Type/i)).toBeInTheDocument();
  //     expect(screen.getByLabelText(/Position/i)).toBeInTheDocument();
  //     expect(screen.getByLabelText(/Level/i)).toBeInTheDocument();
  //     expect(screen.getByLabelText(/Approver/i)).toBeInTheDocument();
  //     expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();
  //     expect(screen.getByLabelText(/Interview info/i)).toBeInTheDocument();
  //     expect(screen.getByLabelText(/Recruiter Owner/i)).toBeInTheDocument();
  //     expect(screen.getByTestId("contract-period-label")).toBeInTheDocument();
  //     expect(screen.getByTestId("contract-from-label")).toBeInTheDocument();
  //     expect(screen.getByTestId("contract-to-label")).toBeInTheDocument();
  //     expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
  //     expect(screen.getByLabelText(/Basic Salary/i)).toBeInTheDocument();
  //     expect(screen.getByLabelText(/Note/i)).toBeInTheDocument();
  //   });
  // });

  test("submits the form with valid data", async () => {
    fetchAllUser.mockResolvedValueOnce({
      data: [{ id: 1, fullName: "John Doe", userRole: "ROLE_RECRUITER" }],
    });

    ApiService.ApiAddOffer.mockResolvedValueOnce({ data: {} });

    render(
      <Router>
        <CreateOffer />
      </Router>
    );

    fireEvent.change(screen.getByLabelText(/Candidate/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/Contract Type/i), {
      target: { value: "FULL_TIME" },
    });
    fireEvent.change(screen.getByLabelText(/Position/i), {
      target: { value: "DEVELOPER" },
    });
    fireEvent.change(screen.getByLabelText(/Level/i), {
      target: { value: "SENIOR" },
    });
    fireEvent.change(screen.getByLabelText(/Approver/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/Department/i), {
      target: { value: "IT" },
    });
    fireEvent.change(screen.getByLabelText(/Interview info/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByLabelText(/Recruiter Owner/i), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("contract-from-label"), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByTestId("contract-to-label"), {
      target: { value: "2024-12-31" },
    });
    fireEvent.change(screen.getByLabelText(/Due Date/i), {
      target: { value: "2024-12-31" },
    });
    fireEvent.change(screen.getByLabelText(/Basic Salary/i), {
      target: { value: "50000" },
    });
    fireEvent.change(screen.getByLabelText(/Note/i), {
      target: { value: "This is a note." },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(ApiService.ApiAddOffer).toHaveBeenCalledWith(
        expect.objectContaining({
          candidateId: "1",
          contractType: "FULL_TIME",
          position: "DEVELOPER",
          offerLevel: "SENIOR",
          approvedBy: "1",
          department: "IT",
          interviewSchedule: "1",
          recruiterOwnerId: "1",
          contractFrom: "2024-01-01",
          contractTo: "2024-12-31",
          dueDate: "2024-12-31",
          basicSalary: "50000",
          note: "This is a note.",
        })
      );
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Successfully created offer");
    });
  });
});
