import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import JobEdit from '~/pages/jobs/JobEdit';
import { fetchJobsById, updateJob } from '~/services/jobApi';
import { toast } from 'react-toastify';

jest.mock('~/services/jobApi');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockJobData = {
  id: '1',
  jobTitle: 'Test Job',
  requiredSkillSet: [{ id: 1, name: 'Java' }, { id: 2, name: 'Nodejs' }],
  startDate: '2024-01-01',
  endDate: '2024-02-01',
  salaryFrom: 50000,
  salaryTo: 70000,
  benefits: [{ id: 1, name: 'Lunch' }, { id: 2, name: '25-day Leave' }],
  workingAddress: '123 Main St',
  jobLevel: 'JUNIOR',
  jobStatus: 'OPEN',
  description: 'Job Description',
};

describe('JobEdit', () => {
  beforeEach(() => {
    fetchJobsById.mockResolvedValue(mockJobData);
    updateJob.mockResolvedValue({});
  });

  test('renders the form with initial job data', async () => {
    render(
      <Router>
        <JobEdit />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Job')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-02-01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('50000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('70000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
      expect(screen.getByText('Job Description')).toBeInTheDocument();
    });
  });

  test('allows user to fill and submit the form', async () => {
    render(
      <Router>
        <JobEdit />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Job')).toBeInTheDocument();
    });

    userEvent.clear(screen.getByDisplayValue('Test Job'));
    userEvent.type(screen.getByLabelText(/Job Title/i), 'Updated Job Title');
    userEvent.clear(screen.getByLabelText(/Start Date/i));
    userEvent.type(screen.getByLabelText(/Start Date/i), '2024-03-01');
    userEvent.clear(screen.getByLabelText(/End Date/i));
    userEvent.type(screen.getByLabelText(/End Date/i), '2024-04-01');

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(updateJob).toHaveBeenCalledWith({
        id: '1',
        jobTitle: 'Updated Job Title',
        skillIds: [1, 2],
        startDate: '2024-03-01',
        endDate: '2024-04-01',
        salaryFrom: '50000',
        salaryTo: '70000',
        benifitIds: [1, 2],
        workingAddress: '123 Main St',
        jobLevel: 'JUNIOR',
        jobStatus: 'OPEN',
        description: 'Job Description',
      });
      expect(toast.success).toHaveBeenCalledWith('Job updated successfully!');
    });
  });

  test('shows validation errors if form is incomplete', async () => {
    render(
      <Router>
        <JobEdit />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Job')).toBeInTheDocument();
    });

    userEvent.clear(screen.getByDisplayValue('Test Job'));
    userEvent.clear(screen.getByLabelText(/Start Date/i));
    userEvent.clear(screen.getByLabelText(/End Date/i));
    userEvent.clear(screen.getByLabelText(/Salary From/i));
    userEvent.clear(screen.getByLabelText(/Salary To/i));
    userEvent.clear(screen.getByLabelText(/Working Address/i));
    userEvent.clear(screen.getByLabelText(/Description/i));

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Job Title is required')).toBeInTheDocument();
      expect(screen.getByText('Start Date is required')).toBeInTheDocument();
      expect(screen.getByText('End Date is required')).toBeInTheDocument();
      expect(screen.getByText('Salary From is required')).toBeInTheDocument();
      expect(screen.getByText('Salary To is required')).toBeInTheDocument();
      expect(screen.getByText('Working Address is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  test('displays loading and error states', async () => {
    fetchJobsById.mockRejectedValue(new Error('Error fetching job'));

    render(
      <Router>
        <JobEdit />
      </Router>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Error loading job. Please try again later.')).toBeInTheDocument();
    });
  });
});
