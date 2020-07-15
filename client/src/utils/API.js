import axios from 'axios';

export default {

  auth: () => {
    return axios.get('/api/users/auth');
  },

  checkUsername: username => {
    return axios.get('/api/users/check-username/' + username);
  },

  login: userData => {
    return axios.post('/api/users/login', userData);
  },

  register: userData => {
    return axios.post('/api/users/register', userData);
  },

  resetPass: userData => {
    return axios.post('/api/users/reset-pass', userData);
  },

  sendPasswordEmail: userData => {
    return axios.post('/api/users/send-password-email', userData);
  },

  updateUserPassword: userData => {
    return axios.post('/api/users/update-password', userData);
  },

  updateUserProfile: userData => {
    return axios.post('/api/users/update-profile', userData);
  }
}