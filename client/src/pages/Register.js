import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import {
  validateUsername, invalUsernameMsg,
  validateEmail, invalEmailMsg,
  validatePassword, invalPasswordMsg
} from '../utils/inputValidator';

const Register = props => {
  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [completeForm, setCompleteForm] = useState(true);

  useEffect(() => {
    setCompleteForm(true);
    setValidUsername(validateUsername(username));
  }, [username]);

  useEffect(() => {
    setCompleteForm(true);
    setValidEmail(validateEmail(email));
  }, [email]);

  useEffect(() => {
    setCompleteForm(true);
    setValidPassword(validatePassword(password));
  }, [password]);

  useEffect(() => {
    setCompleteForm(true);
    setValidConfirmPassword(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = e => {
    e.preventDefault();

    if (!validUsername
      || !validEmail
      || !validPassword
      || !validConfirmPassword) {
      setCompleteForm(false);
      return;
    }

    const userData = {
      username,
      email,
      password
    }

    // console.log(userData);
  }

  return (
    <Container>
      <Form id="register-form" onSubmit={handleSubmit}>

        <Form.Group controlId="username">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            name="username"
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            type="text"
          />
          <Form.Text className={validUsername ? 'text-danger hidden' : 'text-danger'}>
            {invalUsernameMsg}
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email Address:</Form.Label>
          <Form.Control
            name="email"
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            type="email"
          />
          <Form.Text className={validEmail ? 'text-danger hidden' : 'text-danger'}>
            {invalEmailMsg}
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            name="password"
            onChange={e => setPassword(e.target.value)}
            placeholder="P@55w0rd!"
            type="password"
          />
          <Form.Text className={validPassword ? 'text-danger hidden' : 'text-danger'}>
            {invalPasswordMsg}
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="confirm-password">
          <Form.Label>Confirm Your Password:</Form.Label>
          <Form.Control
            name="confirm-password"
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Enter Password Again"
            type="password"
          />
          <Form.Text className={validConfirmPassword ? 'text-danger hidden' : 'text-danger'}>
            Your passwords do not match.
          </Form.Text>
        </Form.Group>

        <Button type="submit" variant="primary">Register</Button><br />
        <small className={completeForm ? 'text-danger hidden' : 'text-danger'}>
          Please resolve all errors on this page before registering.
        </small>
      </Form>
    </Container>
  );
}

export default Register;