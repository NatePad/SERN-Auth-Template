import axios from 'axios';

const API = {
  findByUsername: username => {
    return axios.get('api/users/username/' + username);
  },


  login: userData => {
    return axios.post('api/users/login', userData);
  },


  register: userData => {
    return axios.post('/api/users/register', userData);
  }
}

export default API;