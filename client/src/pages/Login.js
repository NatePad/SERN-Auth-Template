import { useState } from 'react';

import { Link } from 'react-router-dom';

import {
  Button,
  Container,
  Form
} from 'react-bootstrap';

import { useStoreContext } from '../utils/GlobalState';
import { LOGIN } from '../utils/actions';

import API from '../utils/API';

const Login = props => {
  // eslint-disable-next-line
  const [state, dispatch] = useStoreContext();

  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const handleSubmit = async e => {
    e.preventDefault();

    const userData = {
      email: document.querySelector('#email').value.trim(),
      password: document.querySelector('#current-password').value.trim()
    }

    try {
      const results = await API.login(userData);

      if (results.data.username) {
        dispatch({
          action: LOGIN,
          data: results.data
        });
        props.history.push('/profile');
      } else {
        setPasswordValid(false);
      }

    } catch (err) {
      setEmailValid(false);
    }
  }

  const sendPasswordEmail = async () => {
    await API.sendPasswordEmail({
      email: document.querySelector('#email').value.trim()
    });
    alert("If an account is found for the entered email, " +
      "we'll send an email with password reset instructions.");
  }


  return (
    <Container>
      <h1>Login Page</h1>
      <Form onSubmit={handleSubmit}>

        <Form.Group controlId="email">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control
            type="email"
            placeholder="your@email.com"
            onChange={() => setEmailValid(true)}
          />
          <Form.Text className={emailValid ? 'invisible' : 'text-danger'}>
            Our lemmings can't find that email in our system.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="current-password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="P@ssw0rd!"
            onChange={() => setPasswordValid(true)}
          />
          <Form.Text className={passwordValid ? 'invisible' : 'text-danger'}>
            Forgot your password?
            <Button variant="link" size="sm" onClick={sendPasswordEmail}>
              Click here!
            </Button>
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>

      </Form>
      <p>Don't have an account? <Link to="/register">Register here!</Link></p>
    </Container>
  )
}

export default Login;
