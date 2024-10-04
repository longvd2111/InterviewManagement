import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { fetchCandidateById, updateCandidate } from "~/services/candidateApi";
import { fetchAllUser } from "~/services/userServices";
import "../../assets/css/candidate-css/CandidateCreateForm.css";
import {
  optionsSkills,
  optionsPosition,
  optionsGender,
  optionsLevel,
  optionsStatus,
} from "~/data/Constants";
import { isValidDOB, isValidEmail, isValidPhone } from "~/utils/Validate";
import { toast } from "react-toastify";
import { getMessage } from "~/data/Messages";

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required(getMessage("ME002")),
  email: Yup.string()
    .email(getMessage("ME009"))
    .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, getMessage("ME028"))
    .required(getMessage("ME002")),
  phone: Yup.string().test("is-valid-phone", getMessage("ME029"), isValidPhone),
  dob: Yup.string().test("is-valid-dob", getMessage("ME010"), isValidDOB),
  gender: Yup.object().nullable().required(getMessage("ME002")),
  yearExperience: Yup.number().min(0, getMessage("ME030")),
  candidatePosition: Yup.object().nullable().required(getMessage("ME002")),
  highestLevel: Yup.object().nullable().required(getMessage("ME002")),
  skillIds: Yup.array()
    .min(1, getMessage("ME002"))
    .required(getMessage("ME002")),
  recruiterId: Yup.object().nullable().required(getMessage("ME002")),
  candidateStatus: Yup.object().nullable().required(getMessage("ME002")),
});

export default function EditCandidate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recruiters, setRecruiters] = useState([]);
  const skillMapping = {
    "business analysis": "Business Analyst",
  };

  useEffect(() => {
    const fetchData = async () => {
      const userResponse = await fetchAllUser(0, 1000);
      const users = userResponse.data;
      const recruiterOptions = users
        .filter((user) => user.userRole === "ROLE_RECRUITER")
        .map((user) => ({
          value: user.id,
          label: user.fullName,
        }));
      setRecruiters(recruiterOptions);

      const candidateResponse = await fetchCandidateById(id);
      const data = candidateResponse;
      const formattedDob = data.dob
        ? data.dob.map((part) => String(part).padStart(2, "0")).join("-")
        : "";

      formik.setValues({
        fullName: data.fullName || "",
        email: data.email || "",
        dob: formattedDob,
        address: data.address || "",
        phone: data.phone || "",
        gender:
          optionsGender.find(
            (option) => option.value === data.gender.toUpperCase()
          ) || null,
        candidatePosition:
          optionsPosition.find(
            (option) => option.value === data.candidatePosition
          ) || null,
        highestLevel:
          optionsLevel.find((option) => option.value === data.highestLevel) ||
          null,
        skillIds: data.skills
          ? data.skills
              .map((skill) => {
                const normalizedSkill = skill.trim().toLowerCase();
                const mappedSkill = skillMapping[normalizedSkill] || skill;
                return optionsSkills.find(
                  (option) =>
                    option.label.trim().toLowerCase() ===
                    mappedSkill.trim().toLowerCase()
                );
              })
              .filter(Boolean)
          : [],
        recruiterId:
          recruiterOptions.find((option) => option.label === data.recruiter) ||
          null,
        candidateStatus: optionsStatus.find(
          (option) => option.value === data.candidateStatus
        ),
        attachFile: data.attachFile || "",
        yearExperience: data.yearExperience || "",
      });
    };

    fetchData();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      dob: "",
      address: "",
      phone: "",
      gender: null,
      candidatePosition: null,
      yearExperience: "",
      highestLevel: null,
      skillIds: [],
      note: "",
      recruiterId: null,
      candidateStatus: { value: "OPEN", label: "Open" },
      attachFile: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        id: id,
        ...values,
        gender: values.gender?.value || null,
        skillIds: values.skillIds.map((skill) => skill.value),
        recruiterId: values.recruiterId?.value || null,
        candidateStatus: values.candidateStatus?.value || null,
        candidatePosition: values.candidatePosition?.value || null,
        highestLevel: values.highestLevel?.value || null,
      };

      updateCandidate(payload)
        .then((response) => {
          toast.success(getMessage("ME014"));
          navigate("/candidate");
        })
        .catch((error) => {
          toast.error(getMessage("ME013"));
        });
    },
  });

  return (
    <Container>
      <div className="breadcrumb__group" style={{ marginBottom: "30px" }}>
        <span
          className="breadcrumb-link"
          onClick={() => navigate("/candidate")}
        >
          Candidate List
        </span>
        <FaAngleRight />
        <span className="breadcrumb-link__active">Edit Candidate</span>
      </div>
      <div style={{ marginTop: "16px" }}>
        <Row>
          <Form onSubmit={formik.handleSubmit}>
            {/* Personal Information */}
            <div className="content-candidate-form">
              <h5>I. Personal Information</h5>
              <Row className="mb-3">
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="fullname">
                      Full Name <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        placeholder="Type a name..."
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.fullName && formik.errors.fullName
                        }
                      />
                    </Col>
                    {formik.touched.fullName && formik.errors.fullName ? (
                      <div className="text-danger">
                        {formik.errors.fullName}{" "}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="email">
                      Email <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="email"
                        placeholder="Type an email..."
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.email && formik.errors.email}
                      />
                    </Col>
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-danger">{formik.errors.email} </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="dob">
                      D.O.B
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        aria-label="D.O.B"
                        inputId="dob"
                        type="date"
                        name="dob"
                        value={formik.values.dob}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.dob && formik.errors.dob}
                      />
                    </Col>
                    {formik.touched.dob && formik.errors.dob ? (
                      <div className="text-danger">{formik.errors.dob} </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="address">
                      Address
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        placeholder="Type an address..."
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.address && formik.errors.address
                        }
                      />
                    </Col>
                    {formik.touched.address && formik.errors.address ? (
                      <div className="text-danger">
                        {formik.errors.address}{" "}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="phone">
                      Phone Number <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="tel"
                        placeholder="Type a number..."
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.phone && formik.errors.phone}
                      />
                    </Col>
                    {formik.touched.phone && formik.errors.phone ? (
                      <div className="text-danger">{formik.errors.phone} </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="gender">
                      Gender <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Select
                        aria-label="Gender"
                        inputId="gender"
                        name="gender"
                        value={formik.values.gender}
                        onChange={(option) =>
                          formik.setFieldValue("gender", option)
                        }
                        onBlur={formik.handleBlur}
                        options={optionsGender}
                        className="basic-single-select"
                        classNamePrefix="select"
                        isClearable
                        isInvalid={
                          formik.touched.gender && formik.errors.gender
                        }
                      />
                    </Col>
                    {formik.touched.gender && formik.errors.gender ? (
                      <div className="text-danger">{formik.errors.gender}</div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              {/* Professional Information */}
              <h5>II. Professional Information</h5>
              <Row className="mb-3">
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="attachFile">
                      CV Attachment
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            formik.setFieldValue("attachFile", file.name);
                          }
                        }}
                      />
                    </Col>
                    {formik.values.attachFile && (
                      <small>Current file: {formik.values.attachFile}</small>
                    )}
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="yearExperience">
                      Year of Experience
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="number"
                        placeholder="Type a number"
                        name="yearExperience"
                        value={formik.values.yearExperience}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.yearExperience &&
                          formik.errors.yearExperience
                        }
                      />
                    </Col>
                    {formik.touched.yearExperience &&
                    formik.errors.yearExperience ? (
                      <div className="text-danger">
                        {formik.errors.yearExperience}{" "}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="position">
                      Current Position <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Select
                        aria-label="Current Position"
                        inputId="position"
                        name="candidatePosition"
                        value={formik.values.candidatePosition}
                        onChange={(option) =>
                          formik.setFieldValue("candidatePosition", option)
                        }
                        onBlur={formik.handleBlur}
                        options={optionsPosition}
                        className="basic-single-select"
                        classNamePrefix="select"
                        isClearable
                        isInvalid={
                          formik.touched.candidatePosition &&
                          formik.errors.candidatePosition
                        }
                      />
                    </Col>
                    {formik.touched.candidatePosition &&
                    formik.errors.candidatePosition ? (
                      <div className="text-danger">
                        {formik.errors.candidatePosition}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="level">
                      Highest Level <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Select
                        aria-label="Highest Level"
                        inputId="level"
                        name="highestLevel"
                        value={formik.values.highestLevel}
                        onChange={(option) =>
                          formik.setFieldValue("highestLevel", option)
                        }
                        onBlur={formik.handleBlur}
                        options={optionsLevel}
                        className="basic-single-select"
                        classNamePrefix="select"
                        isClearable
                        isInvalid={
                          formik.touched.highestLevel &&
                          formik.errors.highestLevel
                        }
                      />
                    </Col>
                    {formik.touched.highestLevel &&
                    formik.errors.highestLevel ? (
                      <div className="text-danger">
                        {formik.errors.highestLevel}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="skill">
                      Skills <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Select
                        aria-label="Skills"
                        inputId="skill"
                        isMulti
                        name="skillIds"
                        value={formik.values.skillIds}
                        onChange={(options) =>
                          formik.setFieldValue("skillIds", options)
                        }
                        onBlur={formik.handleBlur}
                        options={optionsSkills}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isInvalid={
                          formik.touched.skillIds && formik.errors.skillIds
                        }
                      />
                    </Col>
                    {formik.touched.skillIds && formik.errors.skillIds ? (
                      <div className="text-danger">
                        {formik.errors.skillIds}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="note">
                      Note
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        placeholder="Type a note"
                        name="note"
                        value={formik.values.note}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.note && formik.errors.note}
                      />
                    </Col>
                    {formik.touched.note && formik.errors.note ? (
                      <div className="text-danger">{formik.errors.note} </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="recruiter">
                      Recruiter <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Select
                        aria-label="Recruiter"
                        inputId="recruiter"
                        name="recruiterId"
                        value={formik.values.recruiterId}
                        onChange={(option) =>
                          formik.setFieldValue("recruiterId", option)
                        }
                        onBlur={formik.handleBlur}
                        options={recruiters}
                        isInvalid={
                          formik.touched.recruiterId &&
                          formik.errors.recruiterId
                        }
                      />
                    </Col>
                    {formik.touched.recruiterId && formik.errors.recruiterId ? (
                      <div className="text-danger">
                        {formik.errors.recruiterId}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3} data-testId="status">
                      Status <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Select
                        aria-label="Status"
                        inputId="status"
                        name="candidateStatus"
                        value={formik.values.candidateStatus}
                        onChange={(option) =>
                          formik.setFieldValue("candidateStatus", option)
                        }
                        onBlur={formik.handleBlur}
                        options={optionsStatus}
                        className="basic-single-select"
                        classNamePrefix="select"
                        isClearable
                        isInvalid={
                          formik.touched.candidateStatus &&
                          formik.errors.candidateStatus
                        }
                        isDisabled
                      />
                    </Col>
                    {formik.touched.candidateStatus &&
                    formik.errors.candidateStatus ? (
                      <div className="text-danger">
                        {formik.errors.candidateStatus}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
            </div>
            {/* Submit and Cancel Buttons */}
            <Row className="mb-3">
              <Col xs={12}>
                <div className="button-candidate">
                  <button
                    data-testId="editbutton"
                    type="submit"
                    className="button-form button-form--primary"
                  >
                    Save
                  </button>
                  <button
                    data-testId="cancel"
                    type="button"
                    className="button-form"
                    onClick={() => navigate("/candidate")}
                  >
                    Cancel
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </Row>
      </div>
    </Container>
  );
}
