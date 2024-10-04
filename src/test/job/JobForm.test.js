import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import CreateForm from '~/pages/jobs/JobForm';
import { toast } from 'react-toastify';
import { createJobs } from '~/services/jobApi';

jest.mock('~/services/jobApi');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('CreateForm', () => {
  beforeEach(() => {
    createJobs.mockResolvedValue({}); // Mock the createJobs function
  });

  test('renders the form and allows user to fill and submit', async () => {
    render(
      <Router>
        <CreateForm />
      </Router>
    );

    // Check initial render
    expect(screen.getByText('Job Title')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Start Date')).toBeInTheDocument();
    expect(screen.getByText('End Date')).toBeInTheDocument();
    expect(screen.getByText('Salary Range')).toBeInTheDocument();
    expect(screen.getByText('Benefits')).toBeInTheDocument();
    expect(screen.getByText('Working Address')).toBeInTheDocument();
    expect(screen.getByText('Level')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();

    // Fill out the form
    userEvent.type(screen.getByPlaceholderText('Enter Job Title'), 'Software Engineer');
    userEvent.selectOptions(screen.getByLabelText(/Skills/i), ['Java', 'Nodejs']);
    userEvent.type(screen.getByPlaceholderText('Enter Start Date'), '2023-12-31');
    userEvent.type(screen.getByPlaceholderText('Enter End Date'), '2024-01-15');
    userEvent.type(screen.getByPlaceholderText('Enter Working Address'), '123 Main St');
    userEvent.type(screen.getByPlaceholderText('Enter Description'), 'Job Description');
    userEvent.selectOptions(screen.getByLabelText(/Level/i), 'Junior');

    const salaryFromInput = screen.getByPlaceholderText('Enter Salary From');
    const salaryToInput = screen.getByPlaceholderText('Enter Salary To');
    userEvent.type(salaryFromInput, '50000');
    userEvent.type(salaryToInput, '70000');

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(createJobs).toHaveBeenCalledWith({
        jobTitle: 'Software Engineer',
        startDate: '2023-12-31',
        endDate: '2024-01-15',
        salaryFrom: '50000',
        salaryTo: '70000',
        workingAddress: '123 Main St',
        description: 'Job Description',
        jobStatus: 'OPEN',
        skillIds: [1, 2],
        benefitIds: [/* Assuming you select some benefits */],
        jobLevel: 'Junior',
      });
    });

    expect(toast.success).toHaveBeenCalledWith('Job created successfully!');
  });

  test('shows validation errors if form is incomplete', async () => {
    render(
      <Router>
        <CreateForm />
      </Router>
    );

    // Submit the form without filling it
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Job Title is required')).toBeInTheDocument();
      expect(screen.getByText('Skills are required')).toBeInTheDocument();
      expect(screen.getByText('Start Date is required')).toBeInTheDocument();
      expect(screen.getByText('End Date is required')).toBeInTheDocument();
      expect(screen.getByText('Salary From is required')).toBeInTheDocument();
      expect(screen.getByText('Salary To is required')).toBeInTheDocument();
      expect(screen.getByText('Working Address is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('At least one Benefit is required')).toBeInTheDocument();
      expect(screen.getByText('Level is required')).toBeInTheDocument();
    });
  });
});
