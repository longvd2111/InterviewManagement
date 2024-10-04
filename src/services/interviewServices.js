import axios from "./customize-axios";

const fetchInterview = (index, pageSize) => {
  return axios.get(`/api/interviews?index=${index}&size=100`);
};

const fetchInterviewDetail = (id) => {
  return axios.get(`/api/interviews/${id}`);
};

const postInterview = (formData) => {
  return axios.post("/api/interviews", formData);
};

const putInterview = (formData) => {
  return axios.put("/api/interviews", formData);
};

// const postCreateUser = (name, job) => {
//   return axios.post("/api/users", { name: name, job: job });
// };

// const putUpdateUser = (id, name, job) => {
//   return axios.put(`./api/users/${id}`, { name: name, job: job });
// };

export { fetchInterview, fetchInterviewDetail, postInterview, putInterview };
