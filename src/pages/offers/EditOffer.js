import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import { Row, Col } from "react-bootstrap";
import "../../assets/css/offer-css/offer.css";
import { Container, Form } from "react-bootstrap";
import ApiService from "../../services/serviceApiOffer";

import ApiUser from "~/services/usersApi";
import {
  departmentOffer,
  constractType,
  offerLevel,
  offerPosition,
  statusOffer,
} from "~/data/Constants";
import { toast } from "react-toastify";
import { fetchAllCandidate } from "~/services/candidateApi";

const EditOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offerDetail, setOfferDetail] = useState({});
  const [interview, setInterviewDTO] = useState([]);
  const [interviewNotes, setInterviewNotes] = useState("");
  const [users, setUsers] = useState([]);
  const [dateError, setDateError] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [errors, setErrors] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page") || 1;

  const [formData, setFormData] = useState({
    id: "",
    candidateId: "",
    contractType: "",
    position: "",
    offerLevel: "",
    approvedBy: "",
    department: "",
    interviewSchedule: "",
    recruiterOwnerId: "",
    contractFrom: "",
    contractTo: "",
    dueDate: "",
    basicSalary: "",
    note: "",
    email: "null",
    offerStatus: "",
  });
  useEffect(() => {
    const loadData = async (id) => {
      try {
        const offerResponse = await ApiService.ApiDetailOffer(id);

        const [responseUser, responseCa, responseInter] = await Promise.all([
          ApiUser.getUsers(),
          fetchAllCandidate(),
          ApiService.ApiInterview(),
        ]);

        const users = responseUser.data;
        const candidates = responseCa.data;
        const interviews = responseInter.data;

        setUsers(users);
        setCandidates(candidates);
        setInterviewDTO(interviews);

        // Sau khi tất cả dữ liệu đã được load, set formData
        const selectedInterview = interviews.find(
          (inter) => inter.id === offerResponse.interviewSchedule?.id
        );
        const approver = users.find(
          (user) => user.username === offerResponse.approvedBy
        );
        const approvedById = approver ? approver.id : null;

        setFormData({
          id: offerResponse.id || "",
          candidateId: offerResponse.candidate
            ? Number(Object.keys(offerResponse.candidate)[0])
            : null,
          contractType: offerResponse.contractType || "",
          position: offerResponse.position || "",
          offerLevel: offerResponse.offerLevel || "",
          approvedBy: approvedById || "",
          department: offerResponse.department || "",
          interviewSchedule: selectedInterview ? selectedInterview.id : "",
          recruiterOwnerId: offerResponse.recruiterOwner.id || "",
          contractFrom: formatDate(offerResponse.contractFrom),
          contractTo: formatDate(offerResponse.contractTo),
          dueDate: formatDate(offerResponse.dueDate),
          basicSalary: offerResponse.basicSalary || "",
          note: offerResponse.note || "",
          email: offerResponse.email || "null",
          offerStatus: offerResponse.offerStatus || "",
        });

        if (selectedInterview) {
          setInterviewNotes(selectedInterview.note || "");
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData(id);
  }, [id]);

  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray) && dateArray.length === 3) {
      return `${dateArray[0]}-${String(dateArray[1]).padStart(2, "0")}-${String(
        dateArray[2]
      ).padStart(2, "0")}`;
    }
    return "";
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "candidateId") {
      const selectedCandidate = candidates.find(
        (candidate) => candidate.id === parseInt(value)
      );

      if (
        selectedCandidate &&
        selectedCandidate.candidateStatus === "PASSED_INTERVIEW"
      ) {
        const selectedInterview = interview.find(
          (inter) =>
            inter.candidate.id === selectedCandidate.id &&
            inter.interviewResult === "PASS"
        );

        if (selectedInterview) {
          setFormData((prevState) => ({
            ...prevState,
            interviewSchedule: selectedInterview.id,
          }));
          setInterviewNotes(selectedInterview.note || "");
        } else {
          setFormData((prevState) => ({
            ...prevState,
            interviewSchedule: "",
          }));
          setInterviewNotes("");
        }
      } else {
        setFormData((prevState) => ({
          ...prevState,
          interviewSchedule: "",
        }));
        setInterviewNotes("");
      }
    }

    if (name === "interviewSchedule") {
      const selectedInterview = interview.find(
        (inter) => inter.id === parseInt(value)
      );
      if (selectedInterview) {
        setInterviewNotes(selectedInterview.note || "");
      } else {
        setInterviewNotes("");
      }
    }

    if (name === "contractFrom" || name === "contractTo") {
      const from = name === "contractFrom" ? value : formData.contractFrom;
      const to = name === "contractTo" ? value : formData.contractTo;

      if (from && to) {
        if (new Date(from) > new Date(to)) {
          setDateError("Start date cannot be after end date");
        } else {
          setDateError("");
        }
      }

      const today = new Date().toISOString().split("T")[0];
      if (from < today) {
        setDateError("Start date cannot be in the past");
      }
    }

    if (name === "note" && value.length > 500) {
      setErrors((prev) => ({
        ...prev,
        note: "Note cannot exceed 500 characters",
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    ////////////////
    if (name === "basicSalary") {
      const numericValue = value.replace(/[^0-9]/g, "");
      if (isNaN(parseInt(numericValue, 10))) {
        setErrors((prev) => ({
          ...prev,
          basicSalary: "Vui lòng nhập một số hợp lệ",
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          basicSalary: numericValue,
        }));
        setErrors((prev) => ({ ...prev, basicSalary: "" }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  /////////////////////////////////
  const handleEdit = async (e) => {
    e.preventDefault();
    if (dateError) {
      alert("Please correct the date errors before submitting.");
      return;
    }

    const dataToSubmit = {
      ...formData,
      offerStatus: formData.offerStatus || offerDetail.offerStatus,
    };
    const responseEdit = await ApiService.ApiEditOffer(dataToSubmit);
    if (responseEdit) {
      toast.success("Change has been successfully updated");
      navigate("/offer");
    } else {
      toast.error("Failed to update change");
    }
  };
  return (
    <Container className="mb-3">
      <div className="breadcrumb__group">
        <span className="breadcrumb-link" onClick={() => navigate("/offer")}>
          Offer List
        </span>
        <FaAngleRight />
        <span className="breadcrumb-link__active">Edit Offer</span>
      </div>
      <div>
        <Row>
          <Form onSubmit={handleEdit}>
            <div className="content-offer-form">
              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong> Candidate:</strong>{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        id="candidateId"
                        name="candidateId"
                        value={formData.candidateId || ""}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Candidate Name</option>
                        {Array.isArray(candidates) &&
                          candidates
                            .filter(
                              (candidate) =>
                                candidate.candidateStatus === "PASSED_INTERVIEW"
                            )
                            .map((candidate) => (
                              <option key={candidate.id} value={candidate.id}>
                                {candidate.fullName}
                              </option>
                            ))}
                        {Array.isArray(candidates) &&
                          candidates.map((candidate) => (
                            <option
                              disabled
                              key={candidate.id}
                              value={candidate.id}
                            >
                              {candidate.fullName}
                            </option>
                          ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Contract Type:</strong>{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        name="contractType"
                        value={formData.contractType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a type of contract</option>
                        {Object.entries(constractType).map(([value, name]) => (
                          <option key={value} value={value}>
                            {name}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong> Position:</strong>{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a Position</option>
                        {Object.entries(offerPosition).map(([value, name]) => (
                          <option key={value} value={value}>
                            {name}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Level:</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        name="offerLevel"
                        value={formData.offerLevel}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a level</option>
                        {Object.entries(offerLevel).map(([value, name]) => (
                          <option key={value} value={value}>
                            {name}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong> Approver:</strong>{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        name="approvedBy"
                        value={formData.approvedBy}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select an approver</option>
                        {Array.isArray(users) &&
                          users
                            .filter((user) => user.userRole === "ROLE_MANAGER")
                            .map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.fullName}
                              </option>
                            ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Department:</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select a department</option>
                        {Object.entries(departmentOffer).map(
                          ([value, name]) => (
                            <option key={value} value={value}>
                              {name}
                            </option>
                          )
                        )}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Interview Info:</strong>{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        name="interviewSchedule"
                        value={formData.interviewSchedule}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select an interview schedule</option>
                        {Array.isArray(interview) &&
                          interview
                            .filter(
                              (inter) =>
                                inter.candidate.id ===
                                parseInt(formData.candidateId)
                            )
                            .map((inter) => (
                              <option key={inter.id} value={inter.id}>
                                {inter.title || `Interview ${inter.id}`} -{" "}
                                {inter.interviewerSet
                                  ? inter.interviewerSet
                                      .map((interviewer) => interviewer.name)
                                      .join(", ")
                                  : "No interviewers"}
                              </option>
                            ))}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong> Recruiter Owner:</strong>{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        name="recruiterOwnerId"
                        value={formData.recruiterOwnerId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Recruiter Owner</option>
                        {Array.isArray(users) &&
                          users
                            .filter(
                              (user) => user.userRole === "ROLE_RECRUITER"
                            )
                            .map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.fullName}-{user.username}
                              </option>
                            ))}
                      </Form.Select>
                      <Link
                        className="text-assigned"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            recruiterOwnerId: "currentUser",
                          }))
                        }
                      >
                        Assigned to me
                      </Link>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong> Contract Period</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Row>
                        <Col sm={2}>
                          {" "}
                          <strong>From: </strong>
                        </Col>
                        <Col sm={4}>
                          <Form.Control
                            size="sm"
                            className="w-100"
                            type="date"
                            name="contractFrom"
                            value={formData.contractFrom}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </Col>
                        <Col sm={2}>
                          {" "}
                          <strong>To: </strong>
                        </Col>
                        <Col sm={4}>
                          <Form.Control
                            size="sm"
                            className="w-100"
                            type="date"
                            name="contractTo"
                            value={formData.contractTo}
                            onChange={handleInputChange}
                            min={
                              formData.contractFrom ||
                              new Date().toISOString().split("T")[0]
                            }
                          />
                        </Col>
                      </Row>
                      {dateError && (
                        <div className="text-danger">{dateError}</div>
                      )}
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Due Date:</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong> Interview Notes:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        as="textarea"
                        readOnly
                        value={interviewNotes}
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Basic Salary:</strong>{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        placeholder="Enter basic salary"
                        name="basicSalary"
                        value={formData.basicSalary}
                        onChange={handleInputChange}
                        required
                      />
                      {errors && (
                        <div className="text-danger"> {errors.basicSalary}</div>
                      )}
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong> Status:</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.FloatingLabel style={{ fontSize: "18px" }}>
                        {statusOffer[formData.offerStatus]}
                      </Form.FloatingLabel>
                    </Col>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Note:</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        as="textarea"
                        placeholder="Type a note"
                        style={{ minHeight: "100px" }}
                        name="note"
                        value={formData.note}
                        onChange={handleInputChange}
                        maxLength={500}
                      />
                      <Form.Text
                        className={errors.note ? "text-danger" : "text-muted"}
                      >
                        {errors.note ||
                          `${formData.note.length}/500 characters`}
                      </Form.Text>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="button-group ">
              <button
                type="submit"
                className="button-form button-form--success"
              >
                Submit
              </button>
              <button
                type="button"
                className="button-form  button-form--danger"
                onClick={() => navigate("/offer")}
              >
                Cancel
              </button>
            </div>
          </Form>
        </Row>
      </div>
    </Container>
  );
};

export default EditOffer;
