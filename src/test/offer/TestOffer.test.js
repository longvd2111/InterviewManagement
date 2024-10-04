import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Offer from "~/pages/offers/Offer";
import { AuthContext } from "~/contexts/auth/AuthContext";
import ApiService from "../../services/serviceApiOffer";
import { fetchAllCandidate } from "~/services/candidateApi";

// Mock the API service
jest.mock("../../services/serviceApiOffer");
jest.mock("~/services/candidateApi");

const mockOffers = [
  {
    id: 1,
    candidate: { 1: "John Doe" },
    department: "IT",
    offerStatus: "PENDING",
  },
  {
    id: 2,
    candidate: { 2: "Jane Smith" },
    department: "HR",
    offerStatus: "ACCEPTED",
  },
];

const mockCandidates = [
  { id: 1, fullName: "John Doe", email: "john@example.com" },
  { id: 2, fullName: "Jane Smith", email: "jane@example.com" },
];

describe("Offer Component Tests", () => {
  const renderComponent = (userRole) => {
    const user = { role: userRole };
    render(
      <AuthContext.Provider value={{ user }}>
        <Router>
          <Offer />
        </Router>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    ApiService.ApiOffer.mockResolvedValue({ data: mockOffers });
    fetchAllCandidate.mockResolvedValue({ data: mockCandidates });
  });

  test("renders and loads data", async () => {
    renderComponent("ROLE_ADMIN");

    // Ensure loading text is present
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();

    // Wait for the data to be loaded
    await waitFor(() => {
      expect(ApiService.ApiOffer).toHaveBeenCalled();
      expect(fetchAllCandidate).toHaveBeenCalled();
    });

    // Debug output to inspect what is rendered
    console.log(screen.debug());

    // Check that data is rendered
    expect(screen.getByText(/Offer List/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
  });

  test("filters offers based on search query", async () => {
    renderComponent("ROLE_ADMIN");

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    });

    // Perform search
    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: "John" } });
    fireEvent.click(screen.getByText(/Search/i));

    // Wait for filtered results
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.queryByText(/Jane Smith/i)).not.toBeInTheDocument();
    });
  });

  test("filters offers based on department", async () => {
    renderComponent("ROLE_ADMIN");

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    });

    // Perform department filter
    const departmentSelect = screen.getByTestId("department");
    fireEvent.change(departmentSelect, { target: { value: "IT" } });
    fireEvent.click(screen.getByText("Search"));

    // Wait for filtered results
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.queryByText(/Jane Smith/i)).not.toBeInTheDocument();
    });
  });

  test("filters offers based on status", async () => {
    renderComponent("ROLE_ADMIN");

    // Đảm bảo rằng các offer đều được render trước khi lọc
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    });

    // Thực hiện lọc theo trạng thái
    const statusSelect = screen.getByLabelText(/Status/i);
    fireEvent.change(statusSelect, { target: { value: "ACCEPTED" } });
    fireEvent.click(screen.getByText("Search"));

    // Đợi các kết quả đã được lọc
    await waitFor(() => {
      expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    });
  });
});
