import React from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../assets/css/job-css/JobList.css";
import { roleUser,statusUser } from "~/data/Constants";

export default function UsersList({ usersList }) {
  const navigate = useNavigate();

  const handleView = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleEdit = (userId) => {
    navigate(`/user/edit/${userId}`);
  };

  return (
    <>
      <table className="table table--striped table--bordered table--hover table--responsive">
        <thead className="table__head">
          <tr className="table__row">
            <th className="table__header">Username</th>
            <th className="table__header">Email</th>
            <th className="table__header">Phone No.</th>
            <th className="table__header">Role</th>
            <th className="table__header">Status</th>
            <th className="table__header">Actions</th>
          </tr>
        </thead>
        <tbody className="table__body">
          {usersList.map((user) => (
            <tr key={user.id} className="table__row">
              <td className="table__cell">{user.username}</td>
              <td className="table__cell">{user.email}</td>
              <td className="table__cell">{user.phone}</td>
              <td className="table__cell">{roleUser[user.userRole]}</td>
              <td className="table__cell">{statusUser[user.userStatus]}</td>
              <td className="table__cell">
                <FaEye
                  onClick={() => handleView(user.id)}
                  style={{ cursor: "pointer", marginRight: "10px",height:"20px",width:"20px" }}
                  data-testid={`view-icon-${user.id}`}
                />
                <FaEdit
                  onClick={() => handleEdit(user.id)}
                  style={{ cursor: "pointer", marginRight: "10px",height:"20px",width:"20px" }}
                  data-testid={`edit-icon-${user.id}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
