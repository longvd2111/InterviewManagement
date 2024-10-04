import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../assets/css/interview-css/Interview.css";
import { FaAngleRight } from "react-icons/fa6";
import { fetchInterviewDetail } from "~/services/interviewServices";
import {
  convertToDay,
  convertToHour,
  getLabelFromValue,
  handleClickURL,
} from "~/utils/Validate";
import {
  InterviewResult,
  InterviewStatus,
  optionsPosition,
  userRole,
} from "~/data/Constants";
import { Col, Row } from "react-bootstrap";
import "../../assets/css/candidate-css/CandidateDetail.css";
import { AuthContext } from "~/contexts/auth/AuthContext";

const InterviewDetail = () => {
  const { user } = useContext(AuthContext);
  const role = userRole.find((r) => r.value === user?.role)?.value;

  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState({});

  const getInterview = async (id) => {
    let res = await fetchInterviewDetail(id);
    if (res) {
      setInterview(res);
    } else {
      console.error("No data returned from API");
    }
  };

  useEffect(() => {
    getInterview(id);
  }, []);

  return (
    <div className="candidate-detail-container">
      <div className="candidate-title">
        <div className="breadcrumb__group">
          <span
            className="breadcrumb-link "
            onClick={() => navigate("/interview")}
          >
            Interview Schedule List
          </span>
          <FaAngleRight />
          <span className="breadcrumb-link__active">
            Interview Schedule Details
          </span>
        </div>
      </div>

      <div className="candidate-ban">
        <button className="button-form button-form--primary">
          Send reminder
        </button>
      </div>

      <div className="candidate-detail">
        <div className="section">
          <div className="section-personal-info">
            <Row>
              <Col>
                <p>
                  <strong>Schedule title:</strong> {interview?.title}
                </p>
                <p>
                  <strong>Candidate name:</strong>{" "}
                  {interview?.candidate?.fullName}
                </p>
                <p>
                  <strong>Schedule Time:</strong>{" "}
                  {interview?.scheduleTimeFrom
                    ? convertToDay(interview?.scheduleTimeFrom)
                    : "N/A"}{" "}
                  From{" "}
                  {interview?.scheduleTimeFrom
                    ? convertToHour(interview?.scheduleTimeFrom)
                    : "N/A"}{" "}
                  To{" "}
                  {interview?.scheduleTimeTo
                    ? convertToHour(interview.scheduleTimeTo)
                    : "N/A"}
                </p>
                <p>
                  <strong>Location:</strong> {interview?.location}
                </p>
                <p>
                  <strong>Meeting ID:</strong>{" "}
                  <Link
                    to="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="schedule__value"
                    onClick={(event) =>
                      handleClickURL(event, interview?.meetingId)
                    }
                    style={{ fontSize: "1.1rem" }}
                  >
                    {interview?.meetingId || "No Meeting ID"}
                  </Link>
                </p>
                <p>
                  <strong>Notes:</strong>{" "}
                  {interview?.note ? interview.note : "NaN"}
                </p>
              </Col>
              <Col>
                <p>
                  <strong>Job:</strong> {interview?.jobDTO?.name || "NaN"}
                </p>
                <p>
                  <strong>Position: </strong>
                  {getLabelFromValue(optionsPosition, interview?.position)}
                </p>
                <p>
                  <strong>Interviewer:</strong>{" "}
                  {interview?.interviewerSet
                    ?.map((item) => item.name)
                    .join(", ")}
                </p>

                <p>
                  <strong>Recruiter owner: </strong>
                  {interview?.recruiterDTO?.name}
                </p>

                <p>
                  <strong>Result:</strong>{" "}
                  {
                    InterviewResult.find(
                      (ir) => ir.value === interview?.interviewResult
                    )?.label
                  }
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {
                    InterviewStatus.find(
                      (is) => is.value === interview?.interviewStatus
                    )?.label
                  }
                </p>
              </Col>
            </Row>
          </div>
        </div>

        <div className="actions">
          {role !== "ROLE_INTERVIEWER" && (
            <button
              className="button-form button-form--warning"
              onClick={() => navigate(`/interview/edit/${id}`)}
            >
              Edit
            </button>
          )}

          <button className="button-form" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetail;
