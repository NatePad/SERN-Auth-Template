import axios from 'axios';

const API = {
  register: userData => {
      return axios.post('/api/users/register', userData);
  }
}

export default API;