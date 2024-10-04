import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa6";
import { Row, Col, Modal, Button } from "react-bootstrap";
import "../../assets/css/offer-css/offer.css";
import { Container, Form } from "react-bootstrap";
import ApiService from "../../services/serviceApiOffer";
import { toast } from "react-toastify";
import { updateCandidate, fetchCandidateById } from "~/services/candidateApi";
import ApiUser from "~/services/usersApi";
import {
  departmentOffer,
  constractType,
  offerLevel,
  offerPosition,
  getButtonsByStatus,
  statusOffer,
  optionsSkills,
} from "~/data/Constants";
const DetailOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [candidates, setCandidates] = useState({
    skills: [],
  });
  const [users, setUsers] = useState([]);
  const [detailOffer, setDetailOffer] = useState({
    candidate: {},
    interviewDTO: [],
  });

  const loadData = async (id) => {
    try {
      const response = await ApiService.ApiDetailOffer(id);

      if (response && response.id) {
        setDetailOffer(response);
        // Call loadDataCan here with the candidate ID
        const candidateId = Number(Object.keys(response.candidate)[0]);
        loadDataCan(candidateId);
      } else {
        throw new Error("Invalid data received from API");
      }
    } catch (error) {
      console.error("Error loading offer details:", error);
    }
  };
  const loadDataCan = async (candidateId) => {
    try {
      const response = await fetchCandidateById(candidateId);
      if (response && response.id) {
        setCandidates(response);
      } else {
        throw new Error("Invalid data received from API");
      }
    } catch (error) {
      console.error("Error loading candidate details:", error);
    }
  };
  const loadUser = async () => {
    const responseUser = await ApiUser.getUsers();
    setUsers(responseUser.data);
  };
  useEffect(() => {
    loadData(id);

    loadUser();
  }, [id]);

  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length !== 3) {
      return "";
    }
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };
  const buttons = getButtonsByStatus(detailOffer.offerStatus, users.userRole);
  // Lọc người dùng với vai trò ROLE_RECRUITER
  const approvers = users.filter((us) => us.userRole === "ROLE_MANAGER");

  // Tìm người tuyển dụng dựa trên tên
  const approver = approvers.find(
    (user) => user.username === detailOffer.approvedBy
  );

  let approvedById = null;
  if (approver) {
    approvedById = approver.id;
  }
  const formData = {
    id: id,
    candidateId: detailOffer.candidate
      ? Number(Object.keys(detailOffer.candidate)[0])
      : null,
    contractType: detailOffer.contractType || "",
    position: detailOffer.position || "",
    offerLevel: detailOffer.offerLevel || "",
    approvedBy: approvedById || "",
    interviewSchedule: detailOffer.interviewSchedule?.id,
    recruiterOwnerId: detailOffer.recruiterOwner?.id,

    contractFrom: formatDate(detailOffer.contractFrom),
    contractTo: formatDate(detailOffer.contractTo),
    dueDate: formatDate(detailOffer.dueDate),
    basicSalary: detailOffer.basicSalary || 0,
    note: detailOffer.note || "",
    email: detailOffer.email || "",
    offerStatus: detailOffer.offerStatus || "",
    department: detailOffer.department || "",
  };

  // Lọc người dùng với vai trò ROLE_RECRUITER
  const recruiters = users.filter((us) => us.userRole === "ROLE_RECRUITER");

  // Tìm người tuyển dụng dựa trên tên
  const recruiter = recruiters.find(
    (user) => user.fullName === candidates.recruiter
  );

  let recruiterId = null;
  if (recruiter) {
    recruiterId = recruiter.id;
  }
  const skillIds = candidates.skills
    .map((skill) => {
      const skillOption = optionsSkills.find(
        (option) => option.label.toLowerCase() === skill.toLowerCase()
      );
      return skillOption ? skillOption.value : null;
    })
    .filter((value) => value !== null);

  // Tạo dữ liệu ứng viên
  const formDataCandidate = {
    id: detailOffer.candidate
      ? Number(Object.keys(detailOffer.candidate)[0])
      : null,
    fullName: candidates.fullName || "",
    dob: candidates.dob
      ? new Date(candidates.dob[0], candidates.dob[1] - 1, candidates.dob[2])
          .toISOString()
          .split("T")[0]
      : "",
    phone: candidates.phone || "",
    email: candidates.email || "",
    address: candidates.address || "",
    gender: candidates.gender || null,
    skillIds: skillIds, // Nếu có thông tin kỹ năng thì thêm vào đây
    recruiterId: recruiterId,
    attachFile: candidates.attachFile || null,
    candidateStatus: candidates.candidateStatus || null,
    candidatePosition: candidates.candidatePosition || null,
    yearExperience: Number(candidates.yearExperience) || 0,
    highestLevel: candidates.highestLevel || null,
    note: candidates.note || "",
  };

  const showConfirmationModal = (newStatus) => {
    setSelectedStatus(newStatus);
    setShowCancelModal(true);
  };

  const handleStatusChange = async () => {
    try {
      const dataSubmit = {
        ...formData,
        offerStatus: selectedStatus,
      };
      const dataSubmitCan = {
        ...formDataCandidate,
        candidateStatus: selectedStatus,
      };

      const response = await ApiService.ApiEditOffer(dataSubmit);
      const responseCandidate = await updateCandidate(dataSubmitCan);

      toast.success(`Offer status has been successfully updated!`);
      navigate("/offer");
    } catch (error) {
      console.error("Error changing offer status:", error);
      toast.error("Error changing offer status. Please try again.");
    }
  };

  return (
    <Container className="mb-3">
      <div className="breadcrumb__group">
        <span className="breadcrumb-link" onClick={() => navigate("/offer")}>
          Offer List
        </span>
        <FaAngleRight />
        <span className="breadcrumb-link__active">Detail Offer</span>
      </div>

      <div>
        <Row>
          <Row>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div className="button-group">
                {buttons.topButtons.map((button, index) => (
                  <button
                    key={index}
                    type="button"
                    data-testId={button.testId}
                    className={button.class}
                    onClick={() => {
                      if (button.status) {
                        showConfirmationModal(button.status);
                      } else if (button.action === "EDIT") {
                        navigate(`/offer/edit/${detailOffer.id}`);
                      } else if (button.action === "CANCEL") {
                        navigate("/offer");
                      }
                    }}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          </Row>

          <Form>
            <div className="content-offer-form" key={detailOffer.id}>
              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong> Candidate:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.FloatingLabel>
                        {Object.values(detailOffer.candidate || {}).join(", ")}
                      </Form.FloatingLabel>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Contract Type:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.FloatingLabel>
                        {constractType[detailOffer.contractType] || ""}
                      </Form.FloatingLabel>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              {/* Second Row */}
              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong> Position:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.FloatingLabel>
                        {offerPosition[detailOffer.position] || ""}
                      </Form.FloatingLabel>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Level:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.FloatingLabel>
                        {offerLevel[detailOffer.offerLevel] || ""}
                      </Form.FloatingLabel>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              {/* Third Row */}
              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong> Approver:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.FloatingLabel>
                        {detailOffer.approvedBy || "N/A"}
                      </Form.FloatingLabel>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Department:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.FloatingLabel data-testId="department">
                        {departmentOffer[detailOffer.department] || ""}
                      </Form.FloatingLabel>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              {/* Fourth Row */}
              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Interview Info:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.FloatingLabel>
                        Interviewer:{" "}
                        {detailOffer.interviewSchedule
                          ? detailOffer.interviewSchedule.interviewerDto
                              .map((interviewer) => interviewer.name)
                              .join(", ")
                          : ""}
                      </Form.FloatingLabel>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong> Recruiter Owner:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.FloatingLabel>
                        {detailOffer.recruiterOwner?.name || ""}
                      </Form.FloatingLabel>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              {/* Fifth Row */}
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
                          <Form.FloatingLabel data-testId="contractFrom">
                            {formatDate(detailOffer.contractFrom)}
                          </Form.FloatingLabel>
                        </Col>
                        <Col sm={2}>
                          {" "}
                          <strong>To: </strong>
                        </Col>
                        <Col sm={4}>
                          <Form.FloatingLabel data-testId="contractTo">
                            {formatDate(detailOffer.contractTo)}
                          </Form.FloatingLabel>
                        </Col>
                      </Row>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Due Date:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.FloatingLabel data-testId="dueDate">
                        {formatDate(detailOffer.dueDate)}
                      </Form.FloatingLabel>
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
                      <Form.FloatingLabel>
                        {detailOffer &&
                        detailOffer.interviewSchedule &&
                        detailOffer.interviewSchedule.notes
                          ? detailOffer.interviewSchedule.notes
                          : "No notes available"}
                      </Form.FloatingLabel>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Basic Salary:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.FloatingLabel data-testId="basicSalary">
                        {detailOffer.basicSalary !== undefined &&
                        detailOffer.basicSalary !== null
                          ? detailOffer.basicSalary.toLocaleString("vi-VN")
                          : "N/A"}{" "}
                        VND
                      </Form.FloatingLabel>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              {/* Sixth Row */}
              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong> Status:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.FloatingLabel>
                        {statusOffer[detailOffer.offerStatus] || ""}
                      </Form.FloatingLabel>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Note:</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.FloatingLabel>
                        {detailOffer.note || ""}
                      </Form.FloatingLabel>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="button-group">
              {buttons.bottomButtons.map((button, index) => (
                <button
                  key={index}
                  type="button"
                  className={button.class}
                  onClick={() => {
                    if (button.action === "EDIT") {
                      navigate(`/offer/edit/${detailOffer.id}`);
                    } else if (button.action === "CANCEL") {
                      navigate("/offer");
                    }
                  }}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </Form>
        </Row>
      </div>
      <div>
        <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <h5 style={{ textAlign: "center" }} data-testId="form-alert">
              Are you sure you want to change the status to{" "}
              {statusOffer[selectedStatus]}?
            </h5>
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: "center" }}>
            <Button
              variant="primary"
              className="button-form button-form--primary"
              onClick={() => {
                handleStatusChange(selectedStatus);
                setShowCancelModal(false);
              }}
            >
              Yes
            </Button>
            <Button
              variant="danger"
              className=" button-form button-form--danger"
              onClick={() => setShowCancelModal(false)}
            >
              No
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default DetailOffer;
