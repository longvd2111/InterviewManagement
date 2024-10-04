import React, { useState } from "react";
import "../../assets/css/job-css/SearchJob.css"; // Import CSS file
import { FaSearch } from "react-icons/fa";

const SearchJob = ({ onSearch }) => {
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const handleSearch = () => {
    onSearch(searchName.trim(), searchStatus);
  };

  return (
    <div className="search-container">
      <label>
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Search Jobs here..."
        />
        <FaSearch className="icon" />
      </label>
      <label>
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">Status</option>
          <option value="OPEN">Open</option>
          <option value="DRAFT">Draft</option>
          <option value="CLOSED">Close</option>
        </select>
      </label>
      <button className="button-form" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchJob;
