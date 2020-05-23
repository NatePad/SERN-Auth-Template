import axios from 'axios';

export default {

  auth: () => {
    return axios.get('api/users/auth');
  },

  login: userData => {
    return axios.post('/api/users/login', userData);
  },

  register: userData => {
    return axios.post('/api/users/register', userData);
  }
}