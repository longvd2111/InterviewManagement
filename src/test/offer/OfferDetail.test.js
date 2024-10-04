import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DetailOffer from '~/pages/offers/DetailOffer';
import { AuthContext } from '~/contexts/auth/AuthContext';
import ApiService from '~/services/serviceApiOffer';
import { fetchCandidateById, updateCandidate } from '~/services/candidateApi';
import ApiUser from '~/services/usersApi';
import { toast } from 'react-toastify';

jest.mock('~/services/serviceApiOffer');
jest.mock('~/services/candidateApi');
jest.mock('~/services/usersApi');
jest.mock('react-toastify', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));
const mockOffer = {
    id: 1,
    candidate: { "1": "John Doe" },
    contractType: 'TRIAL_TWO_MONTH',
    position: 'BACKEND_DEVELOPER',
    offerLevel: 'LEADER',
    approvedBy: 'Jane Approver',
    department: 'IT',
    interviewSchedule: {
        interviewerDto: [{ name: 'Alice Interviewer' }],
        notes: 'Good candidate'
    },
    recruiterOwner: { name: 'Bob Recruiter' },
    contractFrom: [2024, 1, 1],
    contractTo: [2025, 1, 1],
    dueDate: [2024, 2, 1],
    basicSalary: 50000000,
    note: 'Offer details',
    offerStatus: 'WAITING_FOR_APPROVAL'
};

describe('DetailOffer Component', () => {
    const renderComponent = (userRole) => {
        const user = { role: userRole };
        return render(
            <AuthContext.Provider value={{ user }}>
                <MemoryRouter initialEntries={['/offer/1']}>
                    <Routes>
                        <Route path="/offer/:id" element={<DetailOffer />} />
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );
    };

    beforeEach(() => {
        ApiService.ApiDetailOffer.mockResolvedValue(mockOffer);
        fetchCandidateById.mockResolvedValue({ id: 1, fullName: 'John Doe', skills: ['JavaScript'] });
        ApiUser.getUsers.mockResolvedValue({ data: [{ id: 1, fullName: 'Bob Recruiter', userRole: 'ROLE_RECRUITER' }] });
    });

    beforeEach(() => {
        jest.resetModules(); // Đặt lại tất cả các mô-đun trước mỗi bài kiểm tra
    });
    
////////////////////////da passed
    // test('renders offer details correctly', async () => {
    //     renderComponent('ROLE_ADMIN');
    
    //     await waitFor(() => {
    //         expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    //         expect(screen.getByText(/Trial 2 months/i)).toBeInTheDocument();
    //         expect(screen.getByText(/Backend Developer/i)).toBeInTheDocument();
    //         expect(screen.getByText(/Leader/i)).toBeInTheDocument();
    //         expect(screen.getByText(/Jane Approver/i)).toBeInTheDocument();
    //         expect(screen.getByTestId(/department/i)).toHaveTextContent("IT");
    //         expect(screen.getByText(/Alice Interviewer/i)).toBeInTheDocument();
    //         expect(screen.getByText(/Good candidate/i)).toBeInTheDocument();
    //         expect(screen.getByText(/Bob Recruiter/i)).toBeInTheDocument();
    
    //         expect(screen.getByTestId(/contractFrom/i)).toHaveTextContent("2024-01-01");
    //         expect(screen.getByTestId(/contractTo/i)).toHaveTextContent("2025-01-01");
    //         expect(screen.getByTestId(/dueDate/i)).toHaveTextContent("2024-02-01");
    
    //         expect(screen.getByTestId("basicSalary")).toBeInTheDocument("50,000,000");
    
    //         expect(screen.getByText(/Offer details/i)).toBeInTheDocument();
    //         expect(screen.getByText(/Waiting for response/i)).toBeInTheDocument();
    //     });
    // });

    // test('changes offer status when status button is clicked', async () => {
    //     renderComponent('ROLE_ADMIN');
    
    //     await waitFor(() => {
    //         expect(screen.getByTestId("button-approve")).toBeInTheDocument(); // Sử dụng giá trị duy nhất
    //     });
    
    //     const acceptButton = screen.getByTestId("button-approve");
    //     fireEvent.click(acceptButton);
    
    //     await waitFor(() => {
    //         expect(screen.getByTestId("form-alert")).toBeInTheDocument("Are you sure you want to change the status to Approved offer?");
    //     });
    
    //     const confirmButton = screen.getByText(/Yes/i);
    //     fireEvent.click(confirmButton);
    
    //     await waitFor(() => {
    //         expect(ApiService.ApiEditOffer).toHaveBeenCalledWith(expect.objectContaining({
    //             id: 1,
    //             candidateId: 1,
    //             contractType: 'TRIAL_TWO_MONTH',
    //             position: 'BACKEND_DEVELOPER',
    //             offerLevel: 'LEADER',
    //             approvedBy: 4,
    //             interviewSchedule: 1,
    //             recruiterOwnerId: 1,
    //             contractFrom: '2024-01-01',
    //             contractTo: '2025-01-01',
    //             dueDate: '2024-02-01',
    //             basicSalary: 50000000,
    //             note: 'Offer details',
    //             email: '',
    //             offerStatus: 'APPROVED_OFFER',
    //             department: 'IT',
    //         }));
    //         expect(updateCandidate).toHaveBeenCalledWith(expect.objectContaining({
    //             id: 1,
    //             fullName: 'John Doe',
    //             dob: '1990-01-01',
    //             phone: '',
    //             email: '',
    //             address: '',
    //             gender: null,
    //             skillIds: [],
    //             recruiterId: 1,
    //             attachFile: null,
    //             candidateStatus: null,
    //             candidatePosition: null,
    //             yearExperience: 0,
    //             highestLevel: null,
    //             note: '',
    //         }));
    //         expect(toast.success).toHaveBeenCalledWith('Offer status has been successfully updated!');
    //     });
    // });

    //////////////////da passed
    // test('navigates to edit page when Edit button is clicked', async () => {
    //     renderComponent('ROLE_ADMIN');

    //     await waitFor(() => {
    //         const editButton = screen.getByText(/Edit/i);
    //         fireEvent.click(editButton);
    //     });

    //     expect(mockNavigate).toHaveBeenCalledWith('/offer/edit/1');
    // });
    /////////////////////da passed 
    // test('hides certain buttons for non-admin roles', async () => {
    //     renderComponent('ROLE_INTERVIEW');

    //     await waitFor(() => {
    //         expect(screen.queryByText(/Accept/i)).not.toBeInTheDocument();
    //         expect(screen.queryByText(/Reject/i)).not.toBeInTheDocument();
    //         expect(screen.queryByText(/Edit/i)).not.toBeInTheDocument();
    //     });
    // });
});
