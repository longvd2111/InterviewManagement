import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CreateUser from '~/pages/users/CreateUser';

describe('CreateUser Component', () => {
  test('renders the CreateUser form', () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );

    expect(screen.getByText('Create user')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type a name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type an email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type an address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type a phone')).toBeInTheDocument();
    expect(screen.getByText('Select gender(s)')).toBeInTheDocument();
    expect(screen.getByText('Select role(s)')).toBeInTheDocument();
    expect(screen.getByText('Select department(s)')).toBeInTheDocument();
    expect(screen.getByText('Select status')).toBeInTheDocument();
  });

  test('handles form submission', () => {
    render(
      <MemoryRouter>
        <CreateUser />
      </MemoryRouter>
    );

    const fullNameInput = screen.getByPlaceholderText('Type a name');
    const emailInput = screen.getByPlaceholderText('Type an email');
    const addressInput = screen.getByPlaceholderText('Type an address');
    const phoneInput = screen.getByPlaceholderText('Type a phone');
    const genderSelect = screen.getByText('Select gender(s)');
    const roleSelect = screen.getByText('Select role(s)');
    const departmentSelect = screen.getByText('Select department(s)');
    const statusSelect = screen.getByText('Select status');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(addressInput, { target: { value: '123 Main St' } });
    fireEvent.change(phoneInput, { target: { value: '123-456-7890' } });

    fireEvent.click(genderSelect);
    fireEvent.click(screen.getByText('Male'));

    fireEvent.click(roleSelect);
    fireEvent.click(screen.getByText('Admin'));

    fireEvent.click(departmentSelect);
    fireEvent.click(screen.getByText('HR'));

    fireEvent.click(statusSelect);
    fireEvent.click(screen.getByText('Active'));

    fireEvent.click(submitButton);

    
  });
});
