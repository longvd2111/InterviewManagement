import React, { useContext, useEffect, useState } from "react";
import { Table, Modal, Button, Row } from "react-bootstrap";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/job-css/JobList.css";
import { fetchAllJobs, deleteJobs } from "~/services/jobApi";
import SearchJob from "./SearchJob";
import Pagination from "~/components/common/Pagination";
import { AuthContext } from "~/contexts/auth/AuthContext";
import { toast } from "react-toastify";
import { JobStatus, JobLevel } from "~/data/Constants";
import { importJob } from "~/services/jobApi";
import * as XLSX from "xlsx";
import { getMessage } from "~/data/Messages";
export default function JobsList() {
  // Cập nhật skillsMap với định dạng { value, label }
  const skillsMap = {
    Java: { value: 1, label: "Java" },
    Nodejs: { value: 2, label: "Nodejs" },
    ".Net": { value: 3, label: ".Net" },
    "C++": { value: 4, label: "C++" },
    "Business Analyst": { value: 5, label: "Business Analyst" },
    Communication: { value: 6, label: "Communication" },
  };
  // Cập nhật BenefitsMap với định dạng { value, label }
  const benefitsMap = {
    Lunch: { value: 1, label: "Lunch" },
    "25-day Leave": { value: 2, label: "25-day Leave" },
    "Healthcare Insurance": { value: 3, label: "Healthcare Insurance" },
    "Hybrid working": { value: 4, label: "Hybrid working" },
    Travel: { value: 5, label: "Travel" },
  };
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalJob, setModalJob] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { user } = useContext(AuthContext);
  const convertDateToArray = (dateString) => {
    if (typeof dateString !== "string") {
      throw new TypeError("dateString should be a string");
    }
    const [day, month, year] = dateString.split("/").map(Number);
    return [year, month - 1, day]; // month - 1 because JavaScript Date months are 0-based
  };

  const navigate = useNavigate();

  // Chuyển đổi từ tên kỹ năng sang đối tượng kỹ năng với id
  const convertSkillsToRequiredSkillSet = (skillsString) => {
    if (!skillsString) return [];
    const skills = skillsString.split(",").map((skill) => skill.trim());
    return skills
      .map((skill) => skillsMap[skill]) // Lấy đối tượng kỹ năng từ skillsMap
      .filter((skill) => skill !== undefined) // Loại bỏ kỹ năng không có trong skillsMap
      .map((skill) => ({ id: skill.value, name: skill.label })); // Chuyển đổi thành định dạng { id, name }
  };
  useEffect(() => {
    const getJobs = async () => {
      try {
        const res = await fetchAllJobs();
        if (res.data) {
          const sortedJobs = res.data.sort((a, b) => b.id - a.id); // Sắp xếp công việc theo id giảm dần
          setJobs(sortedJobs);
          setFilteredJobs(sortedJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  const handleDeleteClick = (job) => {
    setModalJob(job);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteJobs(modalJob.id);
      const updatedJobs = jobs.filter((item) => item.id !== modalJob.id);
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
      toast.success(getMessage("ME019"));
    } catch (error) {
      toast.error(getMessage("ME020"));
    } finally {
      setShowModal(false);
    }
  };

  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray) && dateArray.length === 3) {
      const [year, month, day] = dateArray;
      const formattedDay = day.toString().padStart(2, "0");
      const formattedMonth = month.toString().padStart(2, "0");
      return `${formattedDay}/${formattedMonth}/${year}`;
    }
    return "";
  };
  // Chuyển đổi từ tên lợi ích sang đối tượng lợi ích với id
  const convertBenefitsToBenefitIds = (benefitsString) => {
    if (!benefitsString) return [];
    const benefits = benefitsString.split(",").map((benefit) => benefit.trim());
    return benefits
      .map((benefit) => benefitsMap[benefit]) // Lấy đối tượng lợi ích từ benefitsMap
      .filter((benefit) => benefit !== undefined) // Loại bỏ lợi ích không có trong benefitsMap
      .map((benefit) => ({ id: benefit.value, name: benefit.label })); // Chuyển đổi thành định dạng { id, name }
  };

  const handleModalClose = () => setShowModal(false);

  const handleSearch = (query, status) => {
    const filtered = jobs.filter((job) => {
      const matchesTitle = job.jobTitle
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesSkill = job.requiredSkillSet.some((skill) =>
        skill.name.toLowerCase().includes(query.toLowerCase())
      );
      const matchesLevel = job.jobLevel
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = status === "" || job.jobStatus === status;
      return (matchesTitle || matchesSkill || matchesLevel) && matchesStatus;
    });
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(filteredJobs.length / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const handleImportFile = (e) => {
    console.log("vao import file");

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const maxExistingId =
        jobs.length > 0 ? Math.max(...jobs.map((job) => job.id)) : 0;

      // Process each row and send it to the API
      data.forEach((row, index) => {
        let startDateArray = [null, null, null];
        let endDateArray = [null, null, null];

        // Convert startDate và endDate từ file
        if (row.startDate) {
          startDateArray = convertDateToArray(String(row.startDate));
        }
        if (row.endDate) {
          endDateArray = convertDateToArray(String(row.endDate));
        }

        // Convert skills to requiredSkillSet
        const requiredSkillSet = row.skills
          ? convertSkillsToRequiredSkillSet(row.skills)
          : [];

        // Convert benefits to benefitIds
        const benefitIds = row.benefits
          ? convertBenefitsToBenefitIds(row.benefits)
          : [];

        const jobData = {
          id: maxExistingId + index + 1,
          ...row,
          startDate: startDateArray,
          endDate: endDateArray,
          skillIds: [1, 3],
          benifitIds: [2, 5],
          jobStatus: "OPEN",
        };

        console.log(`Row ${index + 1}:`, jobData);

        // Send job data to API
        importJob(jobData)
          .then((response) => {
            console.log(`Job with ID ${jobData.id} added successfully`);
            toast.success(`Job added successfully`);
            fetchAllJobs()
              .then((response) => setJobs(response.data))
              .catch((error) => console.error(error));
          })
          .catch((error) => {
            console.error(`Error adding job with ID ${jobData.id}`, error);
            toast.error(`Error adding job. Please try again.`);
          });
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Row>
        <SearchJob onSearch={handleSearch} />
      </Row>

      {user.role !== "ROLE_INTERVIEWER" && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div className="button-group" style={{ display: "flex" }}>
            <Link
              className="button-form button-form--success"
              style={{ marginRight: "10px" }}
              to="/job/add"
            >
              Add New
            </Link>

            <label
              htmlFor="file-upload"
              className="button-form button-form--warning"
            >
              Import
            </label>
            <input
              style={{ display: "none" }}
              id="file-upload"
              type="file"
              accept=".xlsx, .xls"
              className="file-input"
              onChange={handleImportFile} // onChange is better for file inputs
            />
          </div>
        </div>
      )}

      <div>
        {loading ? (
          <div>Loading....</div>
        ) : (
          <>
            <Table striped bordered hover responsive style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Required Skills</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayJobs.length > 0 ? (
                  displayJobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.jobTitle}</td>
                      <td>
                        {job.requiredSkillSet.map((skill, index) => (
                          <span key={index}>
                            {skill.name}
                            {index < job.requiredSkillSet.length - 1 && ", "}
                          </span>
                        ))}
                      </td>
                      <td>{formatDate(job.startDate)}</td>
                      <td>{formatDate(job.endDate)}</td>
                      <td>{JobStatus[job.jobStatus]}</td>
                      <td>{JobLevel[job.jobLevel]}</td>
                      <td>
                        <FaEye
                          className="action--icon"
                          onClick={() => navigate(`/job/${job.id}`)}
                          style={{ cursor: "pointer", marginRight: "10px" }}
                        />
                        {(user.role === "ROLE_ADMIN" ||
                          user.role === "ROLE_MANAGER" ||
                          user.role === "ROLE_RECRUITER") && (
                          <>
                            <FaEdit
                              className="action--icon"
                              onClick={() => navigate(`edit/${job.id}`)}
                              style={{ cursor: "pointer", marginRight: "10px" }}
                            />
                            <FaTrash
                              className="action--icon"
                              onClick={() => handleDeleteClick(job)}
                              style={{ cursor: "pointer", marginRight: "10px" }}
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">
                      No item matches with your search data. Please try again.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <Pagination
              currentPage={currentPage}
              totalItems={Math.ceil(filteredJobs.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />

            <Modal show={showModal} onHide={handleModalClose}>
              <Modal.Header closeButton></Modal.Header>
              <Modal.Body>
                <h4 style={{ textAlign: "center" }}>
                  Are you sure you want to delete this job?
                </h4>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>
    </>
  );
}
