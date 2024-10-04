import React, { useState, useEffect } from "react";
import { Row } from "react-bootstrap";
import "../../assets/css/job-css/Job.css";
import "../../assets/css/user-css/User.css";
import { Link } from "react-router-dom";
import UsersList from "../users/UserList";
import SearchUser from "../users/SearchUser";
import Pagination from "../../components/common/Pagination";
import ApiUser from "~/services/usersApi";

export default function User() {
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = (query, selectedRole) => {
    setSearchQuery(query);
    setRole(selectedRole);
    setCurrentPage(1);
  };

  const loadDataUser = async () => {
    try {
      const response = await ApiUser.getUsers();
      setUsersList(response.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadDataUser();
  }, []);

  const filterUsers = usersList.filter((user) => {
    const searchMatch =
      !searchQuery ||
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const roleMatch = !role || user.userRole === role;

    return searchMatch && roleMatch;
  });

  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(filterUsers.length / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayUsers = filterUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="App">
      <div className="breadcrumb__group">
        <span className="breadcrumb-link">User List</span>
      </div>
      <Row style={{ marginBottom: "-20px" }}>
        <SearchUser onSearch={handleSearch} />
      </Row>

      {role !== "ROLE_INTERVIEWER" && (
        <div className="interview-page_link" style={{ marginBottom: "8px" }}>
          <Link className="button-form button-form--success" to={`/user/add`}>
            Add new
          </Link>
        </div>
      )}
      <UsersList usersList={displayUsers} />
      <Pagination
        currentPage={currentPage}
        totalItems={Math.ceil(filterUsers.length / itemsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
