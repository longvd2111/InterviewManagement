import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CreateCandidate from '~/pages/candidates/CreateCandidate';
import { AuthContext } from '~/contexts/auth/AuthContext';
import { fetchAllUser } from '~/services/userServices';
import { toast } from 'react-toastify';
import { createCandidate } from '~/services/candidateApi';

jest.mock('~/services/userServices', () => ({
    fetchAllUser: jest.fn(),
}));
jest.mock('~/services/candidateApi', () => ({
    createCandidate: jest.fn(),
}));
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockUsers = [
    { id: 1, fullName: 'Jane Smith', userRole: 'ROLE_RECRUITER' },
    { id: 2, fullName: 'Jane Smith1', userRole: 'ROLE_RECRUITER' }
    // Add more mock users if necessary
];

describe('CreateCandidate Component', () => {
    const renderComponent = () => {
        const user = { role: 'ROLE_ADMIN' }; // Or any other role you want to test with
        return render(
            <AuthContext.Provider value={{ user }}>
                <MemoryRouter>
                    <CreateCandidate />
                </MemoryRouter>
            </AuthContext.Provider>
        );
    };

    beforeEach(() => {
        fetchAllUser.mockResolvedValue({ data: mockUsers });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders CreateCandidate form correctly', async () => {
        renderComponent();

        // Ensure that initial form fields are displayed
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/D.O.B/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Current Position/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Highest Level/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Skills/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Recruiter/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Note/i)).toBeInTheDocument();
    });

    test('shows error when email is invalid', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '0927548323' } });
        fireEvent.change(screen.getByLabelText(/D.O.B/i), { target: { value: '1990-01-01' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'asdasd' } });

        // Use userEvent to open the dropdown
        userEvent.click(screen.getByLabelText(/Gender/i));
        userEvent.click(await screen.findByText('Male')); // Select option from the dropdown

        userEvent.click(screen.getByLabelText(/Current Position/i));
        userEvent.click(await screen.findByText('Business Analyst')); // Select option

        userEvent.click(screen.getByLabelText(/Highest Level/i));
        userEvent.click(await screen.findByText('PhD')); // Select option

        userEvent.click(screen.getByLabelText(/Skills/i));
        userEvent.click(await screen.findByText('Java')); // Select option

        userEvent.click(screen.getByLabelText(/Recruiter/i));
        userEvent.click(await screen.findByText('Jane Smith')); // Select option

        fireEvent.click(screen.getByTestId('addbutton'));

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith("Invalid email address. Please input localpart@domainpart!");
        });
      });


      test('shows error when phone number is invalid', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '123123' } });
        fireEvent.change(screen.getByLabelText(/D.O.B/i), { target: { value: '1990-01-01' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'johndoe@gmail.com' } });

        // Use userEvent to open the dropdown
        userEvent.click(screen.getByLabelText(/Gender/i));
        userEvent.click(await screen.findByText('Male')); // Select option from the dropdown

        userEvent.click(screen.getByLabelText(/Current Position/i));
        userEvent.click(await screen.findByText('Business Analyst')); // Select option

        userEvent.click(screen.getByLabelText(/Highest Level/i));
        userEvent.click(await screen.findByText('PhD')); // Select option

        userEvent.click(screen.getByLabelText(/Skills/i));
        userEvent.click(await screen.findByText('Java')); // Select option

        userEvent.click(screen.getByLabelText(/Recruiter/i));
        userEvent.click(await screen.findByText('Jane Smith')); // Select option

        fireEvent.click(screen.getByTestId('addbutton'));

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith("Phone number must be exactly 10 numbers. Please try again!");
        });
      });
      test('shows error when dob is invalid', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '0927574483' } });
        fireEvent.change(screen.getByLabelText(/D.O.B/i), { target: { value: '2025-01-01' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'johndoe@gmail.com' } });

        // Use userEvent to open the dropdown
        userEvent.click(screen.getByLabelText(/Gender/i));
        userEvent.click(await screen.findByText('Male')); // Select option from the dropdown

        userEvent.click(screen.getByLabelText(/Current Position/i));
        userEvent.click(await screen.findByText('Business Analyst')); // Select option

        userEvent.click(screen.getByLabelText(/Highest Level/i));
        userEvent.click(await screen.findByText('PhD')); // Select option

        userEvent.click(screen.getByLabelText(/Skills/i));
        userEvent.click(await screen.findByText('Java')); // Select option

        userEvent.click(screen.getByLabelText(/Recruiter/i));
        userEvent.click(await screen.findByText('Jane Smith')); // Select option

        fireEvent.click(screen.getByTestId('addbutton'));

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith("Date of Birth must be in the past please!");
        });
      });

    test('handles successful candidate creation', async () => {
        createCandidate.mockResolvedValue({ data: {} });

        renderComponent();

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '0927574483' } });
        fireEvent.change(screen.getByLabelText(/D.O.B/i), { target: { value: '2003-01-01' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'johndoe@gmail.com' } });

        userEvent.click(screen.getByLabelText(/Gender/i));
        userEvent.click(await screen.findByText('Male'));

        userEvent.click(screen.getByLabelText(/Current Position/i));
        userEvent.click(await screen.findByText('Business Analyst'));

        userEvent.click(screen.getByLabelText(/Highest Level/i));
        userEvent.click(await screen.findByText('PhD'));

        userEvent.click(screen.getByLabelText(/Skills/i));
        userEvent.click(await screen.findByText('Java'));


        userEvent.click(screen.getByLabelText(/Recruiter/i));
        userEvent.click(await screen.findByText('Jane Smith1'));

        fireEvent.click(screen.getByTestId('addbutton'));


        await waitFor(() => {
            expect(createCandidate).toHaveBeenCalledWith(expect.objectContaining({
                fullName: 'John Doe',
                email: 'johndoe@gmail.com',
                phone: '0927574483',
                dob: '2003-01-01',
                gender: 'MALE',
                candidatePosition: 'BUSINESS_ANALYST',
                highestLevel: 'PHD',
                skillIds: [1],
                recruiterId: 2,
                address: "",
                attachFile: "",
                candidateStatus: "OPEN",
                note: "",
                yearExperience: ""
            }));
        });

        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Candidate created successfully!');
        });
    });


    test('handles error when creating candidate', async () => {
        // Mock the candidate creation error
        createCandidate.mockRejectedValue(new Error('Failed to create candidate'));
        renderComponent();

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '0927574483' } });
        fireEvent.change(screen.getByLabelText(/D.O.B/i), { target: { value: '2003-01-01' } });
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'johndoe@gmail.com' } });

        userEvent.click(screen.getByLabelText(/Gender/i));
        userEvent.click(await screen.findByText('Male'));

        userEvent.click(screen.getByLabelText(/Current Position/i));
        userEvent.click(await screen.findByText('Business Analyst'));

        userEvent.click(screen.getByLabelText(/Highest Level/i));
        userEvent.click(await screen.findByText('PhD'));

        userEvent.click(screen.getByLabelText(/Skills/i));
        userEvent.click(await screen.findByText('Java'));


        userEvent.click(screen.getByLabelText(/Recruiter/i));
        userEvent.click(await screen.findByText('Jane Smith'));

        fireEvent.click(screen.getByTestId('addbutton'));

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Error creating candidate. Please try again.');
        });
    });
});
