import { useEffect, useState } from 'react';

import {
  Button,
  Container,
  Form
} from 'react-bootstrap';

import API from '../utils/API';

const Register = () => {
  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);

  const [completeForm, setCompleteForm] = useState(true);


  useEffect(() => {
    setCompleteForm(true);
    let valid = true;
    if (username.length < 6 || username.length > 35)
      valid = false;

    const validChars = '0123456789abcdefghijklmnopqrstuvwxyz.';
    for (let i = 0; i < username.length; i++) {
      if (!validChars.includes(username.charAt(i)))
        valid = false
    }

    setValidUsername(valid);
  }, [username]);


  useEffect(() => {
    setCompleteForm(true);

    const regex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
    let valid = regex.test(email);
    if (email.length > 350)
      valid = false;

    setValidEmail(valid);
  }, [email]);


  useEffect(() => {
    setCompleteForm(true);

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    let valid = regex.test(password);

    if (password.length < 8 || password.length > 128)
      valid = false;

    setValidPassword(valid);
  }, [password]);


  const handleSubmit = async e => {
    e.preventDefault();

    if (!validUsername || !validEmail || !validPassword) {
      setCompleteForm(false);
      return;
    }

    const userData = {
      username,
      email,
      password
    }

    console.log(userData);

    try {
      const res = await API.register(userData);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container>
      <h1 className="mb-3">Register for an Account:</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="username" placeholder="Username" onChange={e => setUsername(e.target.value)} />
          <Form.Text className={validUsername ? 'text-danger invisible' : 'text-danger'}>
            Usernames can be 6 to 35 chars and can contain letters, numbers, and periods.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
          <Form.Text className={validEmail ? 'text-danger invisible' : 'text-danger'}>
            Please enter a valid email address.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <Form.Text className={validPassword ? 'text-danger invisible' : 'text-danger'}>
            Passwords need to be at least 8 characters and contain both a lower and uppercase letter, a number, and a special character.
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Form.Text className={completeForm ? 'text-danger invisible' : 'text-danger'}>
          Please fix all remaining form errors.
        </Form.Text>
      </Form>

    </Container>
  )
}

export default Register;
