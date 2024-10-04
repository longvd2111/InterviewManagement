import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CandidateDetail from '~/pages/candidates/CandidateDetail';
import { AuthContext } from '~/contexts/auth/AuthContext';
import { fetchCandidateById, updateCandidate } from '~/services/candidateApi';
import { fetchAllUser } from '~/services/userServices';
import { toast } from 'react-toastify';

jest.mock('~/services/candidateApi');
jest.mock('~/services/userServices');
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

const mockCandidate = {
    id: 1,
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    candidatePosition: 'developer',
    recruiter: 'Jane Smith',
    candidateStatus: 'Open',
    address: '123 Main St',
    dob: [1990, 1, 1],
    gender: 'Male',
    highestLevel: 'bachelor',
    note: 'Sample note',
    skills: ['JavaScript', 'React'],
    yearExperience: 5,
};


describe('CandidateDetail Component', () => {
    const renderComponent = (userRole) => {
        const user = { role: userRole };
        return render(
            <AuthContext.Provider value={{ user }}>
                <MemoryRouter initialEntries={['/candidate/1']}>
                    <Routes>
                        <Route path="/candidate/:id" element={<CandidateDetail />} />
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );
    };

    beforeEach(() => {
        fetchCandidateById.mockResolvedValue(mockCandidate);
        fetchAllUser.mockResolvedValue({ data: [{ id: 1, fullName: 'Jane Smith', userRole: 'ROLE_RECRUITER' }] });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders candidate details correctly', async () => {
        renderComponent('ROLE_ADMIN');
    
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    
        await waitFor(() => {
            const fullNameElement = screen.getByTestId('fullName');
            expect(fullNameElement).toHaveTextContent('John Doe');
        });
    
        await waitFor(() => {
            const emailElement = screen.getByText(/john.doe@example.com/i);
            expect(emailElement).toBeInTheDocument();
        });
    
        await waitFor(() => {
            const phoneElement = screen.getByText(/1234567890/i);
            expect(phoneElement).toBeInTheDocument();
        });
    
        await waitFor(() => {
            const recruiterElement = screen.getByText(/Jane Smith/i);
            expect(recruiterElement).toBeInTheDocument();
        });
    
        await waitFor(() => {
            const noteElement = screen.getByText(/Sample note/i);
            expect(noteElement).toBeInTheDocument();
        });

        await waitFor(() => {
            const statusElement = screen.getByTestId("status");
            expect(statusElement).toBeInTheDocument("Open");
        });
        await waitFor(() => {
            const genderElement = screen.getByTestId("gender");
            expect(genderElement).toBeInTheDocument();
        });
        await waitFor(() => {
            const levelElement = screen.getByTestId("level");
            expect(levelElement).toBeInTheDocument();
        });
        await waitFor(() => {
            const dob = screen.getByText(/01\/01\/1990/i); // Adjust the format if needed
            expect(dob).toBeInTheDocument();
        });
        
        // Check skills
        await waitFor(() => {
            mockCandidate.skills.forEach(skill => {
                expect(screen.getByText(new RegExp(skill, 'i'))).toBeInTheDocument();
            });

    });
});

    test('handles error when fetching candidate details', async () => {
        fetchCandidateById.mockRejectedValue(new Error('Failed to fetch'));
        renderComponent('ROLE_ADMIN');

        await waitFor(() => {
            expect(screen.getByText(/There was an error loading the candidate details./i)).toBeInTheDocument();
        });
    });

    test('bans candidate when Ban Candidate button is clicked', async () => {
        renderComponent('ROLE_ADMIN');

        await waitFor(() => {
            const fullNameElement = screen.getByTestId('fullName');
            expect(fullNameElement).toHaveTextContent('John Doe');
        });
    

        const banButton = screen.getByText(/Ban Candidate/i);
        fireEvent.click(banButton);
        const confirmban = screen.getByTestId("bancandidate");
        fireEvent.click(confirmban);


        await waitFor(() => {
            expect(updateCandidate).toHaveBeenCalledWith(expect.objectContaining({
                candidateStatus: 'BANNED',
            }));
            
           
        });

        await waitFor(()=>{
            expect(toast.success).toHaveBeenCalledWith('Candidate has been banned successfully');
        });
        
    });

    test('hides edit and ban buttons for non-admin roles', async () => {
        renderComponent('ROLE_INTERVIEW');

        expect(screen.queryByText(/Ban Candidate/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Edit/i)).not.toBeInTheDocument();
    });
});
