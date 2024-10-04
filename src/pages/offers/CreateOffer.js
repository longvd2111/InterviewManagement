import React, { useEffect, useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../../assets/css/offer-css/offer.css";
import "../../assets/css/candidate-css/CandidateDetail.css";
import {
  departmentOffer,
  constractType,
  offerLevel,
  offerPosition,
  optionsSkills,
} from "~/data/Constants";
import ApiService from "~/services/serviceApiOffer";
import ApiUser from "~/services/usersApi";
import { toast } from "react-toastify";
import { fetchAllCandidate, updateCandidate } from "~/services/candidateApi";
import { getMeetID } from "~/utils/Validate";
import { getMessage } from "~/data/Messages";

export default function CreateOffer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [interview, setInterview] = useState([]);
  const [users, setUsers] = useState([]);
  const [dateError, setDateError] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [errors, setErrors] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [detailOffer, setDetailOffer] = useState({});
  const defaultJwtPayload = {
    userId: 0,
    role: "", // Role dưới dạng chuỗi rỗng ban đầu
    sub: "",
  };

  // Sử dụng useState với đối tượng defaultJwtPayload
  const [currentUser, setCurrentUser] = useState(defaultJwtPayload);

  const [formData, setFormData] = useState({
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
    offerStatus: "WAITING_FOR_APPROVAL",
  });
  const loadData = async () => {
    try {
      const responseInter = await ApiService.ApiInterview();
      setInterview(responseInter.data);

      const responseUser = await ApiUser.getUsers();
      setUsers(responseUser.data);

      const responseCandidate = await fetchAllCandidate();
      setCandidates(responseCandidate.data);

      if (id) {
        const offerDetails = await ApiService.ApiDetailOffer(id);
        setDetailOffer(offerDetails);

        if (offerDetails.candidate) {
          const candidateId = Number(
            Object.keys(offerDetails.data.candidate)[0]
          );
          const candidate = responseCandidate.data.find(
            (cand) => cand.id === candidateId
          );

          if (candidate) {
            // Cập nhật trạng thái của ứng viên
            await updateCandidate({
              id: candidate.id,
              candidateStatus: offerDetails.offerStatus,
              fullName: candidate.fullName,
              dob: candidate.dob,
              phone: candidate.phone,
              email: candidate.email,
              address: candidate.address,
              gender: candidate.gender,
              skillIds: candidate.skillIds,
              recruiterId: candidate.recruiterId,
              attachFile: candidate.attachFile,
              candidatePosition: candidate.candidatePosition,
              yearExperience: candidate.yearExperience,
              highestLevel: candidate.highestLevel,
              note: candidate.note,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error loading:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const updateCandidateStatus = async (candidateId, status) => {
    try {
      await updateCandidate({
        id: candidateId,
        candidateStatus: status,
      });
    } catch (error) {
      console.error("Error updating candidate status:", error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const newState = { ...prevState, [name]: value };
      if (name === "candidateId") {
        const selectedCandidate = candidates.find(
          (candidate) => candidate.id === parseInt(value)
        );
        if (selectedCandidate) {
          newState.position = selectedCandidate.candidatePosition;
          const recruiter = users.find(
            (user) => 
              user.userRole === "ROLE_RECRUITER" && 
              user.fullName === selectedCandidate.recruiter
          );
  
          if (recruiter) {
            newState.recruiterOwnerId = recruiter.id.toString();
          }
          const selectedInterview = interview.find(
            (inter) =>
              inter.candidate.id === parseInt(value) &&
              inter.interviewResult === "PASS"
          );

          if (selectedInterview) {
            newState.interviewSchedule = selectedInterview.id;
            setInterviewNotes(selectedInterview.note || "");
          } else {
            newState.interviewSchedule = "";
            setInterviewNotes("");
          }
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            candidateId: undefined,
            position: undefined,
            interviewSchedule: undefined,
            recruiterOwnerId: undefined,
          }));
        }
      }

      if (
        name === "contractFrom" ||
        name === "contractTo" ||
        name === "dueDate"
      ) {
        const from = name === "contractFrom" ? value : newState.contractFrom;
        const to = name === "contractTo" ? value : newState.contractTo;
        const due = name === "dueDate" ? value : newState.dueDate;
        const today = new Date().toISOString().split("T")[0];

        if (from && to && new Date(from) > new Date(to)) {
          setDateError("Start date cannot be after end date");
        } else if (due && new Date(due) < new Date(today)) {
          setDateError("Due date cannot be in the past");
        } else {
          setDateError("");
        }
      }

      if (name === "note") {
        if (value.length <= 500) {
          newState[name] = value;
          setErrors((prev) => ({ ...prev, note: "" }));
        } else {
          setErrors((prev) => ({
            ...prev,
            note: "Note cannot exceed 500 characters",
          }));
          return prevState;
        }
      }

      if (name === "basicSalary") {
        const numericValue = value.replace(/[^0-9]/g, "");
        if (isNaN(parseInt(numericValue, 10))) {
          setErrors((prev) => ({
            ...prev,
            basicSalary: "Please enter a valid number",
          }));
        } else {
          newState[name] = numericValue;
          setErrors((prev) => ({ ...prev, basicSalary: "" }));
        }
      }

      return newState;
    });

    // Clear error when user inputs data
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.candidateId) errors.candidateId = getMessage("M002");
    if (!formData.contractType) errors.contractType = getMessage("M002");
    if (!formData.position) errors.position = getMessage("M002");
    if (!formData.offerLevel) errors.offerLevel = getMessage("M002");
    if (!formData.approvedBy) errors.approvedBy = getMessage("M002");
    if (!formData.department) errors.department = getMessage("M002");
    if (!formData.interviewSchedule)
      errors.interviewSchedule = getMessage("M002");
    if (!formData.recruiterOwnerId)
      errors.recruiterOwnerId = getMessage("M002");
    if (!formData.dueDate) errors.dueDate = getMessage("M002");
    if (!formData.basicSalary) errors.basicSalary = getMessage("M002");
    if (!formData.contractFrom) errors.contractFrom = getMessage("M002");
    if (!formData.contractTo) errors.contractTo = getMessage("M002");
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    if (dateError) {
      alert("Please correct the date errors before submitting.");
      return;
    }
    try {
      const selectedCandidate = candidates.find(
        (candidate) => candidate.id === parseInt(formData.candidateId)
      );
      // Lọc người dùng với vai trò ROLE_RECRUITER
      const recruiters = users.filter((us) => us.userRole === "ROLE_RECRUITER");

      // Tìm người tuyển dụng dựa trên tên
      const recruiter = recruiters.find(
        (user) => user.fullName === selectedCandidate.recruiter
      );

      let recruiterId = null;
      if (recruiter) {
        recruiterId = recruiter.id;
      }
      ////////////////
      const skillIds = selectedCandidate.skills
        .map((skill) => {
          const skillOption = optionsSkills.find(
            (option) => option.label.toLowerCase() === skill.toLowerCase()
          );
          return skillOption ? skillOption.value : null;
        })
        .filter((value) => value !== null);

      if (selectedCandidate) {
        await updateCandidate({
          id: selectedCandidate.id,
          candidateStatus: formData.offerStatus, // Cập nhật trạng thái candidate dựa trên trạng thái offer
          fullName: selectedCandidate.fullName,
          dob: selectedCandidate.dob
            ? new Date(
                selectedCandidate.dob[0],
                selectedCandidate.dob[1] - 1,
                selectedCandidate.dob[2]
              )
                .toISOString()
                .split("T")[0]
            : "",
          phone: selectedCandidate.phone,
          email: selectedCandidate.email,
          address: selectedCandidate.address,
          gender: selectedCandidate.gender,
          skillIds: skillIds,
          recruiterId: recruiterId,
          attachFile: selectedCandidate.attachFile,
          candidatePosition: selectedCandidate.candidatePosition,
          yearExperience: selectedCandidate.yearExperience,
          highestLevel: selectedCandidate.highestLevel,
          note: selectedCandidate.note,
        });
      }
      const response = await ApiService.ApiAddOffer(formData);
      toast.success(getMessage("M024"));
      navigate("/offer");
    } catch (error) {
      console.error("Error adding offer:", error);
      toast.error(getMessage("M023"));
    }
  };

  const handleAssignMe = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unable to assign. Current user information not available.");
      return;
    }

    try {
      // Giải mã token mà không cần ép kiểu
      const decodedToken = jwtDecode(token);

      // Cập nhật state với dữ liệu từ token
      setCurrentUser({
        id: decodedToken.userId || 0,
        userRole: decodedToken.role || "", // Xử lý khi role có thể không có
        sub: decodedToken.sub || "",
      });

      // Kiểm tra xem người dùng có phải là ROLE_RECRUITER không
      const currentUserFound = users.find(
        (user) =>
          user.userRole === "ROLE_RECRUITER" &&
          user.userId === decodedToken.userId
      );

      if (currentUserFound) {
        setFormData((prevState) => ({
          ...prevState,
          recruiterOwnerId: currentUserFound.id,
        }));
      } else {
        alert("You don't have recruiter privileges.");
      }
    } catch (error) {
      console.error("Error decoding token or processing user:", error);
      alert("An error occurred while processing your request.");
    }
  };

  return (
    <Container className="mb-3">
      <div className="breadcrumb__group">
        <span className="breadcrumb-link" onClick={() => navigate("/offer")}>
          Offer List
        </span>
        <FaAngleRight />
        <span className="breadcrumb-link__active">Create Offer</span>
      </div>
      <div>
        <Row>
          <Form onSubmit={handleSubmit}>
            <div className="content-offer-form">
              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} htmlFor="candidateId">
                      <strong> Candidate:</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        id="candidateId"
                        name="candidateId"
                        value={formData.candidateId}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.candidateId}
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
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.candidateId}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} htmlFor="constractType">
                      <strong>Contract Type:</strong>{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        id="constractType"
                        name="contractType"
                        value={formData.contractType}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.contractType}
                      >
                        <option value="">Select a type of contract</option>
                        {Object.entries(constractType).map(([value, name]) => (
                          <option key={value} value={value}>
                            {name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.contractType}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} htmlFor="position">
                      <strong> Position:</strong>{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.position}
                      >
                        <option value="">Select a Position</option>
                        {Object.entries(offerPosition).map(([value, name]) => (
                          <option key={value} value={value}>
                            {name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.position}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} htmlFor="level">
                      <strong>Level:</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        id="level"
                        name="offerLevel"
                        value={formData.offerLevel}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.offerLevel}
                      >
                        <option value="">Select a level</option>
                        {Object.entries(offerLevel).map(([value, name]) => (
                          <option key={value} value={value}>
                            {name}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.offerLevel}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} htmlFor="approvedBy">
                      <strong> Approver:</strong>{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        id="approvedBy"
                        name="approvedBy"
                        value={formData.approvedBy}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.approvedBy}
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
                      <Form.Control.Feedback type="invalid">
                        {formErrors.contractType}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} htmlFor="department">
                      <strong>Department:</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.department}
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
                      <Form.Control.Feedback type="invalid">
                        {formErrors.department}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} htmlFor="interviewSchedule">
                      <strong>Interview Info:</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        id="interviewSchedule"
                        name="interviewSchedule"
                        value={formData.interviewSchedule || ""} // Đã thay đổi ở đây
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.interviewSchedule}
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
                      <Form.Control.Feedback type="invalid">
                        {formErrors.interviewSchedule}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} htmlFor="recruiterOwnerId">
                      <strong> Recruiter Owner:</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        id="recruiterOwnerId"
                        name="recruiterOwnerId"
                        value={formData.recruiterOwnerId}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.recruiterOwnerId}
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
                      {/* <Link className="text-assigned" onClick={handleAssignMe}>
                        Assign to me
                      </Link> */}
                      <Form.Control.Feedback type="invalid">
                        {formErrors.recruiterOwnerId}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label
                      column
                      sm={3}
                      data-testid="contract-period-label"
                    >
                      <strong> Contract Period</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Row style={{ margin: 0 }}>
                        <Col sm={2}>
                          {" "}
                          <strong>From: </strong>
                        </Col>
                        <Col sm={4}>
                          <Form.Control
                            size="sm"
                            className="w-100"
                            type="date"
                            id="contractFrom"
                            data-testid="contract-from-label"
                            name="contractFrom"
                            value={formData.contractFrom}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split("T")[0]}
                            isInvalid={!!formErrors.contractFrom}
                          />
                        </Col>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.contractFrom}
                        </Form.Control.Feedback>
                        <Col sm={2}>
                          {" "}
                          <strong>To: </strong>
                        </Col>
                        <Col sm={4}>
                          <Form.Control
                            size="sm"
                            className="w-100"
                            type="date"
                            id="contractTo"
                            data-testid="contract-to-label"
                            name="contractTo"
                            value={formData.contractTo}
                            onChange={handleInputChange}
                            min={
                              formData.contractFrom ||
                              new Date().toISOString().split("T")[0]
                            }
                            isInvalid={!!formErrors.contractTo}
                          />
                        </Col>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.contractTo}
                        </Form.Control.Feedback>
                      </Row>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} htmlFor="dueDate">
                      <strong>Due Date:</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        id="dueDate"
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.dueDate}
                      />
                    </Col>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.dueDate}
                    </Form.Control.Feedback>
                    {dateError && (
                      <div className="text-danger">{dateError}</div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} htmlFor="interviewNotes">
                      <strong> Interview Notes</strong>
                      <span style={{ color: "red" }}>*</span>
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
                    <Form.Label column sm={3} htmlFor="basicSalary">
                      <strong>Basic Salary:</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        id="basicSalary"
                        type="text"
                        placeholder=" Enter basic salary"
                        name="basicSalary"
                        value={formData.basicSalary}
                        onChange={handleInputChange}
                        isInvalid={!!formErrors.basicSalary}
                      />
                      {/* <Form.Text className="text-danger">
                      {errors.basicSalary}
                    </Form.Text> */}
                      {errors && (
                        <div className="text-danger"> {errors.basicSalary}</div>
                      )}
                      <Form.Control.Feedback type="invalid">
                        {formErrors.basicSalary}
                      </Form.Control.Feedback>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={{ span: 6, offset: 6 }} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} htmlFor="note">
                      <strong>Note:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        id="note"
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
              <Button
                variant="success"
                type="submit"
                className="button-form button-form--success"
              >
                Submit
              </Button>
              <Button
                type="button"
                className="button-form button-form--danger"
                onClick={() => navigate("/offer")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Row>
      </div>
    </Container>
  );
}
