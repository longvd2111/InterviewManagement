import axios from "~/services/customize-axios";

const ApiUser = {
  getUsers: async (index = 0, size = 100) => {
    return axios.get(`/api/users`, {
      params: { index, size },
    });
  },
  getDetailUser: async (id) => {
    return axios.get(`/api/users/${id}`);
  },

  editUser: async (formdata) => {
    return axios.put(`/api/users`, formdata);
  },
  postUser: async (formdata) => {
    return axios.post(`/api/users`, formdata);
  },
};
export default ApiUser;
