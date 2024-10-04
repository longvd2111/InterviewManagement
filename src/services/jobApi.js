import axios from "~/services/customize-axios";

const fetchAllJobs = () => {
  return axios.get("/api/jobs", { params: { index: 0, size: 100 } });
};

const fetchJobsById = (id) => {
  return axios.get(`/api/jobs/${id}`);
};
const createJobs = (JobsData) => {
  return axios.post("/api/jobs", JobsData);
};
const deleteJobs = (id) => {
  return axios.delete(`/api/jobs?id=${id}`);
};

const updateJob = (updatedJobData) => {
  return axios.put(`/api/jobs`, updatedJobData);
};
const importJob = (jobData) => {
  return axios.post(`/api/jobs`, jobData);
};

export {
  fetchAllJobs,
  fetchJobsById,
  createJobs,
  deleteJobs,
  updateJob,
  importJob,
};
