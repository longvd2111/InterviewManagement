// src/components/UpdateUser/UpdateUser.test.js

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ApiUser from '~/services/usersApi';
import { toast } from 'react-toastify';
import UpdateUser from '~/pages/users/UpdateUser';

// Mock the API call
jest.mock('~/services/usersApi');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockUser = {
  id: 1,
  fullName: 'John Doe',
  email: 'john@example.com',
  dob: '1990-01-01',
  address: '123 Main St',
  phone: '1234567890',
  gender: 'Male',
  userRole: 'Admin',
  department: 'HR',
  note: 'Test note',
  userStatus: 'Active',
};

describe('UpdateUser Component', () => {
  beforeEach(() => {
    ApiUser.getDetailUser.mockResolvedValue(mockUser);
    ApiUser.editUser.mockResolvedValue({});
  });

  test('renders the UpdateUser form and fetches user data', async () => {
    render(
      <MemoryRouter initialEntries={['/user/edit/1']}>
        <Routes>
          <Route path="/user/edit/:id" element={<UpdateUser />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the form to be populated with user data
    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1990-01-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('HR')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test note')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    render(
      <MemoryRouter initialEntries={['/user/edit/1']}>
        <Routes>
          <Route path="/user/edit/:id" element={<UpdateUser />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the form to be populated with user data
    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Type a name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Type an email'), { target: { value: 'jane@example.com' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(ApiUser.editUser).toHaveBeenCalledWith(expect.objectContaining({
        id: '1',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        dob: '1990-01-01',
        address: '123 Main St',
        phone: '1234567890',
        gender: 'Male',
        userRole: 'Admin',
        department: 'HR',
        note: 'Test note',
        userStatus: 'Active',
      }));
    });

    expect(toast.success).toHaveBeenCalledWith('Update user Successfully!');
  });

  test('displays error message on API failure', async () => {
    ApiUser.editUser.mockRejectedValueOnce(new Error('Update failed'));

    render(
      <MemoryRouter initialEntries={['/user/edit/1']}>
        <Routes>
          <Route path="/user/edit/:id" element={<UpdateUser />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the form to be populated with user data
    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error updating user. Please try again.');
    });
  });
});
