import React, { createRef, useContext, useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import API from '../utils/API';
import UserContext from '../utils/UserContext';

const Login = props => {
  const { setUserState } = useContext(UserContext);
  
  const [validEmail, setValidEmail] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const [redirect, setRedirect] = useState('');

  const email = createRef();
  const password = createRef();

  useEffect(() => {
    // This shows a warning in the console which can be ignored
    // as the necessary props won't change while this page is loaded.
    if (props.location.state) 
      setRedirect(props.location.state.from.pathname);
  }, [])

  const handleSubmit = e => {
    e.preventDefault();

    const userData = {
      email: email.current.value,
      password: password.current.value
    }

    API.login(userData)
      .then(res => {

        if (res.data.token) {
          document.cookie = `user=${res.data.token}; SameSite=Strict`;
          setUserState({ authenticated: true, ...res.data.userData });
          props.history.push('/profile');
          return;
        }

        // Possible responses:
        // INVALID_EMAIL
        // INCORRECT_PASSWORD
        // JWT_ERROR
        // SERVER_ERROR
        switch (res.data) {
          case 'INVALID_EMAIL':
            setValidEmail(false);
            break;
          case 'INCORRECT_PASSWORD':
            setValidPassword(false);
            break;
          case 'JWT_ERROR':
            console.log("It looks like the JWT_SECRET isn't set.");
            break;
          case 'SERVER_ERROR':
            console.log('Server error logging in.');
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
      {redirect
        ? <h2>You must sign in to view the {redirect.substring(1)} page:</h2>
        : <h2>Sign In:</h2>
      }
      <hr />
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
