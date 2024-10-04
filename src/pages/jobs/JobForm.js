import React from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../assets/css/candidate-css/CandidateDetail.css";
import "../../assets/css/job-css/JobForm.css";
import { createJobs } from "~/services/jobApi";
import { toast } from "react-toastify";
import { getMessage } from "~/data/Messages";

export default function CreateForm() {
  const navigate = useNavigate();

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

  const optionsSkill = [
    { value: 1, label: "Java" },
    { value: 2, label: "Nodejs" },
    { value: 3, label: ".Net" },
    { value: 4, label: "C++" },
    { value: 5, label: "Business Analyst" },
    { value: 6, label: "Communication" },
  ];

  const today = new Date();
  const minStartDate = today.toISOString().split("T")[0];

  const formik = useFormik({
    initialValues: {
      jobTitle: "",
      startDate: "",
      endDate: "",
      salaryFrom: "",
      salaryTo: "",
      workingAddress: "",
      description: "",
      jobStatus: "OPEN",
      selectedBenefits: [],
      selectedLevel: null,
      selectedSkills: [],
    },
    validationSchema: Yup.object({
      jobTitle: Yup.string().required(getMessage("ME002")),
      startDate: Yup.date()
        .min(new Date(today.setHours(0, 0, 0, 0)), getMessage("ME017"))
        .required(getMessage("002")),
      endDate: Yup.date()
        .min(Yup.ref("startDate"), getMessage("ME018"))
        .required(getMessage("002")),
      salaryFrom: Yup.number().min(1).nullable(getMessage("ME039")),
      salaryTo: Yup.number()
        .min(Yup.ref("salaryFrom"), getMessage("ME040"))
        .nullable(),
      workingAddress: Yup.string().nullable(),
      description: Yup.string().nullable(),
      selectedSkills: Yup.array()
        .min(1, getMessage("ME002"))
        .required(getMessage("ME002")),
      selectedBenefits: Yup.array()
        .min(1, getMessage("ME002"))
        .required(getMessage("ME002")),
      selectedLevel: Yup.object().nullable().required(getMessage("ME002")),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const payload = {
        ...values,
        skillIds: values.selectedSkills.map((skill) => skill.value),
        benifitIds: values.selectedBenefits.map((benefit) => benefit.value),
        jobLevel: values.selectedLevel ? values.selectedLevel.value : "",
      };

      createJobs(payload)
        .then((response) => {
          toast.success(getMessage("ME016"));
          navigate("/job");
        })
        .catch((error) => {
          toast.error(getMessage("ME015"));
        });
    },
  });

  return (
    <Container className="mb-3">
      <div className="breadcrumb__group">
        <span className="breadcrumb-link" onClick={() => navigate("/job")}>
          Job List
        </span>
        <FaAngleRight />
        <span className="breadcrumb-link__active">Create Job</span>
      </div>
      <div className="candidate-detail">
        <Row>
          <Form onSubmit={formik.handleSubmit}>
            <div className="section">
              <div className="section-personal-info">
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
                          value={formik.values.jobTitle}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Job Title"
                          isInvalid={
                            formik.touched.jobTitle && !!formik.errors.jobTitle
                          }
                        />
                      </Col>
                      {formik.touched.jobTitle && formik.errors.jobTitle && (
                        <div className="invalid-feedback d-block">
                          {formik.errors.jobTitle}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="mb-3">
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        Skills <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Col sm={9}>
                        <Select
                          isMulti
                          name="selectedSkills"
                          value={formik.values.selectedSkills}
                          onChange={(selectedOptions) =>
                            formik.setFieldValue(
                              "selectedSkills",
                              selectedOptions
                            )
                          }
                          onBlur={() =>
                            formik.setFieldTouched("selectedSkills", true)
                          }
                          options={optionsSkill}
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </Col>
                      {formik.touched.selectedSkills &&
                        formik.errors.selectedSkills && (
                          <div className="invalid-feedback d-block">
                            {formik.errors.selectedSkills}
                          </div>
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
                          value={formik.values.startDate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Start Date"
                          min={minStartDate}
                          isInvalid={
                            formik.touched.startDate &&
                            !!formik.errors.startDate
                          }
                        />
                      </Col>
                      {formik.touched.startDate && formik.errors.startDate && (
                        <div className="invalid-feedback d-block">
                          {formik.errors.startDate}
                        </div>
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
                          value={formik.values.endDate}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter End Date"
                          min={
                            formik.values.startDate
                              ? new Date(
                                  new Date(formik.values.startDate).getTime() +
                                    24 * 60 * 60 * 1000
                                )
                                  .toISOString()
                                  .split("T")[0]
                              : minStartDate
                          }
                          isInvalid={
                            formik.touched.endDate && !!formik.errors.endDate
                          }
                        />
                      </Col>
                    </Form.Group>

                    {formik.touched.endDate && formik.errors.endDate && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.endDate}
                      </div>
                    )}
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
                                type="text"
                                min={0}
                                name="salaryFrom"
                                value={formik.values.salaryFrom}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={
                                  formik.touched.salaryFrom &&
                                  !!formik.errors.salaryFrom
                                }
                              />
                            </Col>
                          </Col>

                          <Col sm={6} className="d-flex align-items-center">
                            <Col sm={4}>To</Col>
                            <Col sm={8}>
                              <Form.Control
                                type="text"
                                min={0}
                                name="salaryTo"
                                value={formik.values.salaryTo}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isInvalid={
                                  formik.touched.salaryTo &&
                                  !!formik.errors.salaryTo
                                }
                              />
                            </Col>
                          </Col>
                        </Row>
                      </Col>
                      {formik.touched.salaryFrom &&
                        formik.errors.salaryFrom && (
                          <div className="invalid-feedback d-block">
                            {formik.errors.salaryFrom}
                          </div>
                        )}

                      {formik.touched.salaryTo && formik.errors.salaryTo && (
                        <div className="invalid-feedback d-block">
                          {formik.errors.salaryTo}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="mb-3">
                    <Form.Group as={Row}>
                      <Form.Label column sm={2}>
                        Benefits <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Col sm={9}>
                        <Select
                          isMulti
                          name="selectedBenefits"
                          value={formik.values.selectedBenefits}
                          onChange={(selectedOptions) =>
                            formik.setFieldValue(
                              "selectedBenefits",
                              selectedOptions
                            )
                          }
                          onBlur={() =>
                            formik.setFieldTouched("selectedBenefits", true)
                          }
                          options={optionsBenefits}
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </Col>
                      {formik.touched.selectedBenefits &&
                        formik.errors.selectedBenefits && (
                          <div className="invalid-feedback d-block">
                            {formik.errors.selectedBenefits}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row style={{ marginTop: "10px" }}>
                  <Col xs={6}>
                    <Form.Group as={Row}>
                      <Form.Label style={{ display: "flex" }} column sm={3}>
                        Working Address
                      </Form.Label>
                      <Col sm={9}>
                        <Form.Control
                          type="text"
                          name="workingAddress"
                          value={formik.values.workingAddress}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Working Address"
                          isInvalid={
                            formik.touched.workingAddress &&
                            !!formik.errors.workingAddress
                          }
                        />
                      </Col>
                      <Form.Control.Feedback type="invalid">
                        {formik.touched.workingAddress &&
                          formik.errors.workingAddress}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="mb-3">
                    <Form.Group as={Row}>
                      <Form.Label column sm={2}>
                        Level <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Col sm={9}>
                        <Select
                          name="selectedLevel"
                          value={formik.values.selectedLevel}
                          onChange={(selectedOption) =>
                            formik.setFieldValue(
                              "selectedLevel",
                              selectedOption
                            )
                          }
                          onBlur={() =>
                            formik.setFieldTouched("selectedLevel", true)
                          }
                          options={optionsLevel}
                          className="basic-single-select"
                          classNamePrefix="select"
                        />
                      </Col>
                      {formik.touched.selectedLevel &&
                        formik.errors.selectedLevel && (
                          <div className="invalid-feedback d-block">
                            {formik.errors.selectedLevel}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={{ span: 6, offset: 6 }} className="mb-3">
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        Description
                      </Form.Label>
                      <Col sm={9}>
                        <Form.Control
                          as="textarea"
                          name="description"
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter Description"
                          style={{ minHeight: "100px" }}
                          isInvalid={
                            formik.touched.description &&
                            !!formik.errors.description
                          }
                        />
                      </Col>
                      <Form.Control.Feedback type="invalid">
                        {formik.touched.description &&
                          formik.errors.description}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <br />
              </div>
            </div>

            <div className="button-group">
              <button
                type="submit"
                className="button-form button-form--primary"
              >
                Submit
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
        </Row>
      </div>
    </Container>
  );
}
