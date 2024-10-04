import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchAllJobs } from "~/services/jobApi";
import "../../assets/css/job-css/JobForm.css";
import { JobStatus, JobLevel } from "~/data/Constants";
import { AuthContext } from "~/contexts/auth/AuthContext";
import "../../assets/css/candidate-css/Candidate.css";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const getAllJob = async () => {
      try {
        let res = await fetchAllJobs();
        if (res && res.data && res.data) {
          const jobList = res.data;
          const selectedJob = jobList.find(
            (job) => job.id === parseInt(id, 10)
          );
          setJob(selectedJob || {});
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error);
        setLoading(false);
      }
    };

    getAllJob();
  }, [id]);

  const formatDate = (dateArray) => {
    if (!dateArray) return "";
    const [year, month, day, hour, minute, second] = dateArray;
    const date = new Date(
      year,
      month - 1,
      day,
      hour || 0,
      minute || 0,
      second || 0
    );
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDateOnly = (dateArray) => {
    if (!dateArray) return "";
    const [year, month, day] = dateArray;
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container className="mb-3">
      <div className="breadcrumb__group">
        <span className="breadcrumb-link" onClick={() => navigate("/job")}>
          Job List
        </span>
        <FaAngleRight />
        <span className="">Job details</span>
      </div>
      <Row className="info-update" style={{ marginBottom: "8px" }}>
        <Col xs={{ span: 6, offset: 6 }}>
          <p>
            Created on {formatDate(job.createdDate)}, Last update{" "}
            {job.lastModifiedDate ? formatDate(job.lastModifiedDate) : ""} by
            Admin
          </p>
        </Col>
      </Row>
      <div className="candidate-detail">
        <Row>
          <Form>
            <div className="section">
              <div className="section-personal-info">
                {/* First Row */}
                <Row>
                  <Col xs={6}>
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Job Title:</strong>
                      </Form.Label>
                      <Col sm={9}>{job.jobTitle}</Col>
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="mb-3">
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Skill:</strong>
                      </Form.Label>
                      <Col sm={9}>
                        {job.requiredSkillSet &&
                          job.requiredSkillSet.map((skill, index) => (
                            <span
                              key={index}
                              style={{
                                backgroundColor: "#cdd0d4",
                                padding: "5px 10px",
                                marginRight: "5px",
                                borderRadius: "4px",
                                display: "inline-block",
                                marginBottom: "5px",
                              }}
                            >
                              {skill.name}
                            </span>
                          ))}
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Second Row */}
                <Row>
                  <Col xs={6}>
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Start Date:</strong>
                      </Form.Label>
                      <Col sm={9}>{formatDateOnly(job.startDate)}</Col>
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="mb-3">
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>End Date:</strong>
                      </Form.Label>
                      <Col sm={9}>{formatDateOnly(job.endDate)}</Col>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Third Row */}
                <Row>
                  <Col xs={6}>
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Salary Range:</strong>
                      </Form.Label>
                      <Col sm={9}>
                        <Row>
                          <Col sm={2}>
                            <strong>From</strong>
                          </Col>
                          <Col sm={4}>{job.salaryFrom} VND</Col>
                          <Col sm={2}>
                            <strong>To</strong>
                          </Col>
                          <Col sm={4}>{job.salaryTo} VND</Col>
                        </Row>
                      </Col>
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="mb-3">
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Benefits</strong>
                      </Form.Label>
                      <Col sm={9}>
                        {job.benefits &&
                          job.benefits.map((benefit, index) => (
                            <span
                              key={index}
                              style={{
                                backgroundColor: "#cdd0d4",
                                padding: "5px 10px",
                                marginRight: "5px",
                                borderRadius: "4px",
                                display: "inline-block",
                                marginBottom: "5px",
                              }}
                            >
                              {benefit.name}
                            </span>
                          ))}
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Fourth Row */}
                <Row>
                  <Col xs={6}>
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Working Address</strong>
                      </Form.Label>
                      <Col sm={9}>{job.workingAddress}</Col>
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="mb-3">
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Level </strong>
                      </Form.Label>
                      <Col sm={9}>
                        {job.jobLevel && (
                          <span
                            style={{
                              backgroundColor: "#cdd0d4",
                              padding: "5px 10px",
                              marginRight: "5px",
                              borderRadius: "4px",
                              display: "inline-block",
                              marginBottom: "5px",
                            }}
                          >
                            {JobLevel[job.jobLevel]}
                          </span>
                        )}
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Fifth Row */}
                <Row>
                  <Col xs={6} className="mb-3">
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Status</strong>
                      </Form.Label>
                      <Col sm={9}>{JobStatus[job.jobStatus]}</Col>
                    </Form.Group>
                  </Col>

                  <Col xs={6} className="mb-3">
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Description</strong>
                      </Form.Label>
                      <Col sm={9}>{job.description}</Col>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>
            {/* Submit and Cancel Buttons */}

            <div className="button-group">
              {(user.role === "ROLE_ADMIN" ||
                user.role === "ROLE_MANAGER" ||
                user.role === "ROLE_RECRUITER") && (
                <Link
                  to={`/job/edit/${id}`}
                  className="button-form button-form--warning"
                >
                  Edit
                </Link>
              )}
              <button
                type="button"
                className="button-form"
                onClick={() => navigate("/job")}
              >
                Cancel
              </button>
            </div>
          </Form>
        </Row>
      </div>
    </Container>
  );
}
