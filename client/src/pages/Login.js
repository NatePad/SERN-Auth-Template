import { createRef } from 'react';

import {
  Button,
  Container,
  Form
} from 'react-bootstrap';

import API from '../utils/API';

const Login = () => {
  const email = createRef();
  const password = createRef();


  const handleSubmit = async e => {
    e.preventDefault();

    const userData = {
      email: email.current.value.trim(),
      password: password.current.value.trim()
    }

    try {
      const results = await API.login(userData);
      console.log(results);
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <Container>
      <h1 className="mb-3">Login Page</h1>
      <Form onSubmit={handleSubmit}>

        <Form.Group controlId="email">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control type="email" placeholder="your@email.com" ref={email} />
          <Form.Text className="text-danger">
            Our lemmings can't find that email in our system.
          </Form.Text>
        </Form.Group>


        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" placeholder="P@ssw0rd!" ref={password} />
          <Form.Text className="text-danger">
            That password is incorrect.
          </Form.Text>
        </Form.Group>


        <Button variant="primary" type="submit">
          Submit
        </Button>

      </Form>
    </Container>
  )
}

export default Login;