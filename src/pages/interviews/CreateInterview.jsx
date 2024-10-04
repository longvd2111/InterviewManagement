import React, { useState, useEffect } from "react";
import { Row, Col, Form, Modal } from "react-bootstrap";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import "../../assets/css/interview-css/Interview.css";
import { fetchAllUser } from "~/services/userServices";
import { optionsSkills, userRole } from "~/data/Constants";
import _ from "lodash";
import { fetchAllJobs } from "~/services/jobApi";
import {
  fetchAllCandidate,
  fetchCandidateById,
  updateCandidate,
} from "~/services/candidateApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postInterview } from "~/services/interviewServices";
import { toast } from "react-toastify";
import {
  convertDobArrayToISO,
  convertToDateTimeSQL6,
  getSkillIds,
} from "~/utils/Validate";
import "../../assets/css/candidate-css/CandidateDetail.css";
import { getMessage } from "~/data/Messages";

const CreateInterview = () => {
  const [optionInterviews, setOptionInterviews] = useState([]);
  const [optionRecruiters, setOptionRecruiters] = useState([]);
  const [optionJobs, setOptionJobs] = useState([]);
  const [optionCandidates, setOptionCandidates] = useState([]);
  const [formdataCandidate, setFormdataCandidate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getInterviewer(0, 1000);
    getRecruiter(0, 1000);
    getJob(0, 1000);
    getCandidate();
  }, []);

  const getCandidate = async (index, pageSize) => {
    let res = await fetchAllCandidate();
    if (res && res.data) {
      const clonedListCandidates = res.data;

      // Lọc chỉ những candidate có status là OPEN
      const filteredCandidates = clonedListCandidates.filter(
        (item) => item.candidateStatus === "OPEN"
      );

      setOptionCandidates(
        filteredCandidates.map((item) => ({
          value: item.id,
          label: item.fullName,
        }))
      );
    }
  };

  const getInterviewer = async (index, pageSize) => {
    let res = await fetchAllUser(index, pageSize);
    const ROLE_INTERVIEWER = userRole.find(
      (role) => role.value === "ROLE_INTERVIEWER"
    );
    if (res && res.data) {
      const clonedListInterviewers = _.filter(
        res.data,
        (o) => o.userRole === ROLE_INTERVIEWER.value
      );
      setOptionInterviews(
        clonedListInterviewers.map((i) => ({
          value: i.id,
          label: i.fullName,
        }))
      );
    }
  };

  const getRecruiter = async (index, pageSize) => {
    let res = await fetchAllUser(index, pageSize);
    const ROLE_RECRUITER = userRole.find(
      (role) => role.value === "ROLE_RECRUITER"
    );
    if (res && res.data) {
      const clonedListRecruiters = _.filter(
        res.data,
        (o) => o.userRole === ROLE_RECRUITER.value
      );
      setOptionRecruiters(
        clonedListRecruiters.map((r) => ({
          value: r.id,
          label: r.fullName,
        }))
      );
    }
  };

  const getJob = async (index, pageSize) => {
    let res = await fetchAllJobs(index, pageSize);
    if (res && res.data) {
      const openJobs = res.data.filter((job) => job.jobStatus === "OPEN");
      setOptionJobs(
        openJobs.map((job) => ({
          value: job.id,
          label: job.jobTitle,
        }))
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      candidateId: "",
      scheduleDate: "",
      scheduleTimeFrom: "",
      scheduleTimeTo: "",
      note: "",
      position: "NOT_AVAILABLE",
      interviewerSet: [],
      location: "",
      recruiterId: "",
      meetingId: "",
      interviewResult: "NAN",
      interviewStatus: "OPEN",
      jobId: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(getMessage("ME002")),
      candidateId: Yup.number().required(getMessage("ME002")),
      interviewerSet: Yup.array()
        .required(getMessage("ME002"))
        .min(1, getMessage("ME002")),
      recruiterId: Yup.string().required(getMessage("ME002")),
      jobId: Yup.string().required(getMessage("ME002")),
      scheduleDate: Yup.date()
        .min(new Date(), getMessage("ME033"))
        .required(getMessage("ME002")),
      scheduleTimeFrom: Yup.string()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, getMessage("ME036"))
        .required(getMessage("ME002")),
      scheduleTimeTo: Yup.string()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, getMessage("ME036"))
        .required(getMessage("ME002"))
        .test("is-greater", getMessage("ME018"), function (value) {
          const { scheduleTimeFrom } = this.parent;
          if (!scheduleTimeFrom || !value) return true;
          return value > scheduleTimeFrom;
        }),
      note: Yup.string().max(500, getMessage("ME034")),
      meetingId: Yup.string().matches(
        /^[a-zA-Z0-9]{3}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{3}$/,
        getMessage("ME035")
      ),
    }),
    onSubmit: async (values) => {
      const candidateRes = await fetchCandidateById(values?.candidateId);

      // value interview
      const {
        scheduleTimeFrom,
        scheduleTimeTo,
        scheduleDate,
        ...valuesWithoutDate
      } = values;

      const scheduleTimeFromFinal = convertToDateTimeSQL6(
        scheduleDate,
        scheduleTimeFrom
      );
      const scheduleTimeToFinal = convertToDateTimeSQL6(
        scheduleDate,
        scheduleTimeTo
      );

      const {
        skills,
        recruiter,
        candidateStatus,
        ...formdataCandidateWithOutSkill
      } = candidateRes;

      setFormdataCandidate(candidateRes);

      const skillIds = getSkillIds(skills, optionsSkills);

      //form candidate
      const dataSubmitCandidate = {
        candidateStatus: "WAITING_FOR_INTERVIEW",
        recruiterId: values.recruiterId,
        dob: formdataCandidate?.dob
          ? convertDobArrayToISO(formdataCandidate.dob)
          : "",
        skillIds: skillIds,
        ...formdataCandidateWithOutSkill,
      };

      //form interviewSchedule
      const finalValues = {
        ...valuesWithoutDate,
        scheduleTimeFrom: scheduleTimeFromFinal,
        scheduleTimeTo: scheduleTimeToFinal,
        position: candidateRes?.candidatePosition,
      };

      const [resCan, resInterview] = await Promise.all([
        updateCandidate(dataSubmitCandidate),
        postInterview(finalValues),
      ]);

      if (resInterview && resCan) {
        toast.success("ME022");
        navigate("/interview");
      } else {
        toast.error(getMessage("ME021"));
      }
    },
  });

  return (
    <div>
      <div className="breadcrumb__group">
        <span
          className="breadcrumb-link"
          onClick={() => navigate("/interview")}
        >
          Interview Schedule List
        </span>
        <FaAngleRight />
        <span className="breadcrumb-link__active">New Interview Schedule</span>
      </div>

      <div className="candidate-detail">
        <Form onSubmit={formik.handleSubmit}>
          <div className="section">
            <div className="section-personal-info">
              {/* Interview Information */}

              {/* Schedule Title */}
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Schedule Title</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        placeholder="Type a title..."
                        {...formik.getFieldProps("title")}
                      />
                    </Col>
                    {formik.touched.title && formik.errors.title ? (
                      <div className="text-danger">{formik.errors.title}</div>
                    ) : null}
                  </Form.Group>
                </Col>

                {/* Job Option */}
                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Job</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Select
                        value={optionJobs.find(
                          (job) => job.value === formik.values.jobId
                        )}
                        onChange={(selectedOption) =>
                          formik.setFieldValue("jobId", selectedOption.value)
                        }
                        className="basic-single-select"
                        options={optionJobs}
                        classNamePrefix="select"
                        placeholder="Select a Job"
                        onBlur={() => formik.setFieldTouched("jobId", true)}
                      />
                    </Col>
                    {formik.touched.jobId && formik.errors.jobId ? (
                      <div className="text-danger">{formik.errors.jobId}</div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              {/* Candidate Name and Interviewers */}
              <Row className="mb-4">
                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Candidate Name</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Select
                        value={optionCandidates.find(
                          (candidate) =>
                            candidate.value === formik.values.candidateId
                        )}
                        onChange={(selectedOption) =>
                          formik.setFieldValue(
                            "candidateId",
                            selectedOption.value
                          )
                        }
                        options={optionCandidates}
                        className="basic-single-select"
                        classNamePrefix="select"
                        placeholder="Select a Candidate"
                      />
                    </Col>
                    {formik.touched.candidateId && formik.errors.candidateId ? (
                      <div className="text-danger">
                        {formik.errors.candidateId}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Interviewers</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Select
                        isMulti
                        value={optionInterviews.filter((interviewer) =>
                          formik.values.interviewerSet.includes(
                            interviewer.value
                          )
                        )}
                        onChange={(selectedOptions) =>
                          formik.setFieldValue(
                            "interviewerSet",
                            selectedOptions.map((option) => option.value)
                          )
                        }
                        options={optionInterviews}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select interviewers"
                      />
                    </Col>
                    {formik.touched.interviewerSet &&
                    formik.errors.interviewerSet ? (
                      <div className="text-danger">
                        {formik.errors.interviewerSet}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              {/* Date and Location */}
              <Row className="mb-4">
                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Schedule Date</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="date"
                        {...formik.getFieldProps("scheduleDate")}
                      />
                    </Col>
                    {formik.touched.scheduleDate &&
                    formik.errors.scheduleDate ? (
                      <div className="text-danger">
                        {formik.errors.scheduleDate}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Location</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        placeholder="Type a location..."
                        {...formik.getFieldProps("location")}
                      />
                    </Col>
                    {formik.touched.location && formik.errors.location ? (
                      <div className="text-danger">
                        {formik.errors.location}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              {/* Time and Recruiter */}
              <Row className="mb-4">
                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>From</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="time"
                        {...formik.getFieldProps("scheduleTimeFrom")}
                      />
                    </Col>
                    {formik.touched.scheduleTimeFrom &&
                    formik.errors.scheduleTimeFrom ? (
                      <div className="text-danger">
                        {formik.errors.scheduleTimeFrom}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>To</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="time"
                        {...formik.getFieldProps("scheduleTimeTo")}
                      />
                    </Col>
                    {formik.touched.scheduleTimeTo &&
                    formik.errors.scheduleTimeTo ? (
                      <div className="text-danger">
                        {formik.errors.scheduleTimeTo}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              {/* Recruiter and meetingId*/}
              <Row className="mb-4">
                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Recruiter</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Select
                        value={optionRecruiters.find(
                          (recruiter) =>
                            recruiter.value === formik.values.recruiterId
                        )}
                        onChange={(selectedOption) =>
                          formik.setFieldValue(
                            "recruiterId",
                            selectedOption.value
                          )
                        }
                        options={optionRecruiters}
                        className="basic-single-select"
                        classNamePrefix="select"
                        placeholder="Select a recruiter"
                      />
                    </Col>
                    {formik.touched.recruiterId && formik.errors.recruiterId ? (
                      <div className="text-danger">
                        {formik.errors.recruiterId}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Meeting Id</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        placeholder="Type a meetingId..."
                        {...formik.getFieldProps("meetingId")}
                      />
                    </Col>
                    {formik.touched.meetingId && formik.errors.meetingId ? (
                      <div className="text-danger">
                        {formik.errors.meetingId}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col xs={12} md={9}>
                  <Form.Group as={Row} style={{ alignItems: "normal" }}>
                    <Form.Label column sm={2}>
                      <strong>Note</strong>
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        {...formik.getFieldProps("note")}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
            </div>
            {/* Submit button */}
          </div>
          <Row className="mt-4">
            <Col className="d-flex justify-content-center">
              <button
                type="button"
                onClick={(e) => {
                  formik.handleSubmit();
                }}
                className="button-form button-form--primary"
              >
                Submit
              </button>
              <button
                type="button"
                className="button-form"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default CreateInterview;
