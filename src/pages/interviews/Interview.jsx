import React, { Suspense, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchInterview from "./SearchInterview";
import InterviewTable from "./InterviewTable";
import { PAGE_SIZE, userRole } from "~/data/Constants";
import Pagination from "~/components/common/Pagination";
import { fetchInterview } from "~/services/interviewServices";
import { AuthContext } from "~/contexts/auth/AuthContext";

export default function Interview() {
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [dataInterviews, setDataInterviews] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setselectedStatus] = useState(0);
  const [selectedRecruiter, setSelectedRecruiter] = useState("");
  const role = userRole.find((r) => r.value === user?.role)?.value;

  const handleSearch = (searchText, selectedStatus, selectedRecruiter) => {
    setSearchText(searchText);
    setselectedStatus(selectedStatus);
    setSelectedRecruiter(selectedRecruiter);
    setCurrentPage(0);
  };

  const getInterviews = async (index, pageSize) => {
    let res = await fetchInterview(index, pageSize);
    if (res && res.data) {
      setDataInterviews(res.data);
      setTotalItems(res.data.length % PAGE_SIZE);
    }
  };

  useEffect(() => {
    //call api
    getInterviews(currentPage, PAGE_SIZE);
  }, [searchText, selectedStatus, selectedRecruiter]);

  const filterInterview = (
    dataInterviews,
    searchText,
    selectedStatus,
    selectedRecruiter
  ) => {
    let filtered = dataInterviews;

    if (searchText !== "") {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchText?.toLowerCase()) ||
          item.candidate.fullName
            ?.toLowerCase()
            .includes(searchText?.toLowerCase()) ||
          item.recruiterDTO.name
            ?.toLowerCase()
            .includes(searchText?.toLowerCase()) ||
          item.jobDTO?.name.toLowerCase().includes(searchText?.toLowerCase())
      );
    }

    if (selectedStatus != 0) {
      filtered = filtered.filter(
        (item) => item.interviewStatus == selectedStatus
      );
    }
    if (selectedRecruiter) {
      filtered = filtered.filter(
        (item) => item.recruiterDTO.name === selectedRecruiter
      );
    } else {
      filtered = filtered;
    }

    filtered.sort((a, b) => b.id - a.id);

    const startIndex = currentPage * PAGE_SIZE;
    if (filtered.length != totalItems) {
      setTotalItems(filtered.length);
    }

    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  };

  const filteredInterviews = filterInterview(
    dataInterviews,
    searchText,
    selectedStatus,
    selectedRecruiter
  );

  const handlePageChange = (index) => {
    setCurrentPage(index - 1);
  };

  return (
    <div className="interview-page">
      <div className="candidate-title">
        <div className="breadcrumb__group">
          <span className="breadcrumb-link ">Interview List</span>
        </div>
      </div>

      <div className="interview-page_search">
        <SearchInterview onSearch={handleSearch} />
      </div>
      {role !== "ROLE_INTERVIEWER" && (
        <div className="interview-page_link" style={{ marginBottom: "8px" }}>
          <Link
            className="button-form button-form--success"
            to={`/interview/add`}
          >
            Add new
          </Link>
        </div>
      )}

      <div>
        <InterviewTable dataInterviews={filteredInterviews} role={role} />
      </div>

      <Pagination
        currentPage={currentPage + 1}
        totalItems={Math.ceil(totalItems / PAGE_SIZE)}
        itemsPerPage={PAGE_SIZE}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
