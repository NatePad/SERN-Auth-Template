import { createRef, useState } from 'react';

import {
  Button,
  Container,
  Form
} from 'react-bootstrap';

import { useStoreContext } from '../utils/GlobalState';
import { LOGIN } from '../utils/actions';

import API from '../utils/API';

const Login = () => {
  const [state, dispatch] = useStoreContext();

  const TEXT_RED = 'text-danger';
  const email = createRef();
  const [emailValid, setEmailValid] = useState(true);
  const password = createRef();
  const [passwordValid, setPasswordValid] = useState(true);


  const handleSubmit = async e => {
    e.preventDefault();

    const userData = {
      email: email.current.value.trim(),
      password: password.current.value.trim()
    }

    try {
      const results = await API.login(userData);
      if (results.data.username) {
        dispatch({
          action: LOGIN,
          userData: results.data
        });
      } else {
        setPasswordValid(false);
      }
    } catch (err) {
      setEmailValid(false);
    }
  }


  return (
    <Container>
      <h1 className="mb-3">Login Page</h1>
      <Form onSubmit={handleSubmit}>

        <Form.Group controlId="email">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control
            type="email"
            placeholder="your@email.com"
            ref={email}
            onChange={() => setEmailValid(true)}
          />
          <Form.Text className={emailValid ? `${TEXT_RED} invisible` : TEXT_RED}>
            Our lemmings can't find that email in our system.
          </Form.Text>
        </Form.Group>


        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="P@ssw0rd!"
            ref={password}
            onChange={() => setPasswordValid(true)}
          />
          <Form.Text className={passwordValid ? `${TEXT_RED} invisible` : TEXT_RED}>
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