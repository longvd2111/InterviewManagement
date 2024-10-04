import React, { useState, useEffect, useContext, useCallback } from "react";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { fetchAllCandidate, deleteCandidate } from "~/services/candidateApi";
import { CandidatePosition, CandidateStatus } from "~/data/Constants";
import SearchCandidate from "~/pages/candidates/SearchCandidate";
import Pagination from "~/components/common/Pagination";
import ConfirmModal from "~/components/common/ConfirmDelCandidate";
import { AuthContext } from "~/contexts/auth/AuthContext";
import { toast } from "react-toastify";
import debounce from "lodash/debounce"; // Import debounce from lodash

const CandidateTable = () => {
  const navigate = useNavigate();
  const [allCandidates, setAllCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const itemsPerPage = 10;
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setCurrentPage(
      localStorage.getItem("pageNumber")
        ? localStorage.getItem("pageNumber")
        : 1
    );

    const getCandidates = async () => {
      try {
        setLoading(true);
        let res = await fetchAllCandidate();
        if (res && res.data) {
          setAllCandidates(res.data);
          setFilteredCandidates(res.data);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    getCandidates();
  }, []);

  // Debounced search function to avoid spamming
  const debouncedSearch = useCallback(
    debounce((query, status) => {
      const filtered = allCandidates.filter((candidate) => {
        const matchesName = candidate.fullName
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesEmail = candidate.email
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesPhone = candidate.phone.includes(query);
        const matchesPosition = candidate.candidatePosition
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesOwnerHR = candidate.recruiter
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesStatus =
          status === "" || candidate.candidateStatus === status;

        return (
          (matchesName ||
            matchesEmail ||
            matchesPhone ||
            matchesPosition ||
            matchesOwnerHR) &&
          matchesStatus
        );
      });

      setFilteredCandidates(filtered);
      setCurrentPage(1); // Reset to first page on search
    }, 300), // 1000ms debounce delay
    [allCandidates]
  );

  const handleSearch = (query, status) => {
    debouncedSearch(query, status);
  };

  const handleDelete = async () => {
    if (candidateToDelete) {
      try {
        await deleteCandidate(candidateToDelete.id);
        setAllCandidates(
          allCandidates.filter(
            (candidate) => candidate.id !== candidateToDelete.id
          )
        );
        setFilteredCandidates(
          filteredCandidates.filter(
            (candidate) => candidate.id !== candidateToDelete.id
          )
        );
        setShowConfirmModal(false);
        setCandidateToDelete(null);
        toast.success("Delete candidate Successful!");
      } catch (error) {
        console.error("Error deleting candidate:", error);
        toast.error("Delete candidate Successful!");
      }
    }
  };

  const handlePageChange = (page) => {
    if (
      page > 0 &&
      page <= Math.ceil(filteredCandidates.length / itemsPerPage)
    ) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  filteredCandidates.sort((a, b) => b.id - a.id);
  const displayCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <div style={{ marginBottom: "20px", marginTop: "20px" }}>
        <SearchCandidate
          onSearch={handleSearch}
          style={{ margin: "0px 0px 0px 0px" }}
        />
      </div>
      {(user.role === "ROLE_ADMIN" ||
        user.role === "ROLE_MANAGER" ||
        user.role === "ROLE_RECRUITER") && (
        <div className="candidate-button" style={{ marginBottom: "20px" }}>
          <Link
            className="button-form button-form--success"
            to="/candidate/add"
          >
            Add new
          </Link>
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <table className="table table--striped table--bordered table--hover table--responsive">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone No.</th>
                <th>Current Position</th>
                <th>Owner HR</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayCandidates.length > 0 ? (
                displayCandidates.map((candidate, index) => (
                  <tr key={`list-candidate-${index}`}>
                    <td>{candidate.fullName}</td>
                    <td>{candidate.email}</td>
                    <td>{candidate.phone}</td>
                    <td>{CandidatePosition[candidate.candidatePosition]}</td>
                    <td>{candidate.recruiter}</td>
                    <td>{CandidateStatus[candidate.candidateStatus]}</td>
                    <td>
                      <FaEye
                        className="action--icon"
                        onClick={() => navigate(`/candidate/${candidate.id}`)}
                        style={{ cursor: "pointer" }}
                      />
                      {(user.role === "ROLE_ADMIN" ||
                        user.role === "ROLE_MANAGER" ||
                        user.role === "ROLE_RECRUITER") && (
                        <>
                          <BiEdit
                            data-testid={`edit-icon-${candidate.id}`}
                            className="action--icon"
                            onClick={() =>
                              navigate(`/candidate/edit/${candidate.id}`)
                            }
                            style={{ cursor: "pointer" }}
                          />
                          {candidate.candidateStatus === "OPEN" && (
                            <RiDeleteBin6Line
                              data-testid={`delete-icon-${candidate.id}`}
                              className="action--icon"
                              onClick={() => {
                                setShowConfirmModal(true);
                                setCandidateToDelete(candidate);
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No candidate has been found</td>
                </tr>
              )}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalItems={Math.ceil(filteredCandidates.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />

          <ConfirmModal
            show={showConfirmModal}
            handleClose={() => setShowConfirmModal(false)}
            handleConfirm={handleDelete}
          />
        </div>
      )}
    </>
  );
};

export default CandidateTable;
