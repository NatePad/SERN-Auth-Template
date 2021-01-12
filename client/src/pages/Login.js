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
import CurrentPassword from '../components/UserProfileInputs/CurrentPassword';

const Login = props => {
  // eslint-disable-next-line
  const [state, dispatch] = useStoreContext();

  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);

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
        setValidPassword(false);
      }

    } catch (err) {
      setValidEmail(false);
    }
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
            onChange={() => setValidEmail(true)}
          />
          <Form.Text className={validEmail ? 'invisible' : 'text-danger'}>
            Our lemmings can't find that email in our system.
          </Form.Text>
        </Form.Group>

        <CurrentPassword valid={validPassword} setValid={setValidPassword} />

        <Button variant="primary" type="submit">
          Submit
        </Button>

      </Form>
      <p>Don't have an account? <Link to="/register">Register here!</Link></p>
    </Container>
  )
}

export default Login;
