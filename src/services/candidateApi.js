import axios from "~/services/customize-axios";

const fetchAllCandidate = () => {
  return axios.get(`/api/candidates`, { params: { index: 0, size: 100 } });
};

const fetchCandidateById = (id) => {
  return axios.get(`/api/candidates/${id}`);
};
const createCandidate = (candidateData) => {
  return axios.post("/api/candidates", candidateData);
};

const updateCandidate = (candidateData) => {
  return axios.put(`/api/candidates`, candidateData);
};

const deleteCandidate = (id) => {
  return axios.delete(`/api/candidates?id=${id}`);
};

export {
  fetchAllCandidate,
  fetchCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
};
