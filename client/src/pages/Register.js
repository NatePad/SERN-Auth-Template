import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Container,
  Form,
  Modal
} from 'react-bootstrap';
import API from '../utils/API';
import {
  validateUsername, invalUsernameMsg,
  validateEmail, invalEmailMsg,
  validatePassword, invalPasswordMsg
} from '../utils/InputValidator';
import UserState from '../utils/UserContext';

const Register = props => {
  const { userState, setUserState } = useContext(UserState);
  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(true);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validConfirmPassword, setValidConfirmPassword] = useState(true);
  const [completeForm, setCompleteForm] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalText, setModalText] = useState('Loading...');

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
    setValidConfirmPassword(password === confirmPassword
      || confirmPassword.length < 1);
  }, [password, confirmPassword]);

  const closeModal = () => {
    setModalShow(false);
    if (userState.authenticated) props.history.push('/');
  }

  const handleSubmit = e => {
    e.preventDefault();

    if (!validUsername || username.length < 1
      || !validEmail || email.length < 1
      || !validPassword || password.length < 1
      || !validConfirmPassword || confirmPassword.length < 1) {
      setCompleteForm(false);
      return;
    }

    setModalShow(true);
    const userData = {
      username: username.trim(),
      email: email.trim(),
      password
    }

    API.register(userData)
      .then(res => {

        // Auto log in:
        if (res.data.token) {
          document.cookie = `user=${res.data.token}; SameSite=Strict`;
          setUserState({ authenticated: true, ...res.data.userData });
          setModalText(`Thank you for registering, ${username}. Your account has been created successfully.`);
          return;
        }

        // Possible responses:
        // ACCOUNT_CREATED
        // BAD_REQUEST
        // DUPLICATE_EMAIL
        // DUPLICATE_USERNAME
        // JWT_ERROR
        // SERVER_ERROR
        switch(res.data) {
          case 'ACCOUNT_CREATED':
            setModalText(`Thank you for registering, ${username}. Your account has been created successfully.`);
            break;
          case 'BAD_REQUEST':
            setModalText(`Some of your data was not accepted by the server. Please try registering again.`);
            break;
          case 'DUPLICATE_EMAIL':
            setModalText(`It looks like the email address ${email} has already been registered.`);
            break;
          case 'DUPLICATE_USERNAME':
            setModalText(`It looks like the username ${username} has already been taken. Please try again with a different username.`);
            break;
          case 'JWT_ERROR':
            console.log("It looks like the JWT_SECRET isn't set.");
            break;
          case 'SERVER_ERROR':
            setModalText(`Uhoh. It looks like something went wrong on the server. Please try registering again later.`);
            break;
          default:
            setModalText(`The server has sent an unexpected response. This is awkward.`);
        }
      })
      .catch(err => {
        setModalText(`Uhoh. It looks like something went wrong. Please try registering again later.`);
      });
  }

  return (
    <Container>
      <h2>Register for a new account:</h2>
      <hr />
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
          Please fill out the form completely before registering.
        </small>
      </Form>

      <Modal
        centered
        onHide={closeModal}
        show={modalShow}
        size="lg"
      >
        <Modal.Body>
          <p>{modalText}</p>
          {userState.authenticated
          ? (
            <Button variant="success" onClick={() => props.history.push('/profile')}>
              View My Profile
            </Button>
          ) : (
            <Button variant="primary" onClick={closeModal}>OK</Button>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Register;