import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import { Row, Col } from "react-bootstrap";
import { fetchCandidateById, updateCandidate } from "~/services/candidateApi";
import { fetchAllUser } from "~/services/userServices";
import {
  CandidateGender,
  CandidateLevel,
  CandidatePosition,
  CandidateStatus,
  optionsSkills,
} from "~/data/Constants";
import { toast } from "react-toastify";
import { AuthContext } from "~/contexts/auth/AuthContext";
import ConfirmModal from "~/components/common/ConfirmBanCandidate";
import "../../assets/css/candidate-css/CandidateDetail.css";
import { getSkillIds } from "~/utils/Validate";
import { getMessage } from "~/data/Messages";

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [showBanModal, setShowBanModal] = useState(false);

  useEffect(() => {
    const getCandidateById = async () => {
      try {
        const res = await fetchCandidateById(id);
        if (res) {
          setCandidate(res);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchAllUser(0, 1000).then((response) => {
      const users = response.data;
      const recruitersList = users
        .filter((user) => user.userRole === "ROLE_RECRUITER")
        .map((user) => ({
          value: user.id,
          label: user.fullName,
        }));
      setRecruiters(recruitersList);
    });

    getCandidateById();
  }, [id]);

  const handleBanCandidate = async () => {
    try {
      const recruiter = recruiters.find(
        (user) => user.label === candidate.recruiter
      );
      if (!recruiter) {
        throw new Error("Recruiter not found");
      }

      const skillIds = getSkillIds(candidate?.skills || [], optionsSkills);

      // Prepare updated candidate object
      const updatedCandidate = {
        id: candidate.id,
        candidateStatus: "BANNED",
        recruiterId: recruiter.value,
        address: candidate.address,
        attachFile: candidate.attachFile,
        candidatePosition: candidate.candidatePosition,
        dob: candidate.dob
          ? new Date(candidate.dob).toISOString().split("T")[0]
          : "",
        email: candidate.email,
        fullName: candidate.fullName,
        gender: candidate.gender,
        highestLevel: candidate.highestLevel,
        note: candidate.note,
        skillIds: skillIds,
        phone: candidate.phone,
        yearExperience: candidate.yearExperience,
      };

      // Update the candidate
      await updateCandidate(updatedCandidate);
      toast.success(getMessage("ME031"));
      navigate(`/candidate`);
    } catch (error) {
      toast.error(getMessage("ME032"));
    }
  };

  const formatDate = (dob) => {
    const date = new Date(dob);
    return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
      date.getDate()
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  if (loading) return <div>Loading...</div>;
  if (error)
    return <div>There was an error loading the candidate details.</div>;
  if (!candidate) return <div>Candidate not found</div>;

  return (
    <div className="candidate-detail-container">
      <div className="candidate-title">
        <div className="breadcrumb__group">
          <span
            className="breadcrumb-link"
            onClick={() => navigate("/candidate")}
          >
            Candidate List
          </span>
          <FaAngleRight />
          <span className="breadcrumb-link__active">Candidate Information</span>
        </div>
      </div>
      {(user.role === "ROLE_ADMIN" ||
        user.role === "ROLE_MANAGER" ||
        user.role === "ROLE_RECRUITER") &&
        candidate.candidateStatus === "OPEN" && (
          <div className="candidate-ban">
            <button
              className="button-form button-form--danger"
              onClick={() => setShowBanModal(true)}
              style={{ cursor: "pointer" }}
            >
              Ban Candidate
            </button>
          </div>
        )}

      <div className="candidate-detail">
        <div className="section">
          <div className="section-personal-info">
            <h5>I. Personal information</h5>
            <Row>
              <Col>
                <p data-testid="fullName">
                  <strong>Full name: </strong> {candidate.fullName}
                </p>
                <p>
                  <strong>D.O.B:</strong> {formatDate(candidate.dob)}
                </p>
                <p>
                  <strong>Phone number:</strong> {candidate.phone}
                </p>
              </Col>
              <Col>
                <p>
                  <strong>Email:</strong> {candidate.email}
                </p>
                <p>
                  <strong>Address:</strong> {candidate.address}
                </p>
                <p data-testid="gender">
                  <strong>Gender: </strong> {CandidateGender[candidate.gender]}
                </p>
              </Col>
            </Row>
          </div>

          <div className="section-professional-info">
            <h5>II. Professional information</h5>
            <Row>
              <Col>
                <p>
                  <strong>CV attachment:</strong>{" "}
                  <a href={`/api/candidates/${candidate.id}/download-cv`}>
                    CV-{candidate.fullName}.pdf
                  </a>
                </p>
                <p>
                  <strong>Current Position:</strong>{" "}
                  {CandidatePosition[candidate.candidatePosition]}
                </p>
                <p>
                  <strong>Skills:</strong>{" "}
                  {candidate.skills &&
                    candidate.skills.map((skill) => (
                      <span key={skill} className="badge m-1">
                        {skill}
                      </span>
                    ))}
                </p>
                <p>
                  <strong>Recruiter:</strong> {candidate.recruiter}
                </p>
              </Col>
              <Col>
                <p data-testid="status">
                  <strong>Status: </strong>{" "}
                  {CandidateStatus[candidate.candidateStatus]}
                </p>
                <p>
                  <strong>Year of Experience:</strong>{" "}
                  {candidate.yearExperience}
                </p>
                <p data-testid="level">
                  <strong>Highest level: </strong>{" "}
                  {CandidateLevel[candidate.highestLevel]}
                </p>
                <p>
                  <strong>Note:</strong> {candidate.note}
                </p>
              </Col>
            </Row>
          </div>
        </div>
        <div className="actions">
          {(user.role === "ROLE_ADMIN" ||
            user.role === "ROLE_MANAGER" ||
            user.role === "ROLE_RECRUITER") && (
            <button
              className="button-form button-form--warning"
              onClick={() => navigate(`/candidate/edit/${candidate.id}`)}
            >
              Edit
            </button>
          )}
          <button className="button-form" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>

      <ConfirmModal
        show={showBanModal}
        handleClose={() => setShowBanModal(false)}
        handleConfirm={handleBanCandidate}
        title="Confirm Ban"
        body="Are you sure you want to ban this candidate?"
      />
    </div>
  );
};

export default CandidateDetail;
