import React, { createRef } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import API from '../utils/API';

const Login = props => {
  const email = createRef();
  const password = createRef();

  const handleSubmit = e => {
    e.preventDefault();

    const userData = {
      email: email.current.value,
      password: password.current.value
    }

    API.login(userData)
      .then(res => {
        console.log('All good!');
        console.log(res);
      })
      .catch(err => {
        console.log('Uh oh! Something went wrong');
        console.log(err);
      })
  }

  return (
    <Container>

      <Form id="login-form" onSubmit={handleSubmit}>

        <Form.Group controlId="email">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control
            name="email"
            placeholder="your@email.com"
            ref={email}
            type="email"
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            name="password"
            placeholder="Enter Password"
            ref={password}
            type="password"
          />
        </Form.Group>

        <Button type="submit" variant="primary">Sign In</Button>
      </Form>

    </Container>
  );
}

export default Login;
