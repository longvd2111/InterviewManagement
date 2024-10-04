import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import CandidateTable from '~/pages/candidates/CandidateTable';
import { AuthContext } from '~/contexts/auth/AuthContext';
import { fetchAllCandidate, deleteCandidate } from '~/services/candidateApi';

// Mock services
jest.mock('~/services/candidateApi');

// Mock data
const mockCandidates = [
  {
    id: 1,
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    candidatePosition: 'developer',
    recruiter: 'Jane Smith',
    candidateStatus: 'Open'
  },
  {
    id: 2,
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    phone: '1234567899',
    candidatePosition: 'BA',
    recruiter: 'Jane Smith',
    candidateStatus: 'active'
  }
  // Add more mock candidates if needed
];

describe('CandidateTable Component', () => {
  const renderComponent = (userRole) => {
    const user = { role: userRole };
    render(
      <AuthContext.Provider value={{ user }}>
        <Router>
          <CandidateTable />
        </Router>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    fetchAllCandidate.mockResolvedValue({ data: mockCandidates });
  });

  test('renders without crashing', async () => {
    renderComponent('ROLE_ADMIN');

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
  });

  test('search functionality', async () => {
    renderComponent('ROLE_ADMIN');
    expect(screen.getByText(/Add new/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    const searchStatus = screen.getByTestId("searchStatus");
    fireEvent.change(searchInput, { target: { value: 'John' } });
    fireEvent.change(searchStatus,{target: {value: 'Open'}})
    fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();

    });
  });
  test('pagination works correctly', async () => {
    renderComponent('ROLE_ADMIN');

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    const nextPageButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextPageButton);

    // Check if the page changes correctly
    await waitFor(() => {
      expect(fetchAllCandidate).toHaveBeenCalledTimes(3);
    });
  });

  test('delete candidate functionality', async () => {
    deleteCandidate.mockResolvedValue({});

    renderComponent('ROLE_ADMIN');

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('delete-icon-1');
    fireEvent.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    });
  });

  test('hides edit, delete, and add new buttons for ROLE_INTERVIEW', async () => {
    renderComponent('ROLE_INTERVIEW');

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/John Smith/i)).toBeInTheDocument();
    });

    // Check that the add new button is not present
    expect(screen.queryByText(/Add new/i)).not.toBeInTheDocument();

    // Check that edit and delete icons are not present
    expect(screen.queryByTestId('edit-icon-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-icon-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('edit-icon-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('delete-icon-2')).not.toBeInTheDocument();
  });
});
