import React, { useState } from "react";
import "../../assets/css/candidate-css/Search.css";
import { FaSearch } from "react-icons/fa";
import { roleUser } from "~/data/Constants";
const SearchUser = ({ onSearch }) => {
  const [searchName, setSearchName] = useState("");
  const [searchRole, setSearchRole] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchName.trim(), searchRole);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} style={{ display: "flex" }}>
        <label>
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search"
          />
          <FaSearch className="icon" />
        </label>
        <label>
          <select
            value={searchRole}
            onChange={(e) => setSearchRole(e.target.value)} // Thay đổi tham chiếu đến setSearchRole
          >
            <option value="">Role</option>
            {Object.entries(roleUser).map(([value, name]) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="button-form">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchUser;
