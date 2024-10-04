import React, { useCallback, useEffect, useState } from "react";
// Import CSS file
import { FaSearch } from "react-icons/fa";
import { InterviewStatus, userRole } from "../../data/Constants";
import { fetchAllUser } from "~/services/userServices";
import _, { debounce } from "lodash";

// const ROLE_RECRUITER = userRole.find((role) => role.value === "ROLE_RECRUITER");

const SearchInterview = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [selectedRecruiter, setSelectedRecruiter] = useState("");
  const [listRecruiters, setListRecruiters] = useState("");

  const debouncedSearch = () => {
    onSearch(searchText.trim(), selectedStatus, selectedRecruiter);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch interviewers data
        const res = await fetchAllUser(0, 100); // Adjust parameters as needed

        // Assuming res.data contains the array of interviewers
        if (res && res.data) {
          // Filter interviewers based on ROLE_INTERVIEWER
          const ROLE_RECRUITER = userRole.find(
            (role) => role.value === "ROLE_RECRUITER"
          );
          if (ROLE_RECRUITER) {
            const clonedListUsers = _.filter(
              res.data,
              (o) => o.userRole === ROLE_RECRUITER.value
            );
            setListRecruiters(clonedListUsers);
          } else {
            console.error("ROLE_RECRUITER not found in userRole:", userRole);
          }
        }
      } catch (error) {
        console.error("Error fetching interviewers:", error);
      }
    };

    fetchData(); // Call the fetch data function
  }, []);

  // Hàm debounce cho handleKeyPress
  const debouncedHandleKeyPress = useCallback(
    debounce((e) => {
      if (e.key === "Enter") {
        debouncedSearch();
      }
    }, 300),
    [debouncedSearch]
  );

  const handleKeyPress = (e) => {
    // Gọi hàm debounce cho handleKeyPress
    debouncedHandleKeyPress(e);
  };
  return (
    <div className="search-container">
      <label>
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search"
          onKeyPress={handleKeyPress}
        />
        <FaSearch className="icon" />
      </label>

      <label>
        <select
          aria-label="Recruiter"
          value={selectedRecruiter}
          onChange={(e) => setSelectedRecruiter(e.target.value)}
        >
          <option value={""}>Show all Recruiter</option>
          {listRecruiters &&
            listRecruiters.length >= 0 &&
            listRecruiters?.map((item, index) => {
              return (
                <option key={index} value={item.fullName}>
                  {item?.fullName}
                </option>
              );
            })}
        </select>
      </label>

      <label>
        <select
          aria-label="Status"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          multiple={false}
        >
          <option value={0}>Status</option>
          {InterviewStatus.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        className="button-form"
        onClick={() => debouncedSearch()}
      >
        Search
      </button>
    </div>
  );
};

export default SearchInterview;
