import axios from 'axios';

const API = {
  findByUsername: username => {
    return axios.get('api/users/username/' + username);
  },

  login: userData => {
    return axios.post('api/users/login', userData);
  },

  loginCookie: () => {
    return axios.get('api/users/login-cookie');
  },

  register: userData => {
    return axios.post('/api/users/register', userData);
  },

  sendPasswordEmail: email => {
    return axios.post('/api/passwords/email', email);
  }
}

export default API;