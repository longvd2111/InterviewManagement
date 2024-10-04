import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { AuthContext } from '~/contexts/auth/AuthContext';
import Login from '~/components/auth/Login';
import { loginApi } from '~/services/userServices';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';

// Mocking the loginApi service
jest.mock('~/services/userServices');

// Mocking the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mocking the toast functions
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('Login Component', () => {
  const mockLoginContext = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();  // Clear previous mocks
    useNavigate.mockReturnValue(mockNavigate); // Mock useNavigate to use mockNavigate
    render(
      <AuthContext.Provider value={{ loginContext: mockLoginContext }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    );
  });

  test('renders the login form', () => {
    expect(screen.getByText(/IMS Recruitment/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  test('displays error message on wrong password', async () => {
    // Mocking the loginApi to return a rejected promise with an error message
    loginApi.mockRejectedValueOnce({ data: 'Wrong password!' } );
    
    // Fill in the form with incorrect details
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'admin1' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: '1234567' } });
    fireEvent.click(screen.getByTestId('login-button'));
    
    // Check for the Toast error call
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Wrong password!');
    });
  });
  
  

  test('calls loginApi and loginContext, then navigates to home on successful login', async () => {
    const token = 'test-token';
    const user = { username: 'user' };

    loginApi.mockResolvedValueOnce({ token, user });

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'admin1' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));

    await waitFor(() => {
      expect(mockLoginContext).toHaveBeenCalledWith(user, token, false);
      expect(toast.success).toHaveBeenCalledWith('Welcome to Interview Management System!');
    });
  });

  test('toggles password visibility', () => {
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const eyeIcon = screen.getByTestId('iconeyepassword');

    expect(passwordInput.type).toBe('password');

    fireEvent.click(eyeIcon);

    expect(passwordInput.type).toBe('text');
  });
});
