import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import EditCandidate from "~/pages/candidates/EditCandidate";
import { fetchCandidateById, updateCandidate } from "~/services/candidateApi";
import { fetchAllUser } from "~/services/userServices";
import {
  optionsSkills,
  optionsPosition,
  optionsGender,
  optionsLevel,
  optionsStatus,
} from "~/data/Constants";
import userEvent from "@testing-library/user-event";

// Mock the services
jest.mock("~/services/candidateApi");
jest.mock("~/services/userServices");
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock data
const mockCandidateData = {
  id: 1,
  fullName: "John Doe",
  email: "john.doe@example.com",
  dob: "2000-01-01",
  address: "123 Main St",
  phone: "1234567890",
  gender: "MALE",
  candidatePosition: "DEVELOPER",
  yearExperience: "5",
  highestLevel: "PHD",
  skills: ["business analysis"],
  recruiter: "Recruiter Name",
  candidateStatus: "OPEN",
  attachFile: "resume.pdf",
};

const mockUsers = [
  { id: "1", fullName: "Recruiter Name", userRole: "ROLE_RECRUITER" },
];

describe("EditCandidate Component", () => {
  beforeEach(() => {
    fetchCandidateById.mockResolvedValue(mockCandidateData);
    fetchAllUser.mockResolvedValue({ data: mockUsers });
  });

  test("renders EditCandidate component", async () => {
    render(
      <MemoryRouter initialEntries={["/candidate/edit/1"]}>
        <Routes>
          <Route path="/candidate/edit/:id" element={<EditCandidate />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("I. Personal Information"));

    // Personal Information
    expect(screen.getByText("I. Personal Information")).toBeInTheDocument();
    expect(screen.getByTestId("fullname")).toBeInTheDocument();
    expect(screen.getByTestId("email")).toBeInTheDocument();
    expect(screen.getByTestId("dob")).toBeInTheDocument();
    expect(screen.getByTestId("address")).toBeInTheDocument();
    expect(screen.getByTestId("phone")).toBeInTheDocument();
    expect(screen.getByTestId("gender")).toBeInTheDocument();

    // Professional Information
    expect(
      screen.getByText("II. Professional Information")
    ).toBeInTheDocument();
    expect(screen.getByTestId("attachFile")).toBeInTheDocument();
    expect(screen.getByTestId("yearExperience")).toBeInTheDocument();
    expect(screen.getByTestId("position")).toBeInTheDocument();
    expect(screen.getByTestId("level")).toBeInTheDocument();
    expect(screen.getByTestId("skill")).toBeInTheDocument();
    expect(screen.getByTestId("note")).toBeInTheDocument();
    expect(screen.getByTestId("recruiter")).toBeInTheDocument();
    expect(screen.getByTestId("status")).toBeInTheDocument();

    // Edit, cancel buttons
    expect(screen.getByTestId("editbutton")).toBeInTheDocument();
    expect(screen.getByTestId("cancel")).toBeInTheDocument();
  });

  test("fills out and submits the form", async () => {
    render(
      <MemoryRouter initialEntries={["/candidate/edit/1"]}>
        <Routes>
          <Route path="/candidate/edit/:id" element={<EditCandidate />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("I. Personal Information"));

    // Fill out form fields
    fireEvent.change(screen.getByPlaceholderText("Type a name..."), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Type an email..."), {
      target: { value: "jane.doe@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Type a number..."), {
      target: { value: "0987654321" },
    });
    fireEvent.change(screen.getByPlaceholderText("Type an address..."), {
      target: { value: "456 Elm St" },
    });
    fireEvent.change(screen.getByPlaceholderText("Type a note"), {
      target: { value: "Note about candidate" },
    });
    fireEvent.change(screen.getByLabelText(/D.O.B/i), {
      target: { value: "2000-01-01" },
    });

    // Simulate selecting from dropdowns
    userEvent.click(screen.getByLabelText(/Gender/i));
    userEvent.click(await screen.findByText("Male"));

    userEvent.click(screen.getByLabelText(/Current Position/i));
    userEvent.click(await screen.findByText("Business Analyst"));

    userEvent.click(screen.getByLabelText(/Highest Level/i));
    userEvent.click(await screen.findByText("PhD"));

    userEvent.click(screen.getByLabelText(/Skills/i));
    userEvent.click(await screen.findByText("Java"));

    // Simulate selecting the recruiter
    userEvent.click(screen.getByLabelText(/Recruiter/i));
    const recruiterOption = await screen.findByText("Recruiter Name");
    userEvent.click(recruiterOption);

    // Debugging output

    userEvent.click(screen.getByTestId("editbutton"));

    await waitFor(() => {
      expect(updateCandidate).toHaveBeenCalledWith({
        id: 1,
        fullName: "Jane Doe",
        dob: "2000-01-01",
        phone: "0987654321",
        email: "jane.doe@example.com",
        address: "456 Elm St",
        gender: optionsGender.find((option) => option.label === "Male").value,
        skillIds: [
          optionsSkills.find((option) => option.label === "Java").value,
        ],
        recruiterId: mockUsers[0].id,
        attachFile: null,
        candidateStatus: "OPEN",
        candidatePosition: optionsPosition.find(
          (option) => option.label === "Business Analyst"
        ).value,
        yearExperience: 0,
        highestLevel: optionsLevel.find((option) => option.label === "PhD")
          .value,
        note: "Note about candidate",
      });
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Candidate updated successfully!"
    );
  });
});
