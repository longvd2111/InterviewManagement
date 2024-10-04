import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import "../../assets/css/job-css/JobForm.css";
import { fetchJobsById, updateJob } from "~/services/jobApi";
import { toast } from "react-toastify";
import "../../assets/css/interview-css/Interview.css";
import { getMessage } from "~/data/Messages";

const optionsBenefits = [
  { value: 1, label: "Lunch" },
  { value: 2, label: "25-day Leave" },
  { value: 3, label: "Healthcare Insurance" },
  { value: 4, label: "Hybrid working" },
  { value: 5, label: "Travel" },
];

const optionsLevel = [
  { value: "FRESHER", label: "Fresher" },
  { value: "JUNIOR", label: "Junior" },
  { value: "SENIOR", label: "Senior" },
  { value: "LEADER", label: "Leader" },
  { value: "TRAINER", label: "Trainer" },
  { value: "MENTOR", label: "Mentor" },
];

const optionsSkills = [
  { value: 1, label: "Java" },
  { value: 2, label: "Nodejs" },
  { value: 3, label: ".Net" },
  { value: 4, label: "C++" },
  { value: 5, label: "Business Analyst" },
  { value: 6, label: "Communication" },
];

const optionsStatus = [
  { value: "DRAFT", label: "Draft" },
  { value: "OPEN", label: "Open" },
  { value: "CLOSED", label: "Closed" },
];

const JobEdit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    jobTitle: "",
    skillIds: [],
    startDate: "",
    endDate: "",
    salaryFrom: "",
    salaryTo: "",
    benefitIds: [], // Changed from null to an empty array
    workingAddress: "",
    jobLevel: null,
    jobStatus: null,
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getJobById = async () => {
      try {
        const res = await fetchJobsById(id);
        if (res) {
          const jobdata = res;
          const formattedStartDate = jobdata.startDate
            ? new Date(jobdata.startDate).toISOString().split("T")[0]
            : "";
          const formattedEndDate = jobdata.endDate
            ? new Date(jobdata.endDate).toISOString().split("T")[0]
            : "";

          setFormData({
            jobTitle: jobdata.jobTitle || "",
            skillIds: jobdata.requiredSkillSet
              ? jobdata.requiredSkillSet.map((skill) => ({
                  value: skill.id,
                  label: skill.name,
                }))
              : [],
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            salaryFrom: jobdata.salaryFrom || "",
            salaryTo: jobdata.salaryTo || "",
            benefitIds: jobdata.benefits
              ? jobdata.benefits.map((benefit) => ({
                  value: benefit.id,
                  label: benefit.name,
                }))
              : [],
            workingAddress: jobdata.workingAddress || "",
            jobLevel: jobdata.jobLevel
              ? optionsLevel.find((option) => option.value === jobdata.jobLevel)
              : null,
            jobStatus: jobdata.jobStatus
              ? optionsStatus.find(
                  (option) => option.value === jobdata.jobStatus
                )
              : null,
            description: jobdata.description || "",
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job:", error);
        setError(error);
        setLoading(false);
      }
    };

    getJobById();
  }, [id]);

  const handleSelectChange = (selected, name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: selected || [],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.jobTitle) newErrors.jobTitle = getMessage("ME002");
    if (!formData.skillIds || formData.skillIds.length === 0)
      newErrors.skillIds = getMessage("ME002");
    if (!formData.startDate) newErrors.startDate = getMessage("ME002");
    if (!formData.endDate) newErrors.endDate = getMessage("ME002");

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const currentDate = new Date();

    if (startDate <= currentDate) {
      newErrors.startDate = getMessage("ME017");
    }

    if (endDate <= startDate) {
      newErrors.endDate = getMessage("ME018");
    }

    if (formData.salaryFrom && formData.salaryTo) {
      if (formData.salaryTo <= formData.salaryFrom) {
        newErrors.salaryTo = getMessage("ME040");
      }
    }

    if (!formData.benefitIds || formData.benefitIds.length === 0)
      newErrors.benefitIds = getMessage("ME002");
    if (!formData.jobLevel) newErrors.jobLevel = getMessage("ME002");

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      id,
      jobTitle: formData.jobTitle,
      skillIds: formData.skillIds.map((skill) => skill.value),
      startDate: formData.startDate,
      endDate: formData.endDate,
      salaryFrom: formData.salaryFrom,
      salaryTo: formData.salaryTo,
      benifitIds: formData.benefitIds.map((benefit) => benefit.value),
      workingAddress: formData.workingAddress,
      jobLevel: formData.jobLevel ? formData.jobLevel.value : null,
      jobStatus: formData.jobStatus ? formData.jobStatus.value : null,
      description: formData.description,
    };

    console.log("update: ", payload);
    try {
      await updateJob(payload);
      toast.success(getMessage("ME014"));
      navigate("/job");
    } catch (error) {
      toast.error(getMessage("ME013"));
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading job. Please try again later.</div>;
  }

  return (
    <Container className="mb-3">
      <div className="breadcrumb__group">
        <span className="breadcrumb-link" onClick={() => navigate("/job")}>
          Job List
        </span>
        <FaAngleRight />
        <span>Edit Job</span>
      </div>
      <Row className="info-update">
        <Col xs={{ span: 6, offset: 8 }}>
          <p style={{ display: "none" }}>
            Create on 26/06/2024, Last update by MaiNT47, Today
          </p>
        </Col>
      </Row>

      <div className="candidate-detail">
        <Form onSubmit={handleSubmit}>
          <div className="content-job-form">
            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Job Title <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      isInvalid={!!errors.jobTitle}
                    />
                  </Col>
                  {errors.jobTitle && (
                    <div className="text-danger">{errors.jobTitle}</div>
                  )}
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Skill <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Select
                      isMulti
                      name="skillIds"
                      options={optionsSkills}
                      value={formData.skillIds}
                      onChange={(selected) =>
                        handleSelectChange(selected, "skillIds")
                      }
                      className={errors.skillIds ? "is-invalid" : ""}
                    />
                  </Col>
                  {errors.skillIds && (
                    <div className="text-danger">{errors.skillIds}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Start Date <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="date"
                      name="startDate"
                      min={tomorrow.toISOString().split("T")[0]}
                      value={formData.startDate}
                      onChange={handleChange}
                      isInvalid={!!errors.startDate}
                    />
                  </Col>
                  {errors.startDate && (
                    <div className="text-danger">{errors.startDate}</div>
                  )}
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    End Date <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      min={
                        formData.startDate
                          ? new Date(formData.startDate)
                              .toISOString()
                              .split("T")[0]
                          : dayAfterTomorrow.toISOString().split("T")[0]
                      }
                      isInvalid={!!errors.endDate}
                    />
                  </Col>
                  {errors.endDate && (
                    <div className="text-danger">{errors.endDate}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group as={Row} className="align-items-center">
                  <Col sm={3} style={{ paddingBottom: "10px" }}>
                    Salary Range
                  </Col>
                  <Col sm={9}>
                    <Row>
                      <Col sm={6} className="d-flex align-items-center">
                        <Col sm={4}>From</Col>
                        <Col sm={8}>
                          <Form.Control
                            style={{ width: "105px", fontSize: "14px" }}
                            type="number"
                            name="salaryFrom"
                            value={formData.salaryFrom}
                            onChange={handleChange}
                            isInvalid={
                              !!errors.salaryFrom || !!errors.salaryRange
                            }
                          />
                        </Col>
                      </Col>

                      <Col sm={6} className="d-flex align-items-center">
                        <Col sm={4}>To</Col>
                        <Col sm={8}>
                          <Form.Control
                            style={{ width: "110px", fontSize: "14px" }}
                            type="number"
                            name="salaryTo"
                            value={formData.salaryTo}
                            onChange={handleChange}
                            isInvalid={
                              !!errors.salaryTo || !!errors.salaryRange
                            }
                          />
                        </Col>
                      </Col>
                    </Row>
                  </Col>
                  {errors.salaryRange && (
                    <div className="text-danger">{errors.salaryRange}</div>
                  )}

                  {errors.salaryFrom && !errors.salaryRange && (
                    <div className="text-danger">{errors.salaryFrom}</div>
                  )}

                  {errors.salaryTo && !errors.salaryRange && (
                    <div className="text-danger">{errors.salaryTo}</div>
                  )}
                </Form.Group>
              </Col>

              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Benefits <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Select
                      isMulti
                      name="benefitIds"
                      options={optionsBenefits}
                      value={formData.benefitIds}
                      onChange={(selected) =>
                        handleSelectChange(selected, "benefitIds")
                      }
                      className={errors.benefitIds ? "is-invalid" : ""}
                    />
                  </Col>
                  {errors.benefitIds && (
                    <div className="text-danger">{errors.benefitIds}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label style={{ display: "flex" }} column sm={3}>
                    Working Address
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      name="workingAddress"
                      value={formData.workingAddress}
                      onChange={handleChange}
                      isInvalid={!!errors.workingAddress}
                    />
                  </Col>
                  {errors.workingAddress && (
                    <div className="text-danger">{errors.workingAddress}</div>
                  )}
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Level <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Select
                      name="jobLevel"
                      options={optionsLevel}
                      value={formData.jobLevel}
                      onChange={(selected) =>
                        handleSelectChange(selected, "jobLevel")
                      }
                      className={errors.jobLevel ? "is-invalid" : ""}
                    />
                  </Col>
                  {errors.jobLevel && (
                    <div className="text-danger">{errors.jobLevel}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Status
                  </Form.Label>
                  <Col sm={9}>
                    <Select
                      name="jobStatus"
                      options={optionsStatus}
                      // isDisabled
                      value={formData.jobStatus}
                      onChange={(selected) =>
                        handleSelectChange(selected, "jobStatus")
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>

              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Description
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      isInvalid={!!errors.description}
                    />
                  </Col>
                  {errors.description && (
                    <div className="text-danger">{errors.description}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </div>
          <div className="button-group">
            <button type="submit" className="button-form button-form--primary">
              Save
            </button>
            <button
              type="button"
              className="button-form"
              onClick={() => navigate("/job")}
            >
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default JobEdit;
