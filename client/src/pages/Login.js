import React, { createRef, useContext, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import API from '../utils/API';
import UserContext from '../utils/UserContext';

const Login = props => {
  const { setUserState } = useContext(UserContext);
  
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);

  const email = createRef();
  const password = createRef();

  const handleSubmit = e => {
    e.preventDefault();

    const userData = {
      email: email.current.value,
      password: password.current.value
    }

    API.login(userData)
      // Possible responses:
      // SUCCESSFUL_LOGIN
      // INVALID_EMAIL
      // INCORRECT_PASSWORD
      // SERVER_ERROR
      .then(res => {

        if (res.data.success) {
          document.cookie = `user=${res.data.token}; SameSite=Strict`;
          setUserState({ authenticated: true });
          return;
        }

        switch (res.data) {
          case 'INVALID_EMAIL':
            setValidEmail(false);
            break;
          case 'INCORRECT_PASSWORD':
            setValidPassword(false);
            break;
          default:
            console.log('Unexpected response from server.');
        }
      })
      .catch(err => {
        console.log('Uh oh! Something went wrong.');
      });
  }

  return (
    <Container>

      <Form id="login-form" onSubmit={handleSubmit}>

        <Form.Group controlId="email">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control
            name="email"
            onChange={() => setValidEmail(true)}
            placeholder="your@email.com"
            ref={email}
            type="email"
          />
          <Form.Text className={validEmail ? 'text-danger hidden' : 'text-danger'}>
            Our lemmings can't find that email address in our system.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            name="password"
            onChange={() => setValidPassword(true)}
            placeholder="Enter Password"
            ref={password}
            type="password"
          />
          <Form.Text className={validPassword ? 'text-danger hidden' : 'text-danger'}>
            Incorrect password.
          </Form.Text>
        </Form.Group>

        <Button type="submit" variant="primary">Sign In</Button><br />
      </Form>

    </Container>
  );
}

export default Login;
