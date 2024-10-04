import React, { useEffect, useState } from "react";

import JobsList from "../jobs/JobsList";
import "../../assets/css/job-css/Job.css";

import { fetchAllJobs } from "~/services/jobApi";

export default function Job() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchAllJobs()
      .then((response) => setJobs(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="App">
      <div className="breadcrumb__group">
        <span className="breadcrumb-link">Jobs List</span>
      </div>

      <JobsList jobs={jobs} />
      {/* <Pagination /> */}

      {/* <div className="alert-job">
        <Alert
          show={showAlert}
          variant={alertMessage.includes("Error") ? "danger" : "success"}
          onClose={handleAlertClose}
          dismissible
        >
          <Alert.Heading>{alertMessage.includes("Error") ? "Error" : "Success"}</Alert.Heading>
          <p>{alertMessage}</p>
        </Alert>
      </div> */}
    </div>
  );
}
