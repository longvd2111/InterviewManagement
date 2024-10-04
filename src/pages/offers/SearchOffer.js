import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { departmentOffer, statusOffer } from "~/data/Constants";
const SearchOffer = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const handleSumit = (e) => {
    e.preventDefault();
    onSearch(searchQuery, department, status);
  };
  return (
    <div className="search-container">
      <form onSubmit={handleSumit} style={{ display: "flex" }}>
        <label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
          />
          <FaSearch className="icon" />
        </label>

        <label  data-testid="department">
          <select
          
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="" disabled>Department</option>
            {Object.entries(departmentOffer).map(([value, name]) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Status</option>
            {Object.entries(statusOffer).map(([value, name]) => (
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

export default SearchOffer;
