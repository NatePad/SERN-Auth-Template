import { Button } from 'react-bootstrap';

import API from '../utils/API';

const Register = () => {

  const handleSubmit = e => {
    e.preventDefault();

    const userData = {
      username: 'akdfljs!',
      email: 'asdflkj@asdlkjf.com',
      password: 'alskdfjlakdsj'
    }

    API.register(userData)
      .then(res => {
        console.log(res.data);
      });
  }

  return (
    <>
      <Button variant="primary" onClick={handleSubmit}>Primary</Button>
    </>
  )
}

export default Register;
