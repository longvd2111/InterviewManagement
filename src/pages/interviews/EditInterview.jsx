import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Modal } from "react-bootstrap";
import Select from "react-select";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import "../../assets/css/interview-css/Interview.css";
import { fetchAllUser } from "~/services/userServices";
import {
  InterviewResult,
  InterviewStatus,
  optionsSkills,
  userRole,
} from "~/data/Constants";
import _ from "lodash";
import { fetchAllJobs } from "~/services/jobApi";
import {
  fetchAllCandidate,
  fetchCandidateById,
  updateCandidate,
} from "~/services/candidateApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  fetchInterviewDetail,
  postInterview,
  putInterview,
} from "~/services/interviewServices"; // Thêm API để lấy và cập nhật thông tin
import {
  convertDobArrayToISO,
  convertToDateTimeSQL6,
  convertToHour,
  formatDayFromApi,
  getLabelFromValue,
  getSkillIds,
} from "~/utils/Validate";
import { toast } from "react-toastify";
import { getMessage } from "~/data/Messages";

const user = JSON.parse(localStorage.getItem("user"));

const EditInterview = () => {
  const [optionInterviews, setOptionInterviews] = useState([]);
  const [optionRecruiters, setOptionRecruiters] = useState([]);
  const [optionJobs, setOptionJobs] = useState([]);
  const [optionCandidates, setOptionCandidates] = useState([]);
  const [interviewSchedule, setInterviewSchedule] = useState(null);
  const [show, setShow] = useState(false);
  const [oldCandidate, setOldCandidate] = useState([]);
  const [newCandidate, setNewCandidate] = useState([]);

  const [selectedOption, setSelectedOption] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getInterviewSchedule(id);
    getInterviewers(0, 100);
    getRecruiter(0, 100);
    getJob(0, 100);
    getCandidates();
  }, [id]);

  useEffect(() => {
    if (interviewSchedule?.candidate?.id) {
      getCandidate(interviewSchedule?.candidate?.id);
    }
  }, [interviewSchedule]);

  const getInterviewSchedule = async (id) => {
    let res = await fetchInterviewDetail(id);
    if (res) {
      setInterviewSchedule({
        ...res,
        scheduleTimeFrom: convertToHour(res.scheduleTimeFrom),
        scheduleTimeTo: convertToHour(res.scheduleTimeTo),
        scheduleDate: formatDayFromApi(res.scheduleTimeFrom),
        interviewerSet:
          res?.interviewerSet.map((interviewer) => interviewer.id) || [],
      });
    } else {
      console.error("No data returned from API");
    }
  };

  const getCandidates = async (index, pageSize, currentCandidate) => {
    let res = await fetchAllCandidate();
    if (res && res.data) {
      const clonedListCandidates = res.data;

      // Lọc chỉ những candidate có status là OPEN
      const filteredCandidates = clonedListCandidates.filter(
        (item) => item.candidateStatus === "OPEN"
      );

      const candidateOptions = filteredCandidates.map((item) => ({
        value: item.id,
        label: item.fullName,
      }));

      // Thêm candidate hiện tại nếu chưa có trong danh sách
      if (currentCandidate) {
        const isCandidateInList = candidateOptions.some(
          (option) => option.value === currentCandidate.id
        );

        if (!isCandidateInList) {
          candidateOptions.push({
            value: currentCandidate.id,
            label: currentCandidate.fullName,
          });
        }
      }

      setOptionCandidates(candidateOptions);
    }
  };

  const getCandidate = async (id) => {
    let res = await fetchCandidateById(id);
    if (res) {
      setOldCandidate(res);
      // Cập nhật danh sách candidates với candidate hiện tại
      getCandidates(0, 100, res);
    } else {
      console.error("No data candidate returned from API");
    }
  };

  const getInterviewers = async (index, pageSize) => {
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
      setOptionJobs(
        res.data.map((job) => ({
          value: job.id,
          label: job.jobTitle,
        }))
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      title: interviewSchedule?.title || "",
      candidateId: interviewSchedule?.candidate?.id || "",
      scheduleDate: interviewSchedule?.scheduleDate || "",
      scheduleTimeFrom: interviewSchedule?.scheduleTimeFrom || "",
      scheduleTimeTo: interviewSchedule?.scheduleTimeTo || "",
      note: interviewSchedule?.note || "",
      position: interviewSchedule?.position || "",
      interviewerSet: interviewSchedule?.interviewerSet || [],
      location: interviewSchedule?.location || "",
      recruiterId: interviewSchedule?.recruiterDTO?.id || "",
      meetingId: interviewSchedule?.meetingId || "",
      interviewResult: interviewSchedule?.interviewResult || "",
      interviewStatus: interviewSchedule?.interviewStatus || "",
      jobId: interviewSchedule?.jobDTO?.id || "",
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
    enableReinitialize: true,
    onSubmit: async (values) => {
      // call api candidateNew
      const candidateRes = await fetchCandidateById(values.candidateId);
      if (!candidateRes) {
        toast.error(getMessage("ME021"));
        return;
      }

      const {
        scheduleTimeFrom,
        scheduleTimeTo,
        scheduleDate,
        interviewerSet,
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

      const { skills: newSkills, ...formdataNewCandidateWithOutSkill } =
        candidateRes;
      setNewCandidate(candidateRes);

      const skillIds = getSkillIds(newSkills, optionsSkills);

      const dataSubmitNewCandidate = {
        candidateStatus: "WAITING_FOR_INTERVIEW",
        recruiterId: values.recruiterId,
        dob: newCandidate?.dob ? convertDobArrayToISO(newCandidate.dob) : "",
        skillIds,
        ...formdataNewCandidateWithOutSkill,
      };

      const finalValues = {
        ...valuesWithoutDate,
        scheduleTimeFrom: scheduleTimeFromFinal,
        scheduleTimeTo: scheduleTimeToFinal,
        interviewerSet,
        id: id,
        position: candidateRes?.candidatePosition,
      };

      const updateCandidateAndInterview = async (
        newCandidateData,
        oldCandidateData = null
      ) => {
        if (oldCandidateData) {
          const resOldCan = await updateCandidate(oldCandidateData);
          if (!resOldCan) throw new Error(getMessage("ME037"));
        }

        const resNewCan = await updateCandidate(newCandidateData);
        if (!resNewCan) throw new Error(getMessage("ME038"));

        const resInterview = await putInterview(finalValues);
        if (!resInterview) throw new Error(getMessage("ME013"));

        toast.success(getMessage("ME014"));
        navigate("/interview");
      };

      if (newCandidate?.id === oldCandidate?.id) {
        await updateCandidateAndInterview(dataSubmitNewCandidate);
      } else {
        const { skills: oldSkills, ...formdataOldCandidateWithOutSkill } =
          oldCandidate;

        const oldSkillIds = getSkillIds(oldSkills, optionsSkills);

        const dataSubmitOldCandidate = {
          candidateStatus: "WAITING_FOR_INTERVIEW",
          recruiterId: values.recruiterId,
          dob: oldCandidate?.dob ? convertDobArrayToISO(oldCandidate.dob) : "",
          skillIds: oldSkillIds,
          ...formdataOldCandidateWithOutSkill,
        };

        await updateCandidateAndInterview(
          dataSubmitNewCandidate,
          dataSubmitOldCandidate
        );
      }
    },
  });

  const handleCancelSchedule = async () => {
    const {
      recruiterDTO,
      jobDTO,
      scheduleTimeFrom,
      scheduleTimeTo,
      scheduleDate,
      candidate,
      ...updatedData
    } = interviewSchedule;

    const scheduleTimeFromFinal = convertToDateTimeSQL6(
      scheduleDate,
      scheduleTimeFrom
    );
    const scheduleTimeToFinal = convertToDateTimeSQL6(
      scheduleDate,
      scheduleTimeTo
    );

    const finalUpdatedData = {
      ...updatedData,
      recruiterId: recruiterDTO?.id,
      jobId: jobDTO?.id,
      interviewStatus: "CANCELLED",
      scheduleTimeFrom: scheduleTimeFromFinal,
      scheduleTimeTo: scheduleTimeToFinal,
      candidateId: candidate?.id,
    };

    const { recruiter, skills, ...updatedCandidate } = oldCandidate;

    const skillIds = getSkillIds(skills, optionsSkills);

    const finalUpdatedCandidate = {
      ...updatedCandidate,
      candidateStatus: "CANCELLED_INTERVIEW",
      recruiterId: finalUpdatedData?.recruiterId,
      skillIds: skillIds,
    };

    const [resCan, resInterview] = await Promise.all([
      updateCandidate(finalUpdatedCandidate),
      putInterview(finalUpdatedData),
    ]);

    if (resInterview && resCan) {
      handleClose();
      toast.success(getMessage("ME014"));
      navigate("/interview");
    } else {
      toast.error(getMessage("ME013"));
    }
  };

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
        <span className="breadcrumb-link__active">Edit Interview Schedule</span>
      </div>

      {interviewSchedule &&
        interviewSchedule?.id &&
        interviewSchedule.interviewStatus === "OPEN" && (
          <div className="candidate-ban">
            <button
              className="button-form button-form--danger"
              onClick={handleCancelSchedule}
            >
              Cancel Schedule
            </button>
          </div>
        )}

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
                          (job) => job.value === formik.values?.jobId
                        )}
                        onChange={(selectedOption) =>
                          formik.setFieldValue("jobId", selectedOption.value)
                        }
                        className="basic-single-select"
                        options={optionJobs}
                        classNamePrefix="select"
                        placeholder="Select a Job"
                      />
                    </Col>
                    {formik.touched.jobId && formik.errors.jobId ? (
                      <div className="text-danger">{formik.errors.jobId}</div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              {/* Candidate Name and Interviewers */}
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Candidate Name</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Select
                        value={optionCandidates.find(
                          (c) => c.value === formik.values?.candidateId
                        )}
                        onChange={(selectedOption) => {
                          setSelectedOption(selectedOption); // Update the local state
                          formik.setFieldValue(
                            "candidateId",
                            selectedOption.value
                          ); // Update Formik
                        }}
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
                        value={optionInterviews?.filter((option) =>
                          formik.values?.interviewerSet?.includes(option.value)
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
              <Row className="mb-3">
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
                      <span style={{ color: "red" }}>*</span>
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
              <Row className="mb-3">
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

              {/* Recruiter */}
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Recruiter</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={9}>
                      <Select
                        value={optionRecruiters?.find(
                          (r) => r.value === formik.values?.recruiterId
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

              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Result</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <div>
                        {getLabelFromValue(
                          InterviewResult,
                          formik.values.interviewResult
                        )}
                      </div>
                    </Col>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Status</strong>
                    </Form.Label>
                    <Col sm={9}>
                      <div>
                        {getLabelFromValue(
                          InterviewStatus,
                          formik.values.interviewStatus
                        )}
                      </div>
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={9}>
                  <Form.Group as={Row} style={{ alignItems: "normal" }}>
                    <Form.Label column sm={2}>
                      <strong>Note</strong>
                    </Form.Label>
                    <Col sm={10}>
                      <Form.Control
                        style={{ border: 0 }}
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
                type="submit"
                className="button-form button-form--primary"
              >
                Update
              </button>
              <button
                className="button-form"
                onClick={() => navigate(-1)}
                type="button"
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

export default EditInterview;
