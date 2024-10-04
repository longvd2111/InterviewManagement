// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { CSVLink } from "react-csv";
// import { Modal, Button, Form } from "react-bootstrap";
// import { headersExport } from "~/data/Constants";
// import { Row, Col } from "react-bootstrap";

// export default function ButtonOffer({ dataOffer }) {
//   const [showModal, setShowModal] = useState(false);
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [processedData, setProcessedData] = useState([]);

//   const handleExport = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setFromDate("");
//     setToDate("");
//   };

//   const formatDate = (dateArray) => {
//     if (!Array.isArray(dateArray) || dateArray.length !== 3) return "";
//     const [year, month, day] = dateArray;
//     return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//   };
//   const processDataForExport = (data) => {
//     console.log("Sample raw item:", JSON.stringify(data[0], null, 2));
//     return data.map(item => {
//    const canid= Object.keys(item.candidate)

//       const processedItem = {
//         id: item.id,
//         candidateId: canid[0]|| "",
//         candidateName: item.candidate?.[canid] || "",
//         approvedBy: item.approvedBy || "",
//         contractType: item.contractType || "",
//         position: item.position || "",
//         offerLevel: item.offerLevel || "",
//         department: item.department || "",
//         recruiterOwnerName: item.recruiterOwner?.name || "",
//         interviewerName: item.interviewSchedule?.interviewerDto?.[0]?.name || "",
//         contractFrom: Array.isArray(item.contractFrom) ? formatDate(item.contractFrom) : item.contractFrom,
//         contractTo: Array.isArray(item.contractTo) ? formatDate(item.contractTo) : item.contractTo,
//         basicSalary: typeof item.basicSalary === 'number' ? item.basicSalary.toFixed(2) : item.basicSalary || "",
//         note: item.note || ""
//       };
//       console.log("Processed item:", processedItem);
//       return processedItem;
//     });
//   };

//   const handleSubmit = () => {
//     if (!fromDate || !toDate) {
//       alert("Please select both start and end dates.");
//       return;
//     }

//     const startDate = new Date(fromDate);
//     const endDate = new Date(toDate);

//     if (startDate > endDate) {
//       alert("Start date must be before or equal to end date.");
//       return;
//     }

//     const filtered = dataOffer.filter((offer) => {
//       const offerDate = new Date(offer.dueDate[0], offer.dueDate[1] - 1, offer.dueDate[2]);
//       return offerDate >= startDate && offerDate <= endDate;
//     });

//     if (filtered.length === 0) {
//       alert("No offer on the selected date");
//     } else {
//       const processed = processDataForExport(filtered);
//       setProcessedData(processed);
//       console.log("Filtered and processed data:", processed); // Log final data
//       // Delay to ensure state is updated before triggering download
//       setTimeout(() => document.getElementById("csvLink").click(), 0);
//       setShowModal(false);
//     }
//   };
//   return (
//     <div className="changed">
//       <div className="offer-button">
//         <Link
//           className="button-form"
//           style={{ marginRight: "10px" }}
//           to="/offer/add"
//         >
//           Add New
//         </Link>
//         <Button className="button-form" onClick={handleExport}>
//           Export Offer
//         </Button>
//       </div>

//       <Modal show={showModal} onHide={handleCloseModal}>
//         <h3 className="text-center">Export Offer</h3>
//         <div className="modal-input">
//           <Form className="modal-form">
//             <Row>
//               <Col>
//                 <Form.Group className="modal-date">
//                   From
//                   <Form.Control
//                     size="sm"
//                     className="w-50"
//                     type="date"
//                     value={fromDate}
//                     onChange={(e) => setFromDate(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col>
//                 <Form.Group className="modal-date">
//                   To
//                   <Form.Control
//                     size="sm"
//                     className="w-50"
//                     type="date"
//                     value={toDate}
//                     onChange={(e) => setToDate(e.target.value)}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           </Form>
//         </div>

//         <div className="offer-button btn-modal ">
//           <button className="button-form" onClick={handleCloseModal}>
//             Cancel
//           </button>
//           <button className="button-form" onClick={handleSubmit}>
//             Export
//           </button>
//         </div>
//         <CSVLink
//           id="csvLink"
//           style={{ display: "none" }}
//           enclosingCharacter={``}
//           separator=";"
//           headers={headersExport}
//           filename={`OfferList-${fromDate}-${toDate}`}
//           data={processedData}
//         />
//       </Modal>
//     </div>
//   );
// }

// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import { BrowserRouter as Router } from 'react-router-dom';
// import CandidateTable from '~/pages/candidates/CandidateTable';
// import { AuthContext } from '~/contexts/auth/AuthContext';
// import { fetchAllCandidate, deleteCandidate } from '~/services/candidateApi';

// // Mock services
// jest.mock('~/services/candidateApi');

// // Mock data
// const mockCandidates = [
//   {
//     id: 1,
//     fullName: 'John Doe',
//     email: 'john.doe@example.com',
//     phone: '1234567890',
//     candidatePosition: 'developer',
//     recruiter: 'Jane Smith',
//     candidateStatus: 'active'
//   },
//   {
//     id: 2,
//     fullName: 'John Smith',
//     email: 'john.smith@example.com',
//     phone: '1234567899',
//     candidatePosition: 'BA',
//     recruiter: 'Jane Smith',
//     candidateStatus: 'active'
//   }
//   // Add more mock candidates if needed
// ];

// describe('CandidateTable Component', () => {
//   const renderComponent = (userRole) => {
//     const user = { role: userRole };
//     render(
//       <AuthContext.Provider value={{ user }}>
//         <Router>
//           <CandidateTable />
//         </Router>
//       </AuthContext.Provider>
//     );
//   };

//   beforeEach(() => {
//     fetchAllCandidate.mockResolvedValue({ data: mockCandidates });
//   });

//   test('renders without crashing', async () => {
//     renderComponent('ROLE_ADMIN');

//     expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
//     await waitFor(() => {
//       expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
//     });
//   });

//   test('search functionality', async () => {
//     renderComponent('ROLE_ADMIN');
//     expect(screen.getByText(/Add new/i)).toBeInTheDocument();

//     await waitFor(() => {
//       expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
//     });

//     const searchInput = screen.getByPlaceholderText(/search/i);
//     const searchStatus = screen.getByTestId("searchStatus");
//     fireEvent.change(searchInput, { target: { value: 'John' } });
//     fireEvent.change(searchStatus,{target: {value: 'active'}})
//     fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter' });

//     await waitFor(() => {
//       expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
//     });
//   });
//   test('pagination works correctly', async () => {
//     renderComponent('ROLE_ADMIN');

//     await waitFor(() => {
//       expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
//     });

//     const nextPageButton = screen.getByRole('button', { name: /Next/i });
//     fireEvent.click(nextPageButton);

//     // Check if the page changes correctly
//     await waitFor(() => {
//       expect(fetchAllCandidate).toHaveBeenCalledTimes(3);
//     });
//   });

//   test('delete candidate functionality', async () => {
//     deleteCandidate.mockResolvedValue({});

//     renderComponent('ROLE_ADMIN');

//     await waitFor(() => {
//       expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
//     });

//     const deleteButton = screen.getByTestId('delete-icon-1');
//     fireEvent.click(deleteButton);

//     const confirmButton = screen.getByRole('button', { name: /Delete/i });
//     fireEvent.click(confirmButton);

//     await waitFor(() => {
//       expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
//     });
//   });

//   test('hides edit, delete, and add new buttons for ROLE_INTERVIEW', async () => {
//     renderComponent('ROLE_INTERVIEW');

//     await waitFor(() => {
//       expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
//       expect(screen.getByText(/John Smith/i)).toBeInTheDocument();
//     });

//     // Check that the add new button is not present
//     expect(screen.queryByText(/Add new/i)).not.toBeInTheDocument();

//     // Check that edit and delete icons are not present
//     expect(screen.queryByTestId('edit-icon-1')).not.toBeInTheDocument();
//     expect(screen.queryByTestId('delete-icon-1')).not.toBeInTheDocument();
//     expect(screen.queryByTestId('edit-icon-2')).not.toBeInTheDocument();
//     expect(screen.queryByTestId('delete-icon-2')).not.toBeInTheDocument();
//   });
// });

// <Row>
// <Col xs={6}>
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Candidate
//     </Form.Label>
//     <Col sm={9}>
//       <Form.Label>
//         {Object.values(detailOffer.candidate || {}).join(", ")}
//       </Form.Label>
//     </Col>
//     <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//   </Form.Group>
// </Col>
// <Col xs={6} className="mb-3">
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Contract Type
//     </Form.Label>
//     <Col sm={9}>
//       <Form.Label>
//         {constractType[detailOffer.contractType] || ""}
//       </Form.Label>
//       <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//     </Col>
//   </Form.Group>
// </Col>
// </Row>
// {/* Second Row */}
// <Row>
// <Col xs={6}>
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Position
//     </Form.Label>
//     <Col sm={9}>
//       <Form.Label>
//         {offerPosition[detailOffer.position] || ""}
//       </Form.Label>
//     </Col>
//     <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//   </Form.Group>
// </Col>
// <Col xs={6} className="mb-3">
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Level
//     </Form.Label>
//     <Col sm={9}>
//       <Form.Label>
//         {offerLevel[detailOffer.offerLevel] || ""}
//       </Form.Label>
//       <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//     </Col>
//   </Form.Group>
// </Col>
// </Row>
// {/* Third Row */}
// <Row>
// <Col xs={6}>
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Approver
//     </Form.Label>
//     <Col sm={9}>
//       <Form.Label>{detailOffer.approvedBy || "N/A"}</Form.Label>
//     </Col>
//     <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//   </Form.Group>
// </Col>
// <Col xs={6} className="mb-3">
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Department
//     </Form.Label>
//     <Col sm={9}>
//       <Form.Label>
//         {departmentOffer[detailOffer.department] || ""}
//       </Form.Label>
//       <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//     </Col>
//   </Form.Group>
// </Col>
// </Row>
// {/* Fourth Row */}
// <Row>
// <Col xs={6}>
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Interview Info
//     </Form.Label>
//     <Col sm={9}>
//       <Form.Label>
//         Interviewer:{" "}
//         {detailOffer.interviewSchedule
//           ? detailOffer.interviewSchedule.interviewerDto
//               .map((interviewer) => interviewer.name)
//               .join(", ")
//           : ""}
//       </Form.Label>
//     </Col>
//     <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//   </Form.Group>
// </Col>
// <Col xs={6} className="mb-3">
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Recruiter Owner
//     </Form.Label>
//     <Col sm={9}>
//       <Form.Label>
//         {detailOffer.recruiterOwner?.name || ""}
//       </Form.Label>
//       <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//     </Col>
//   </Form.Group>
// </Col>
// </Row>
// {/* Fifth Row */}
// <Row>
// <Col xs={6}>
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Contract Period
//     </Form.Label>
//     <Col sm={9}>
//       <Row>
//         <Col sm={2}>From</Col>

//         <Col sm={3}>
//           <Form.Label>
//             {detailOffer.contractFrom
//               ? detailOffer.contractFrom.join("-")
//               : ""}
//           </Form.Label>
//         </Col>
//         <Col sm={2}>To</Col>
//         <Col sm={5}>
//           <Form.Label>
//             {detailOffer.contractTo
//               ? detailOffer.contractTo.join("-")
//               : ""}
//           </Form.Label>
//         </Col>
//       </Row>
//       <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//     </Col>
//   </Form.Group>
// </Col>
// <Col xs={6} className="mb-3">
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Due Date
//     </Form.Label>
//     <Col sm={9}>
//       <Form.Label>
//         {detailOffer.dueDate ? detailOffer.dueDate.join("-") : ""}
//       </Form.Label>
//     </Col>
//     <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//   </Form.Group>
// </Col>
// </Row>
// <Row>
// <Col xs={6}>
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Interview Notes
//     </Form.Label>
//     <Col sm={9}>
//       <Form.Label>
//         {detailOffer &&
//         detailOffer.interviewSchedule &&
//         detailOffer.interviewSchedule.notes
//           ? detailOffer.interviewSchedule.notes
//           : "No notes available"}
//       </Form.Label>
//     </Col>
//   </Form.Group>
// </Col>
// <Col xs={6} className="mb-3">
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Basic Salary
//     </Form.Label>
//     <Col sm={9}>
//       <Form.Label>{detailOffer.basicSalary} VND</Form.Label>
//     </Col>
//   </Form.Group>
// </Col>
// </Row>
// {/* Sixth Row */}
// <Row>
// <Col xs={6}>
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Status
//     </Form.Label>
//     <Col sm={9}>
//       <Form.Label>{statusOffer[detailOffer.offerStatus] || ""}</Form.Label>
//     </Col>
//     <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//   </Form.Group>
// </Col>
// <Col xs={6} className="mb-3">
//   <Form.Group as={Row}>
//     <Form.Label column sm={3}>
//       Note
//     </Form.Label>
//     <Col sm={9}>
//       <Form.Label>{detailOffer.note || ""}</Form.Label>

//       <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
//     </Col>
//   </Form.Group>
// </Col>
// </Row>

// <Row>
// <div className="button-offer btn-top">
//   {buttons.topButtons.map((button, index) => (
//     <button
//       key={index}
//       type="button"
//       className="button-submit"
//       style={button.style}
//       onClick={() => {
//         if (button.status) {
//           if (button.status === "CANCELLED_OFFER") {
//             setShowCancelModal(true);
//           } else {
//             handleStatusChange(button.status);
//           }
//         } else if (button.action === "EDIT") {
//           navigate(`/offer/edit/${detailOffer.id}`);
//         } else if (button.action === "CANCEL") {
//           navigate("/offer");
//         }
//       }}
//     >
//       {button.label}
//     </button>
//   ))}
// </div>
// </Row>
// <Row>
// <Col>
//   <p>
//     <strong>Candidate:</strong>{" "}
//     {Object.values(detailOffer.candidate || {}).join(", ")}
//   </p>
//   <p>
//     <strong>Position:</strong>{" "}
//     {offerPosition[detailOffer.position] || ""}
//   </p>
//   <p>
//     <strong>Approver:</strong>
//     {detailOffer.approvedBy || "N/A"}
//   </p>
//   <p>
//     <strong>Interview Info:</strong>{" "}
//     {detailOffer.interviewSchedule
//       ? detailOffer.interviewSchedule.interviewerDto
//           .map((interviewer) => interviewer.name)
//           .join(", ")
//       : ""}
//   </p>
//   <p>
//     <strong>Contract Period </strong> <strong>From</strong>
//     {detailOffer.contractFrom
//       ? detailOffer.contractFrom.join("-")
//       : ""}
//     <strong>To   </strong>
//     {detailOffer.contractTo
//       ? detailOffer.contractTo.join("-")
//       : ""}
//   </p>
//   <p>
//     <strong> Interview Notes:</strong>
//     {detailOffer &&
//     detailOffer.interviewSchedule &&
//     detailOffer.interviewSchedule.notes
//       ? detailOffer.interviewSchedule.notes
//       : "No notes available"}
//   </p>
//   <p>
//     <strong>Status:</strong>
//     {statusOffer[detailOffer.offerStatus] || ""}
//   </p>
// </Col>
// <Col>
//   <p>
//     <strong>Contract Type:</strong>{" "}
//     {constractType[detailOffer.contractType] || ""}
//   </p>
//   <p>
//     <strong>Level:</strong>{" "}
//     {offerLevel[detailOffer.offerLevel] || ""}
//     </p>
//   <p>
//     <strong>Department:</strong>
//     {departmentOffer[detailOffer.department] || ""}
//   </p>
//   <p>
//     <strong> Recruiter Owner:</strong>{" "}
//     {detailOffer.recruiterOwner?.name || ""}
//   </p>
//   <p>
//     <strong> Due Date:</strong>
//     {detailOffer.dueDate ? detailOffer.dueDate.join("-") : ""}
//     </p>
//   <p>
//     <strong> Basic Salary:</strong>
//     {detailOffer.basicSalary} VND
//   </p>
//   <p>
//     <strong>Note:</strong>
//     {detailOffer.note || ""}
//   </p>
// </Col>
// </Row>
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, Link } from "react-router-dom";
// import { FaAngleRight } from "react-icons/fa6";
// import { Row, Col } from "react-bootstrap";
// import "../../assets/css/offer-css/offer.css";
// import { Container, Form } from "react-bootstrap";
// import ApiService from "../../services/serviceApiOffer";
// import { fetchAllCandidate } from "~/services/candidateApi";
// import ApiUser from "~/services/usersApi";
// import {
//   departmentOffer,
//   constractType,
//   offerLevel,
//   offerPosition,
// } from "~/data/Constants";
// import { toast } from "react-toastify";

// const EditOffer = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [offerDetail, setOfferDetail] = useState({});
//   const [candidates, setCandidateDTO] = useState([]);
//   const [interview, setInterviewDTO] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [dateError, setDateError] = useState("");
//   const [interviewNotes, setInterviewNotes] = useState("");
//   const [formData, setFormData] = useState({
//     id: "",
//     candidateId: "",
//     contractType: "",
//     position: "",
//     offerLevel: "",
//     approvedBy: "",
//     department: "",
//     interviewSchedule: "",
//     recruiterOwnerId: "",
//     contractFrom: "",
//     contractTo: "",
//     dueDate: "",
//     basicSalary: "",
//     note: "",
//     email: "null",
//     offerStatus: "",
//   });

//   const loadData = async (id) => {
//     try {
//       const response = await ApiService.ApiDetailOffer(id);
//       console.log("Offer detail response:", response);
//       setOfferDetail(response);
//       setFormData((prevState) => {
//         const newState = {
//           ...prevState,
//           ...response,
//           id: response.id || null,
//           email: response.email || "null",
//           offerStatus: response.offerStatus || "",
//         };
//         console.log("New form data state:", newState);
//         return newState;
//       });
//       if (response.interviewSchedule && response.interviewSchedule.note) {
//         setInterviewNotes(response.interviewSchedule.note);
//       }
//       const responseCa = await fetchAllCandidate();
//       setCandidateDTO(responseCa.data);
//       const responseInter = await ApiService.ApiInterview();
//       setInterviewDTO(responseInter.data);
//       const responseUser = await ApiUser.getUsers();
//       setUsers(responseUser.data);
//     } catch (error) {
//       console.error("Error loading offer details:", error);
//     }
//   };

//   useEffect(() => {
//     loadData(id);
//   }, [id]);

//   useEffect(() => {
//     console.log("Interview data:", interview);
//   }, [interview]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevState) => {
//       const newState = { ...prevState, [name]: value };

//       if (name === "candidateId") {
//         console.log("Selected candidate ID:", value);
//         const selectedInterview = interview.find(
//           (inter) => inter.candidate.id === parseInt(value) && inter.interviewResult === "PASS"
//         );
//         console.log("Selected interview:", selectedInterview);
//         if (selectedInterview) {
//           newState.interviewSchedule = selectedInterview.id;
//           setInterviewNotes(selectedInterview.note || "");
//         } else {
//           newState.interviewSchedule = "";
//           setInterviewNotes("");
//         }
//       }

//       if (name === "interviewSchedule") {
//         const selectedInterview = interview.find(
//           (inter) => inter.id === parseInt(value)
//         );
//         console.log("Selected interview schedule:", selectedInterview);
//         if (selectedInterview) {
//           setInterviewNotes(selectedInterview.note || "");
//         } else {
//           setInterviewNotes("");
//         }
//       }

//       if (name === "contractFrom" || name === "contractTo") {
//         const from = name === "contractFrom" ? value : newState.contractFrom;
//         const to = name === "contractTo" ? value : newState.contractTo;

//         if (from && to) {
//           if (new Date(from) > new Date(to)) {
//             setDateError("Start date cannot be after end date");
//           } else {
//             setDateError("");
//           }
//         }

//         const today = new Date().toISOString().split("T")[0];
//         if (from < today) {
//           setDateError("Start date cannot be in the past");
//         }
//       }
//       if (name === "note" && value.length > 500) {
//         return prevState;
//       }
//       return newState;
//     });
//   };

//   const handleEdit = async (e) => {
//     e.preventDefault();
//     if (dateError) {
//       alert("Please correct the date errors before submitting.");
//       return;
//     }
//     try {
//       const dataToSubmit = {
//         ...formData,
//         offerStatus: formData.offerStatus || offerDetail.offerStatus,
//       };
//       const responseEdit = await ApiService.ApiEditOffer(dataToSubmit);
//       console.log("Change has been successfully updated", responseEdit.data);
//       toast("Change has been successfully updated");
//       navigate("/offer");
//     } catch (error) {
//       console.error("Error editing offer:", error);
//       toast("Failed to updated change");
//     }
//   };

//   return (
//     <Container className="mb-3">
//       <div className="breadcrumb__group">
//         <span className="breadcrumb-link" onClick={() => navigate("/offer")}>
//           Offer List
//         </span>
//         <FaAngleRight />
//         <span className="breadcrumb-link__active">Edit Offer</span>
//       </div>
//       <div className="content-offer-form">
//         <Row>
//           <Form onSubmit={handleEdit}>
//             <Row>
//               <Col xs={6}>
//                 <Form.Group as={Row}>
//                   <Form.Label column sm={3}>
//                     Candidate <span style={{ color: "red" }}>*</span>
//                   </Form.Label>
//                   <Col sm={9}>
//                     <Form.Select
//                       name="candidateId"
//                       value={formData.candidateId}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select Candidate Name</option>
//                       {Array.isArray(interview) &&
//                         interview
//                           .filter((inter) => inter.interviewResult === "PASS")
//                           .map((interviewCa) => (
//                             <option
//                               key={interviewCa.candidate.id}
//                               value={interviewCa.candidate.id}
//                             >
//                               {interviewCa.candidate.fullName}
//                             </option>
//                           ))}
//                     </Form.Select>
//                   </Col>
//                 </Form.Group>
//               </Col>
//               <Col xs={6} className="mb-3">
//                 <Form.Group as={Row}>
//                   <Form.Label column sm={3}>
//                     Contract Type <span style={{ color: "red" }}>*</span>
//                   </Form.Label>
//                   <Col sm={9}>
//                     <Form.Select
//                       name="contractType"
//                       value={formData.contractType}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select a type of contract</option>
//                       {Object.entries(constractType).map(([value, name]) => (
//                         <option key={value} value={value}>
//                           {name}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Col>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col xs={6}>
//                 <Form.Group as={Row}>
//                   <Form.Label column sm={3}>
//                     Position <span style={{ color: "red" }}>*</span>
//                   </Form.Label>
//                   <Col sm={9}>
//                     <Form.Select
//                       name="position"
//                       value={formData.position}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select a Position</option>
//                       {Object.entries(offerPosition).map(([value, name]) => (
//                         <option key={value} value={value}>
//                           {name}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Col>
//                 </Form.Group>
//               </Col>
//               <Col xs={6} className="mb-3">
//                 <Form.Group as={Row}>
//                   <Form.Label column sm={3}>
//                     Level <span style={{ color: "red" }}>*</span>
//                   </Form.Label>
//                   <Col sm={9}>
//                     <Form.Select
//                       name="offerLevel"
//                       value={formData.offerLevel}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select a level</option>
//                       {Object.entries(offerLevel).map(([value, name]) => (
//                         <option key={value} value={value}>
//                           {name}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Col>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col xs={6}>
//                 <Form.Group as={Row}>
//                   <Form.Label column sm={3}>
//                     Approver <span style={{ color: "red" }}>*</span>
//                   </Form.Label>
//                   <Col sm={9}>
//                     <Form.Select
//                       name="approvedBy"
//                       value={formData.approvedBy}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select an approver</option>
//                       {Array.isArray(users) &&
//                         users
//                           .filter((user) => user.userRole === "ROLE_MANAGER")
//                           .map((user) => (
//                             <option key={user.id} value={user.id}>
//                               {user.fullName}
//                             </option>
//                           ))}
//                     </Form.Select>
//                   </Col>
//                 </Form.Group>
//               </Col>
//               <Col xs={6} className="mb-3">
//                 <Form.Group as={Row}>
//                   <Form.Label column sm={3}>
//                     Department<span style={{ color: "red" }}>*</span>
//                   </Form.Label>
//                   <Col sm={9}>
//                     <Form.Select
//                       name="department"
//                       value={formData.department}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select a department</option>
//                       {Object.entries(departmentOffer).map(([value, name]) => (
//                         <option key={value} value={value}>
//                           {name}
//                         </option>
//                       ))}
//                     </Form.Select>
//                   </Col>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row>
//               <Col xs={6}>
//                 <Form.Group as={Row}>
//                   <Form.Label column sm={3}>
//                     Interview info <span style={{ color: "red" }}>*</span>
//                   </Form.Label>
//                   <Col sm={9}>
//                     <Form.Select
//                       name="interviewSchedule"
//                       value={formData.interviewSchedule || ""}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="">Select an interview schedule</option>
//                       {Array.isArray(interview) &&
//                         interview
//                           .filter((inter) => inter.candidate.id === parseInt(formData.candidateId))
//                           .map((inter) => (
//                             <option key={inter.id} value={inter.id}>
//                               {inter.title || `Interview ${inter.id}`} -{" "}
//                               {inter.interviewerSet
//                                 ? inter.interviewerSet.map((interviewer) => interviewer.name).join(", ")
//                                 : "No interviewers"}
//                             </option>
//                           ))}
//                     </Form.Select>
//                   </Col>
//                 </Form.Group>
//               </Col>
//               <Col xs={6} className="mb-3">
//                 <Form.Group as={Row}>
//                   <Form.Label column sm={3}>
//                     Interview Notes
//                   </Form.Label>
//                   <Col sm={9}>
//                     <Form.Control
//                       as="textarea"
//                       readOnly
//                       value={interviewNotes}
//                     />
//                   </Col>
//                 </Form.Group>
//               </Col>
//             </Row>

//             {/* Các phần còn lại của form giữ nguyên */}

//             <Row>
//               <div className="button-offer btn-bottom">
//                 <button type="submit" className="button-submit">
//                   Submit
//                 </button>
//                 <button
//                   type="button"
//                   className="button-submit"
//                   onClick={() => navigate("/offer")}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </Row>
//           </Form>
//         </Row>
//       </div>
//     </Container>
//   );
// };

// export default EditOffer;
// console.log("skillIds:", skillIds);

// console.log("Updating candidate with the following details:", {
//   id: selectedCandidate.id,
//   candidateStatus: formData.offerStatus, // Cập nhật trạng thái candidate dựa trên trạng thái offer
//   fullName: selectedCandidate.fullName,
//   dob: selectedCandidate.dob
// ? new Date(selectedCandidate.dob[0], selectedCandidate.dob[1] - 1, selectedCandidate.dob[2])
//     .toISOString()
//     .split("T")[0]
// : "",
//   phone: selectedCandidate.phone,
//   email: selectedCandidate.email,
//   address: selectedCandidate.address,
//   gender: selectedCandidate.gender,
//   skillIds:skillIds,
//   recruiterId: recruiterId,
//   attachFile: selectedCandidate.attachFile,
//   candidatePosition: selectedCandidate.candidatePosition,
//   yearExperience: selectedCandidate.yearExperience,
//   highestLevel: selectedCandidate.highestLevel,
//   note: selectedCandidate.note,
// });
