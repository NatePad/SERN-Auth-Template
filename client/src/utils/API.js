import axios from 'axios';

export default {
  login: userData => {
    return axios.post('/api/users/login', userData);
  },

  register: userData => {
    return axios.post('/api/users/register', userData);
  }
}