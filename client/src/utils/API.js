import axios from 'axios';

const API = {
  findByUsername: username => {
    return axios.get('/api/users/username/' + username);
  },

  login: userData => {
    return axios.post('/api/users/login', userData);
  },

  loginCookie: () => {
    return axios.get('/api/users/login-cookie');
  },

  passwordReset: resetData => {
    return axios.post('/api/passwords/reset', resetData);
  },

  register: userData => {
    return axios.post('/api/users/register', userData);
  },

  sendPasswordEmail: email => {
    return axios.post('/api/passwords/email', email);
  },

  updateProfile: userData => {
    return axios.post('/api/users/update', userData);
  }
}

export default API;