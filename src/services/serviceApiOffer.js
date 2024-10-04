
import axios from '~/services/customize-axios';



const ApiService = {
  ApiOffer: async (index = 0, size = 100) => {
    return axios.get(`/api/offers`, {
      params: { index, size },
    });
  },
  ApiAddOffer: async (formData) => {
    return axios.post(`/api/offers`, formData);
  },
  ApiDetailOffer: async (id) => {
    return axios.get(`/api/offers/${id}`);
  },
  ApiEditOffer: async ( data) => {
    return axios.put(`/api/offers`, data);
  },
  ApiInterview: async (index = 0, size = 100) => {
    return axios.get(`/api/interviews`, {
      params: { index, size },
    });
  },
};

export default ApiService;