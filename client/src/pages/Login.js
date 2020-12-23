import { createRef } from 'react';

import {
  Button,
  Container,
  Form
} from 'react-bootstrap';

const Login = () => {
  const email = createRef();
  const password = createRef();


  const handleSubmit = e => {
    e.preventDefault();

    const userData = {
      email: email.current.value.trim(),
      password: password.current.value.trim()
    }

    console.log(userData);
  }


  return (
    <Container>
      <h1 className="mb-3">Login Page</h1>
      <Form onSubmit={handleSubmit}>

        <Form.Group controlId="email">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control type="email" placeholder="your@email.com" ref={email} />
          <Form.Text className="text-danger">
            We'll never share your email with anyone else.
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