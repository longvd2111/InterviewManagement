import React, { useState } from "react";
import "../../assets/css/candidate-css/Search.css";
import { FaSearch } from "react-icons/fa";
import { optionsStatus } from "~/data/Constants"; // Adjust the path if needed

const SearchCandidate = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = () => {
    onSearch(query, status);
  };

  return (
    <div className="search-container">
      <label>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
        />
        <FaSearch className="icon" />
      </label>
      <label>
        <select
          data-testid="searchStatus"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Status</option>
          {optionsStatus.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleSearch} className="button-form">
        Search
      </button>
    </div>
  );
};

export default SearchCandidate;
