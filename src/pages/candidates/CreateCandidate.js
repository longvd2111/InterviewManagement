import React, { useEffect, useState } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { createCandidate } from "~/services/candidateApi";
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
import { fetchAllUser } from "~/services/userServices";
import { optionCreateStatus } from "../../data/Constants";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getMessage } from "~/data/Messages";

export default function CreateCandidate() {
  const navigate = useNavigate();
  const [recruiters, setRecruiters] = useState([]);

  const initialValues = {
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
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .matches(
        /^[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ][a-záàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]*(\s[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ][a-záàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]*)+$/,
        "Full name is not valid!"
      )
      .required("Full name is required!"),
    email: Yup.string()
      .email(getMessage("ME009"))
      .matches(
        /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
        "Email must be in the format name@gmail.com"
      )
      .required(getMessage("ME002")),
    dob: Yup.date().nullable().max(new Date(), getMessage("ME010")),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required(getMessage("ME002")),
    gender: Yup.object().nullable().required(getMessage("ME002")),
    candidatePosition: Yup.object().nullable().required(getMessage("ME002")),
    highestLevel: Yup.object().nullable().required(getMessage("ME002")),

    skillIds: Yup.array()
      .min(1, getMessage("ME002"))
      .required(getMessage("ME002")),
    recruiterId: Yup.object().nullable().required(getMessage("ME002")),
    candidateStatus: Yup.object().nullable().required(getMessage("ME002")),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const payload = {
      ...values,
      gender: values.gender?.value,
      candidatePosition: values.candidatePosition?.value,
      highestLevel: values.highestLevel?.value,
      skillIds: values.skillIds.map((skill) => skill.value),
      recruiterId: values.recruiterId?.value,
      candidateStatus: values.candidateStatus?.value,
    };

    createCandidate(payload)
      .then((response) => {
        toast.success(getMessage("ME012"));
        navigate("/candidate");
      })
      .catch((error) => {
        toast.error(getMessage("ME011"));
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  useEffect(() => {
    fetchAllUser(0, 1000).then((response) => {
      const users = response.data;
      const recruiters = users
        .filter((user) => user.userRole === "ROLE_RECRUITER")
        .map((user) => ({
          label: user.fullName,
          value: user.id,
        }));
      setRecruiters(recruiters);
    });
  }, []);

  return (
    <Container className="mb-3">
      <div className="breadcrumb__group" style={{ marginBottom: "30px" }}>
        <span
          className="breadcrumb-link"
          onClick={() => navigate("/candidate")}
        >
          Candidate List
        </span>
        <FaAngleRight />
        <span className="breadcrumb-link__active">Create Candidate</span>
      </div>
      <div>
        <Row>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values, isSubmitting }) => (
              <FormikForm>
                <div className="content-candidate-form">
                  <h5>I. Personal Information</h5>
                  <Row className="mb-3">
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="fullName">
                        <Form.Label column sm={3}>
                          Full Name<span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                          <Field
                            name="fullName"
                            type="text"
                            className="form-control"
                            placeholder="Type a name..."
                          />
                        </Col>
                        <ErrorMessage
                          name="fullName"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="email">
                        <Form.Label column sm={3}>
                          Email<span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                          <Field
                            name="email"
                            type="text"
                            className="form-control"
                            placeholder="Type an email..."
                          />
                        </Col>
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="dob">
                        <Form.Label column sm={3}>
                          D.O.B
                        </Form.Label>
                        <Col sm={9}>
                          <Field
                            name="dob"
                            type="date"
                            className="form-control"
                          />
                        </Col>
                        <ErrorMessage
                          name="dob"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="address">
                        <Form.Label column sm={3}>
                          Address
                        </Form.Label>
                        <Col sm={9}>
                          <Field
                            name="address"
                            type="text"
                            className="form-control"
                            placeholder="Type an address..."
                          />
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="phone">
                        <Form.Label column sm={3}>
                          Phone Number<span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                          <Field
                            name="phone"
                            type="tel"
                            className="form-control"
                            placeholder="Type a number..."
                          />
                        </Col>
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="gender">
                        <Form.Label column sm={3}>
                          Gender<span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                          <Select
                            inputId="gender"
                            value={values.gender}
                            onChange={(option) =>
                              setFieldValue("gender", option)
                            }
                            options={optionsGender}
                            className="basic-single-select"
                            classNamePrefix="select"
                            isClearable
                          />
                        </Col>
                        <ErrorMessage
                          name="gender"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <h5>II. Professional Information</h5>
                  <Row className="mb-3">
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="attachFile">
                        <Form.Label column sm={3}>
                          CV Attachment
                        </Form.Label>
                        <Col sm={9}>
                          <input
                            id="attachFile"
                            name="attachFile"
                            type="file"
                            className="form-control"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setFieldValue(
                                "attachFile",
                                file ? file.name : ""
                              );
                            }}
                          />
                          {values.attachFile && (
                            <small>Current file: {values.attachFile}</small>
                          )}
                        </Col>
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="yearExperience">
                        <Form.Label column sm={3}>
                          Year of Experience
                        </Form.Label>
                        <Col sm={9}>
                          <Field
                            name="yearExperience"
                            type="number"
                            className="form-control"
                            placeholder="Type a number"
                            min="0"
                          />
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="candidatePosition">
                        <Form.Label column sm={3}>
                          Current Position
                          <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                          <Select
                            inputId="candidatePosition"
                            value={values.candidatePosition}
                            onChange={(option) =>
                              setFieldValue("candidatePosition", option)
                            }
                            options={optionsPosition}
                            className="basic-single-select"
                            classNamePrefix="select"
                            isClearable
                          />
                        </Col>
                        <ErrorMessage
                          name="candidatePosition"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="highestLevel">
                        <Form.Label column sm={3}>
                          Highest Level<span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                          <Select
                            inputId="highestLevel"
                            value={values.highestLevel}
                            onChange={(option) =>
                              setFieldValue("highestLevel", option)
                            }
                            options={optionsLevel}
                            className="basic-single-select"
                            classNamePrefix="select"
                            isClearable
                          />
                        </Col>
                        <ErrorMessage
                          name="highestLevel"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="skillIds">
                        <Form.Label column sm={3}>
                          Skills<span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                          <Select
                            inputId="skillIds"
                            value={values.skillIds}
                            onChange={(option) =>
                              setFieldValue("skillIds", option)
                            }
                            options={optionsSkills}
                            isMulti
                            className="basic-multi-select"
                            classNamePrefix="select"
                          />
                        </Col>
                        <ErrorMessage
                          name="skillIds"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="note">
                        <Form.Label column sm={3}>
                          Note
                        </Form.Label>
                        <Col sm={9}>
                          <Field
                            name="note"
                            as="textarea"
                            rows={3}
                            className="form-control"
                          />
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="recruiterId">
                        <Form.Label column sm={3}>
                          Recruiter<span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                          <Select
                            inputId="recruiterId"
                            value={values.recruiterId}
                            onChange={(option) =>
                              setFieldValue("recruiterId", option)
                            }
                            options={recruiters}
                            placeholder="Select recruiter..."
                          />
                        </Col>
                        <ErrorMessage
                          name="recruiterId"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group as={Row} controlId="candidateStatus">
                        <Form.Label column sm={3}>
                          Status<span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Col sm={9}>
                          <Select
                            inputId="candidateStatus"
                            value={values.candidateStatus}
                            onChange={(option) =>
                              setFieldValue("candidateStatus", option)
                            }
                            options={optionCreateStatus}
                            className="basic-single-select"
                            classNamePrefix="select"
                            isClearable
                          />
                        </Col>
                        <ErrorMessage
                          name="candidateStatus"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
                <Row className="mb-3">
                  <Col xs={12}>
                    <div className="button-candidate">
                      <button
                        type="submit"
                        className="button-form button-form--primary"
                        data-testId="addbutton"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                      <button
                        type="button"
                        className="button-form"
                        onClick={() => navigate("/candidate")}
                      >
                        Cancel
                      </button>
                    </div>
                  </Col>
                </Row>
              </FormikForm>
            )}
          </Formik>
        </Row>
      </div>
    </Container>
  );
}
