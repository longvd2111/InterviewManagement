import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "~/contexts/auth/AuthContext";
import JobsList from "~/pages/jobs/JobsList";
import { fetchAllJobs } from "~/services/jobApi";

// Mock the necessary modules
jest.mock("~/services/jobApi");

const mockJobs = [
  {
    id: 1,
    jobTitle: "Software Engineer",
    requiredSkillSet: [{ name: "JavaScript" }, { name: "React" }],
    startDate: [2024, 7, 1],
    endDate: [2024, 12, 31],
    jobStatus: "OPEN",
    jobLevel: "JUNIOR",
  },
  {
    id: 2,
    jobTitle: "Backend Developer",
    requiredSkillSet: [{ name: "Node.js" }, { name: "Express" }],
    startDate: [2024, 8, 1],
    endDate: [2025, 1, 31],
    jobStatus: "CLOSED",
    jobLevel: "MID",
  },
  {
    id: 2,
    jobTitle: "FPT Developer",
    requiredSkillSet: [{ name: "Node.js" }, { name: "Express" }],
    startDate: [2024, 8, 1],
    endDate: [2025, 1, 31],
    jobStatus: "CLOSED",
    jobLevel: "MID",
  },
];

const renderComponent = (userRole) => {
  const user = { role: userRole };
  return render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter>
        <JobsList />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe("JobsList Component", () => {
  beforeEach(() => {
    fetchAllJobs.mockResolvedValue({ data: mockJobs });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render jobs list and job statuses", async () => {
    renderComponent("ROLE_USER");

    await waitFor(() => {
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Backend Developer")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("FPT Developer")).toBeInTheDocument();
    });
  });
});
