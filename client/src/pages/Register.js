import { Button } from 'react-bootstrap';

import API from '../utils/API';

const Register = () => {

  const handleSubmit = async e => {
    e.preventDefault();

    const userData = {
      username: 'akdfljs',
      email: 'asdflkj@asdlkjf.com',
      password: 'faSlskd9fjlakdsj!'
    }

    try {
      const res = await API.register(userData);
      console.log(res.data);
    } catch(err) {
      console.log(err);
    }

  }

  return (
    <>
      <Button variant="primary" onClick={handleSubmit}>Primary</Button>
    </>
  )
}

export default Register;
